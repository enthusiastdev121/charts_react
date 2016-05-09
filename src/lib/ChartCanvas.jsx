"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { shallowEqual, identity, last, isDefined, isNotDefined } from "./utils";
import { shouldShowCrossHairStyle } from "./utils/ChartDataUtil";

import EventHandler from "./EventHandler";
import CanvasContainer from "./CanvasContainer";
import eodIntervalCalculator from "./scale/eodIntervalCalculator";
import evaluator from "./scale/evaluator";


const CANDIDATES_FOR_RESET = ["seriesName", /* "data",*/"interval", "discontinuous",
	"intervalCalculator", "allowedIntervals",
	"xScale", /* "xAccessor",*/"map", "dataEvaluator",
	"indexAccessor", "indexMutator"];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(key => {
		var result = shallowEqual(thisProps[key], nextProps[key]);
		// console.log(key, result);
		return result;
	});
}

function getDimensions(props) {
	return {
		height: props.height - props.margin.top - props.margin.bottom,
		width: props.width - props.margin.left - props.margin.right,
	};
}

function calculateFullData(props) {
	var { data, calculator } = props;
	var { xScale, intervalCalculator, allowedIntervals, plotFull } = props;
	var { xAccessor: inputXAccesor, map, dataEvaluator, indexAccessor, indexMutator, discontinuous } = props;

	var wholeData = isDefined(plotFull) ? plotFull : inputXAccesor === identity;

	var evaluate = dataEvaluator()
		.allowedIntervals(allowedIntervals)
		.intervalCalculator(intervalCalculator)
		.xAccessor(inputXAccesor)
		.discontinuous(discontinuous)
		.indexAccessor(indexAccessor)
		.indexMutator(indexMutator)
		.map(map)
		.useWholeData(wholeData)
		.scale(xScale)
		.calculator(calculator.slice());

	var { xAccessor, domainCalculator: xExtentsCalculator, fullData } = evaluate(data);

	return {
		xAccessor,
		xExtentsCalculator,
		fullData,
	};
}

function calculateState(props) {

	var { data, interval, allowedIntervals } = props;
	var { xAccessor: inputXAccesor, xExtents: xExtentsProp, xScale } = props;

	if (isDefined(interval)
		&& (isNotDefined(allowedIntervals)
			|| allowedIntervals.indexOf(interval) > -1)) throw new Error("interval has to be part of allowedInterval");


	var { xAccessor, xExtentsCalculator, fullData } = calculateFullData(props);

	var dimensions = getDimensions(props);
	// xAccessor - if discontinious return indexAccessor, else xAccessor
	// inputXAccesor - send this down as context

	// console.log(xAccessor, inputXAccesor, domainCalculator, domainCalculator, updatedScale);
	// in componentWillReceiveProps calculate plotData and interval only if this.props.xExtentsProp != nextProps.xExtentsProp

	var extent = typeof xExtentsProp === "function"
		? xExtentsProp(fullData)
		: d3.extent(xExtentsProp.map(d3.functor).map(each => each(data, inputXAccesor)));

	var { plotData, interval: showingInterval, scale: updatedScale } = xExtentsCalculator
			.width(dimensions.width)
			.scale(xScale)
			.data(fullData)
			.interval(interval)(extent, inputXAccesor);

	// console.log(updatedScale.domain());
	return {
		fullData,
		plotData,
		showingInterval,
		xExtentsCalculator,
		xScale: updatedScale,
		xAccessor,
		dataAltered: false,
	};
}

function getCursorStyle(children) {
	var style = `
	.react-stockcharts-grabbing-cursor {
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}
	.react-stockcharts-crosshair-cursor {
		cursor: crosshair;
	}
	.react-stockcharts-toottip-hover {
		pointer-events: all;
		cursor: pointer;
	}`;
	var tooltipStyle = `
	.react-stockcharts-annotate {
		cursor: default;
	}`;
	/* return (<style
		type="text/css"
		dangerouslySetInnerHTML={{
			__html: shouldShowCrossHairStyle(children) ? style + tooltipStyle : tooltipStyle
		}}></style>);*/
	return (<style type="text/css">{shouldShowCrossHairStyle(children) ? style + tooltipStyle : tooltipStyle}</style>);
}

class ChartCanvas extends Component {
	constructor() {
		super();
		this.getDataInfo = this.getDataInfo.bind(this);
		this.getCanvases = this.getCanvases.bind(this);
	}
	getDataInfo() {
		return this.refs.chartContainer.getDataInfo();
	}
	getCanvases() {
		if (this.refs && this.refs.canvases) {
			return this.refs.canvases.getCanvasContexts();
		}
	}
	getChildContext() {
		return {
			displayXAccessor: this.props.xAccessor,
		};
	}
	componentWillMount() {
		this.setState(calculateState(this.props));
	}
	componentWillReceiveProps(nextProps) {
		var reset = shouldResetChart(this.props, nextProps);
		// console.log("shouldResetChart =", reset);

		if (reset) {
			if (process.env.NODE_ENV !== "production") console.log("RESET CHART, one or more of these props changed", CANDIDATES_FOR_RESET);
			this.setState(calculateState(nextProps));
		} else if (!shallowEqual(this.props.xExtents, nextProps.xExtents)) {
			if (process.env.NODE_ENV !== "production") console.log("xExtents changed");
			// since the xExtents changed update fullData, plotData, xExtentsCalculator to state
			let { fullData, plotData, xExtentsCalculator, xScale } = calculateState(nextProps);
			this.setState({ fullData, plotData, xExtentsCalculator, xScale, dataAltered: false });
		} else if (this.props.data !== nextProps.data) {
			if (process.env.NODE_ENV !== "production") console.log("data is changed but seriesName did not");
			// this means there are more points pushed/removed or existing points are altered
			// console.log("data changed");
			let { fullData } = calculateFullData(nextProps);
			this.setState({ fullData, dataAltered: true });
		} else if (!shallowEqual(this.props.calculator, nextProps.calculator)) {
			if (process.env.NODE_ENV !== "production") console.log("calculator changed");
			// data did not change but calculator changed, so update only the fullData to state
			let { fullData } = calculateFullData(nextProps);
			this.setState({ fullData, dataAltered: false });
		} else {
			if (process.env.NODE_ENV !== "production")
				console.log("Trivial change, may be width/height or type changed, but that does not matter");
		}
	}
	render() {
		var cursor = getCursorStyle(this.props.children);

		var { interval, data, type, height, width, margin, className, zIndex, postCalculator, flipXScale } = this.props;
		var { padding } = this.props;
		var { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor, dataAltered } = this.state;

		var dimensions = getDimensions(this.props);
		var props = { padding, interval, type, margin, postCalculator };
		var stateProps = { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor, dataAltered };
		return (
			<div style={{ position: "relative", height: height, width: width }} className={className} >
				<CanvasContainer ref="canvases" width={width} height={height} type={type} zIndex={zIndex}/>
				<svg className={className} width={width} height={height} style={{ position: "absolute", zIndex: (zIndex + 5) }}>
					{cursor}
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={dimensions.width} height={dimensions.height} />
						</clipPath>
					</defs>
					<g transform={`translate(${margin.left + 0.5}, ${margin.top + 0.5})`}>
						<EventHandler ref="chartContainer"
							{...props}
							{...stateProps}
							direction={flipXScale ? -1 : 1}
							lastItem={last(data)}
							dimensions={dimensions}
							canvasContexts={this.getCanvases}>
							{this.props.children}
						</EventHandler>
					</g>
				</svg>
			</div>
		);
	}
}

/*
							interval={interval} type={type} margin={margin}
							data={plotData} showingInterval={updatedInterval}
							xExtentsCalculator={domainCalculator}
							xScale={updatedScale} xAccessor={xAccessor}
							dimensions={dimensions}

*/

ChartCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object,
	interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	data: PropTypes.array.isRequired,
	initialDisplay: PropTypes.number,
	calculator: PropTypes.arrayOf(PropTypes.func).isRequired,
	xAccessor: PropTypes.func,
	xExtents: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	xScale: PropTypes.func.isRequired,
	className: PropTypes.string,
	seriesName: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
	discontinuous: PropTypes.bool.isRequired,
	postCalculator: PropTypes.func.isRequired,
	flipXScale: PropTypes.bool.isRequired,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
		})
	]).isRequired,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	indexAccessor: d => d.idx,
	indexMutator: (d, idx) => d.idx = idx,
	map: identity,
	type: "hybrid",
	calculator: [],
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [d3.min, d3.max],
	intervalCalculator: eodIntervalCalculator,
	dataEvaluator: evaluator,
	discontinuous: false,
	postCalculator: identity,
	padding: 0,
	xAccessor: identity,
	flipXScale: false,
	// initialDisplay: 30
};

ChartCanvas.childContextTypes = {
	displayXAccessor: PropTypes.func,
};

ChartCanvas.ohlcv = d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume });

export default ChartCanvas;