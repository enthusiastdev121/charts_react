import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { getCurrentItem } from "../../utils/ChartDataUtil";
import { saveNodeType, isHover } from "../utils";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import InteractiveText from "../components/InteractiveText";

class EachText extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
			hover: false,
		};
	}
	handleDragStart() {
		const {
			position,
		} = this.props;

		this.dragStartPosition = position;
	}
	handleDrag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			mouseXY: [, mouseY],
			chartConfig: { yScale },
			xAccessor,
			currentItem,
		} = moreProps;

		const xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];

		onDrag(index, xyValue);
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	render() {
		const {
			position,
			bgFill,
			bgOpacity,
			textFill,
			fontFamily,
			fontSize,
			text,
			hoverText,
			selected,
			onDragComplete,
		} = this.props;
		const { hover } = this.state;

		const hoverHandler = {
			onHover: this.handleHover,
			onUnHover: this.handleHover
		};

		const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		return <g>
			<InteractiveText
				ref={this.saveNodeType("text")}
				selected={selected || hover}
				interactiveCursorClass="react-stockcharts-move-cursor"
				{...hoverHandler}

				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragComplete={onDragComplete}

				position={position}
				bgFill={bgFill}
				bgOpacity={(hover || selected) ? bgOpacity : 0.1}
				textFill={textFill}
				fontFamily={fontFamily}
				fontSize={fontSize}
				text={text}
			/>
			<HoverTextNearMouse
				show={hoverTextEnabled && hover && !selected}
				{...restHoverTextProps} />
		</g>;
	}
}

export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}

EachText.propTypes = {
	index: PropTypes.number,

	position: PropTypes.array.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	textFill: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,

	hoverText: PropTypes.object.isRequired,
};

EachText.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	opacity: 1,
	selected: false,
	fill: "#8AAFE2",
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	}
};

export default EachText;