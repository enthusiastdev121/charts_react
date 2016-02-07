"use strict";

import React from "react";
import Line from "./Line";
import StraightLine from "./StraightLine";
import wrap from "./wrap";

class RSISeries extends React.Component {
	render() {
		var { className, xScale, yScale, xAccessor, calculator, plotData, stroke, type } = this.props;
		var yAccessor = calculator.accessor();
		var overSold = calculator.overSold();
		var middle = calculator.middle();
		var overBought = calculator.overBought();

		return (
			<g className={className}>
				<Line
					className={className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					plotData={plotData}
					stroke={stroke.line} fill="none"
					type={type} />
				{RSISeries.getHorizontalLine(this.props, overSold, stroke.top)}
				{RSISeries.getHorizontalLine(this.props, middle, stroke.middle)}
				{RSISeries.getHorizontalLine(this.props, overBought, stroke.bottom)}
			</g>
		);
	}
}

RSISeries.getHorizontalLine = (props, yValue, stroke) => {
	/* eslint-disable react/prop-types */
	let { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={stroke} opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={yValue} />;
};

RSISeries.propTypes = {
	className: React.PropTypes.string,

	calculator: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	stroke: React.PropTypes.object,
	type: React.PropTypes.string,
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	}
};

export default wrap(RSISeries);
