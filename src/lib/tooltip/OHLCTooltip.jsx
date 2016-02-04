"use strict";

import React from "react";
import d3 from "d3";

import { first } from "../utils/utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class OHLCTooltip extends React.Component {
	render() {
		var { forChart, onClick, xDisplayFormat, fontFamily, fontSize, accessor, volumeFormat, ohlcFormat } = this.props;

		var displayDate, open, high, low, close, volume;

		displayDate = open = high = low = close = volume = "n/a";

		var { chartConfig, currentItem, width, height } = this.context;
		var config = first(chartConfig.filter(each => each.id === forChart));

		if (currentItem !== undefined && accessor(currentItem) !== undefined && accessor(currentItem).close !== undefined) {
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
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
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
}

OHLCTooltip.contextTypes = {
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

OHLCTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	accessor: React.PropTypes.func.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	ohlcFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	volumeFormat: React.PropTypes.func,
};

OHLCTooltip.defaultProps = {
	accessor: (d) => { return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }; },
	xDisplayFormat: d3.time.format("%Y-%m-%d"),
	volumeFormat: d3.format(".4s"),
	ohlcFormat: d3.format(".2f"),
	origin: [0, 0],
};

export default OHLCTooltip;
