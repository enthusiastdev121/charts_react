"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericChartComponent from "../GenericChartComponent";

import { isDefined } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class OHLCTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		var { className } = this.props;
		var { width, height } = this.context;
		var { chartConfig, currentItem } = moreProps;

		var { onClick, xDisplayFormat, fontFamily, fontSize, accessor, volumeFormat, ohlcFormat } = this.props;

		var displayDate, open, high, low, close, volume;

		displayDate = open = height = low = close = volume = "n/a";

		var config = chartConfig;

		if (isDefined(currentItem)
				&& isDefined(accessor(currentItem))
				&& isDefined(accessor(currentItem).close)) {
			var item = accessor(currentItem);
			volume = volumeFormat(item.volume);

			displayDate = xDisplayFormat(item.date);
			open = ohlcFormat(item.open);
			high = ohlcFormat(item.high);
			low = ohlcFormat(item.low);
			close = ohlcFormat(item.close);
		}

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g className={`react-stockcharts-toottip-hover ${className}`} transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel key="label" x={0} dy="5">Date: </ToolTipTSpanLabel>
					<tspan key="value">{displayDate}</tspan>
					<ToolTipTSpanLabel key="label_O"> O: </ToolTipTSpanLabel><tspan key="value_O">{open}</tspan>
					<ToolTipTSpanLabel key="label_H"> H: </ToolTipTSpanLabel><tspan key="value_H">{high}</tspan>
					<ToolTipTSpanLabel key="label_L"> L: </ToolTipTSpanLabel><tspan key="value_L">{low}</tspan>
					<ToolTipTSpanLabel key="label_C"> C: </ToolTipTSpanLabel><tspan key="value_C">{close}</tspan>
					<ToolTipTSpanLabel key="label_Vol"> Vol: </ToolTipTSpanLabel><tspan key="value_Vol">{volume}</tspan>
				</ToolTipText>
			</g>
		);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOnMouseMove
			/>;
	}
}

OHLCTooltip.contextTypes = {
	chartConfig: PropTypes.object.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

OHLCTooltip.propTypes = {
	className: PropTypes.string,
	accessor: PropTypes.func.isRequired,
	xDisplayFormat: PropTypes.func.isRequired,
	ohlcFormat: PropTypes.func.isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	volumeFormat: PropTypes.func,
};

OHLCTooltip.defaultProps = {
	accessor: (d) => { return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }; },
	xDisplayFormat: d3.time.format("%Y-%m-%d"),
	volumeFormat: d3.format(".4s"),
	ohlcFormat: d3.format(".2f"),
	origin: [0, 0],
};

export default OHLCTooltip;
