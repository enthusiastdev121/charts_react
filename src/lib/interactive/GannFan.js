"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import {
	terminate,
	saveNodeList,
	handleClickInteractiveType,
} from "./utils";
import EachGannFan from "./hoc/EachGannFan";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class GannFan extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawFan = this.handleDrawFan.bind(this);
		this.handleDragFan = this.handleDragFan.bind(this);
		this.handleDragFanComplete = this.handleDragFanComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("fans").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.nodes = [];
		this.state = {};
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.fans);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.fans !== nextProps.fans) {
			this.updateInteractiveToState(nextProps.fans);
		}
	}
	updateInteractiveToState(fans) {
		this.setState({
			fans: fans.map(t => {
				return {
					...t,
					selected: !!t.selected
				};
			}),
		});
	}
	handleDragFan(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragFanComplete(moreProps) {
		const { override, fans } = this.state;

		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newfans = fans
				.map((each, idx) => idx === index
					? { ...each, ...rest, selected: true }
					: each);
			this.setState({
				override: null,
				fans: newfans,
			}, () => {
				this.props.onComplete(newfans, moreProps);
			});
		}
	}
	handleDrawFan(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.startXY)) {
			this.mouseMoved = true;

			this.setState({
				current: {
					startXY: current.startXY,
					endXY: xyValue,
				}
			});
		}
	}
	handleStart(xyValue) {
		const { current } = this.state;

		if (isNotDefined(current) || isNotDefined(current.startXY)) {
			this.mouseMoved = false;

			this.setState({
				current: {
					startXY: xyValue,
					endXY: null,
				}
			}, () => {
				this.props.onStart();
			});
		}
	}
	handleEnd(xyValyue, moreProps, e) {
		const { fans, current } = this.state;
		const { appearance } = this.props;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.startXY)
		) {
			const newfans = [
				...fans,
				{ ...current, selected: true, appearance }
			];
			this.setState({
				current: null,
				fans: newfans
			}, () => {
				this.props.onComplete(newfans, moreProps, e);
			});
		}
	}
	render() {
		const { enabled, appearance } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override, fans } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachGannFan
				interactive={false}
				{...current}
				appearance={appearance}
				hoverText={hoverText}
			/>
			: null;

		return <g>
			{fans.map((each, idx) => {
				const eachAppearance = isDefined(each.appearance)
					? { ...appearance, ...each.appearance }
					: appearance;

				return <EachGannFan key={idx}
					ref={this.saveNodeList}
					index={idx}
					{...(idx === overrideIndex ? override : each)}
					appearance={eachAppearance}
					hoverText={hoverText}
					onDrag={this.handleDragFan}
					onDragComplete={this.handleDragFanComplete}
				/>;
			})}
			{tempChannel}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStart}
				onClick={this.handleEnd}
				onMouseMove={this.handleDrawFan}
			/>
			<GenericChartComponent

				svgDraw={noop}
				canvasToDraw={getMouseCanvas}
				canvasDraw={noop}

				onClick={this.handleClick}

				drawOn={["mousemove", "pan", "drag"]}
			/>
		</g>;
	}
}


GannFan.propTypes = {
	enabled: PropTypes.bool.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		opacity: PropTypes.number.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired,
		fill: PropTypes.arrayOf(PropTypes.string).isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		fontStroke: PropTypes.string.isRequired,
	}).isRequired,
	hoverText: PropTypes.object.isRequired,

	fans: PropTypes.array.isRequired,
};

GannFan.defaultProps = {
	appearance: {
		stroke: "#000000",
		opacity: 0.4,
		fillOpacity: 0.2,
		strokeWidth: 1,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeStrokeWidth: 1,
		r: 5,
		fill: [
			"#1f77b4",
			"#ff7f0e",
			"#2ca02c",
			"#d62728",
			"#9467bd",
			"#8c564b",
			"#e377c2",
			"#7f7f7f",
		],
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 10,
		fontStroke: "#000000",
	},

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	fans: [],
};

export default GannFan;
