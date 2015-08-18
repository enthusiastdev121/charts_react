"use strict";

import React from "react";
import PureComponent from "./utils/PureComponent";
import Utils from "./utils/utils";

class Chart extends PureComponent {
	constructor() {
		super();
		this.state = {};
		this.updateCanvasContext = this.updateCanvasContext.bind(this);
	}
	getChildContext() {
		var chartData = this.context.chartData.filter((each) => each.id === this.props.id)[0];
		var origin = this.getOrigin();

		return {
			xScale: chartData.plot.scales.xScale,
			yScale: chartData.plot.scales.yScale,
			xAccessor: chartData.config.accessors.xAccessor,
			yAccessor: chartData.config.accessors.yAccessor,
			overlays: chartData.config.overlays,
			compareSeries: chartData.config.compareSeries,
			indicatorOptions: chartData.config.indicatorOptions,
			isCompareSeries: chartData.config.compareSeries.length > 0,
			width: this.props.width || this.context.width,
			height: this.props.height || this.context.height,
			canvasContext: this.state.canvasContext,
		};
	}
	getOrigin() {
		var origin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		return origin;
	}
	componentWillUpdate() {
		if (this.state.canvasContext) {
			var width = this.props.width || this.context.width;
			var height = this.props.height || this.context.height;
			this.state.canvasContext.clearRect(-0.5, -0.5, width, height);
		}
	}
	updateCanvasContext(context) {
		let ctx = this.getChildContext();
		let canvas = context.createCanvas(this.getOrigin(), ctx.width, ctx.height);
		let canvasContext = canvas.getContext('2d');
		canvasContext.translate(0.5, 0);
		this.setState({
			canvasContext: canvasContext
		});
	}
	componentDidMount() {
		// console.log("Chart.componentDidMount()");
		if (this.context.type !== "svg") {
			// console.log("Chart.componentDidMount()");
			this.updateCanvasContext(this.context);
		}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (nextContext.type !== "svg" && this.context.type === "svg") {
			// changing from svg to hybrid
			this.updateCanvasContext(nextContext);
		}
	}
	render() {
		// console.log("Chart.render()");
		var origin = this.getOrigin();
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, Utils.mergeObject({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return <g transform={`translate(${origin[0]}, ${origin[1]})`}>{children}</g>;
	}
}

Chart.propTypes = {
	height: React.PropTypes.number,
	width: React.PropTypes.number,
	origin: React.PropTypes.oneOfType([
				React.PropTypes.array
				, React.PropTypes.func
			]).isRequired,
	id: React.PropTypes.number.isRequired,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xDomainUpdate: React.PropTypes.bool,
	yDomainUpdate: React.PropTypes.bool,
	yMousePointerDisplayLocation: React.PropTypes.oneOf(["left", "right"]),
	yMousePointerDisplayFormat: React.PropTypes.func,
	padding: React.PropTypes.object.isRequired,
};

Chart.defaultProps = {
	namespace: "ReStock.Chart",
	transformDataAs: "none",
	yDomainUpdate: true,
	origin: [0, 0],
	padding: { top: 0, right: 0, bottom: 0, left: 0 },
	// ref: (...args) => {console.log(args[1].getPublicInstance())},
};

Chart.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array,
	createCanvas: React.PropTypes.func,
	type: React.PropTypes.string.isRequired,
};

Chart.childContextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	overlays: React.PropTypes.array.isRequired,
	indicatorOptions: React.PropTypes.object,
	isCompareSeries: React.PropTypes.bool.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	canvasContext: React.PropTypes.object,
};

module.exports = Chart;
