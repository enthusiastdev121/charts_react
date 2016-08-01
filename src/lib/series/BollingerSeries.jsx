"use strict";

import React, { PropTypes, Component } from "react";

import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

import wrap from "./wrap";

class BollingerSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForTop = this.yAccessorForTop.bind(this);
		this.yAccessorForMiddle = this.yAccessorForMiddle.bind(this);
		this.yAccessorForBottom = this.yAccessorForBottom.bind(this);
		this.yAccessorForScalledBottom = this.yAccessorForScalledBottom.bind(this);
	}
	yAccessorForTop(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).top;
	}
	yAccessorForMiddle(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).middle;
	}
	yAccessorForBottom(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).bottom;
	}
	yAccessorForScalledBottom(scale, d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return scale(yAccessor(d) && yAccessor(d).bottom);
	}
	render() {
		var { calculator, areaClassName, className, opacity } = this.props;

		var stroke = calculator.stroke();
		var fill = calculator.fill();

		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForTop}
					stroke={stroke.top} fill="none" />
				<LineSeries yAccessor={this.yAccessorForMiddle}
					stroke={stroke.middle} fill="none" />
				<LineSeries yAccessor={this.yAccessorForBottom}
					stroke={stroke.bottom} fill="none" />
				<AreaOnlySeries className={areaClassName}
					yAccessor={this.yAccessorForTop}
					base={this.yAccessorForScalledBottom}
					stroke="none" fill={fill}
					opacity={opacity} />
			</g>
		);
	}
}

BollingerSeries.propTypes = {
	xAccessor: PropTypes.func,
	calculator: PropTypes.func.isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
	className: PropTypes.string,
	areaClassName: PropTypes.string,
	opacity: PropTypes.number,
	type: PropTypes.string,
};

BollingerSeries.defaultProps = {
	className: "react-stockcharts-bollinger-band-series",
	areaClassName: "react-stockcharts-bollinger-band-series-area",
	opacity: 0.2
};

export default wrap(BollingerSeries);
