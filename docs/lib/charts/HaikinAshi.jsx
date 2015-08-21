"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;
var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { StockscaleTransformer, HeikinAshiTransformer } = ReStock.transforms;
var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;


var HaikinAshi = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;
		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 90, right: 70, top:10, bottom: 30}} initialDisplay={30}
				dataTransform={[ { transform: StockscaleTransformer }, { transform: HeikinAshiTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries />
						<OverlaySeries id={0} type="sma" options={{ period: 20, pluck: "close" }}>
							<LineSeries/>
						</OverlaySeries>
						<OverlaySeries id={1} type="sma" options={{ period: 30 }} >
							<LineSeries/>
						</OverlaySeries>
						<OverlaySeries id={2} type="sma" options={{ period: 50 }} >
							<LineSeries/>
						</OverlaySeries>
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forOverlay={0} />
				<CurrentCoordinate forChart={1} forOverlay={1} />
				<CurrentCoordinate forChart={1} forOverlay={2} />
				<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
						<OverlaySeries id={3} type="sma" options={{ period: 10, pluck:"volume" }} >
							<AreaSeries/>
						</OverlaySeries>
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={2} forOverlay={3} />
				<CurrentCoordinate forChart={2}/>
				<EdgeContainer>
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forOverlay={0} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forOverlay={1} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forOverlay={2} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forOverlay={0} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forOverlay={1} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forOverlay={2} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={2} displayFormat={d3.format(".4s")} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={2} displayFormat={d3.format(".4s")} />
				</EdgeContainer>
				<MouseCoordinates xDisplayFormat={dateFormat} type="crosshair" />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-50, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-48, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
});

export default HaikinAshi;
