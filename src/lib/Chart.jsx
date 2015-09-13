"use strict";

import React from "react";
import objectAssign from "object-assign";

import PureComponent from "./utils/PureComponent";
import Utils from "./utils/utils";
import ChartDataUtil from "./utils/ChartDataUtil";

class Chart extends PureComponent {
	getChildContext() {
		var chartData = this.context.chartData.filter((each) => each.id === this.props.id)[0];
		var canvasContext = this.context.axesCanvasContext;

		if (canvasContext) {
			var originX = 0.5 + chartData.config.origin[0] + this.context.margin.left;
			var originY = 0.5 + chartData.config.origin[1] + this.context.margin.top;
		}

		return {
			chartId: this.props.id,
			xScale: chartData.plot.scales.xScale,
			yScale: chartData.plot.scales.yScale,
			xAccessor: chartData.config.xAccessor,
			// yAccessor: chartData.config.accessors.yAccessor,
			overlays: chartData.config.overlays,
			compareSeries: chartData.config.compareSeries,
			// indicatorOptions: chartData.config.indicatorOptions,
			// isCompareSeries: chartData.config.compareSeries.length > 0,
			chartData: chartData,
			width: chartData.config.width,
			height: chartData.config.height,
			canvasContext: canvasContext,
			canvasOrigin: [originX, originY],
		};
	}
	render() {
		var origin = ChartDataUtil.getChartOrigin(this.props.origin, this.context.width, this.context.height);
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
			return newChild;
		});
		var left = origin[0] + 0.5; // refer to http://www.rgraph.net/docs/howto-get-crisp-lines-with-no-antialias.html - similar fix for svg here
		return <g transform={`translate(${left}, ${origin[1]})`}>{children}</g>;
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
	id: 0,
};

Chart.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array,
	axesCanvasContext: React.PropTypes.object,
	margin: React.PropTypes.object.isRequired,
	type: React.PropTypes.string.isRequired,
};

Chart.childContextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	chartData: React.PropTypes.object.isRequired,
	// yAccessor: React.PropTypes.func.isRequired,
	overlays: React.PropTypes.array.isRequired,
	// indicatorOptions: React.PropTypes.object,
	// isCompareSeries: React.PropTypes.bool.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	canvasContext: React.PropTypes.object,
	canvasOrigin: React.PropTypes.array,
	chartId: React.PropTypes.number.isRequired,
};

module.exports = Chart;
