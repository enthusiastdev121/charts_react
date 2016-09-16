"use strict";

import React from "react";
import { ChartCanvas, Chart, series, axes, helper } from "react-stockcharts";

var { AreaSeries } = series;
var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class AreaChartWithYPercent extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{left: 50, right: 50, top:10, bottom: 30}}
					seriesName="MSFT"
					data={data} type={type}
					xAccessor={(d) => d.date} xScale={d3.time.scale()}
					xExtents={[new Date(2011, 0, 1), new Date(2013, 0, 2)]}>
				<Chart id={0} yExtents={d => d.close}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
					<AreaSeries yAccessor={(d) => d.close}/>
				</Chart>
			</ChartCanvas>
		);
	}
};
AreaChartWithYPercent.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithYPercent.defaultProps = {
	type: "svg",
};
AreaChartWithYPercent = fitWidth(AreaChartWithYPercent);


export default AreaChartWithYPercent;
