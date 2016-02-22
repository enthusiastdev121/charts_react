"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { atr } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { ATR as defaultOptions } from "./defaultOptions";

const ALGORITHM_TYPE = "ATR";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.atr);

	var underlyingAlgorithm = atr()
		.windowSize(defaultOptions.period)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.atr = indicator });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`)
		return mergedAlgorithm(data);
	};

	base.tooltipLabel(_ => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "source", "windowSize");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
