"use strict";

import {
	first,
	last,
	getClosestItemIndexes,
	isDefined,
	isNotDefined,
	isArray,
	identity,
} from "../utils";

import eodIntervalCalculator from "./eodIntervalCalculator";


/*
function getFilteredResponseWhole(dataForInterval, left, right, xAccessor) {
	return dataForInterval;
}
*/

function getDomain(inputDomain, width, filteredData, predicate, currentDomain, canShowTheseMany, realXAccessor) {
	if (canShowTheseMany(width, filteredData.length)) {
		var domain = predicate
			? inputDomain
			: [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))]; // TODO fix me later
		return domain;
	}
	if (process.env.NODE_ENV !== "production") {
		console.error(`Trying to show ${filteredData.length} items in a width of ${width}px. This is either too much or too few points`);
	}
	return currentDomain;
}



/*function filterHelper(data, xAccessor, realXAccessor) {
	var width, currentDomain, currentPlotData;
	function foo(left, right) {
		var filteredData = getFilteredResponse(data, left, right, xAccessor);
		if (!canShowTheseManyPeriods(width, filteredData.length)) {
			return {
				domain:
			}
		}
	}
			domain = getDomain(inputDomain, width, filteredData,
				realXAccessor === xAccessor, currentDomain,
				canShowTheseMany, realXAccessor);

			// console.log(filteredData, inputDomain);
			// console.log("HERE", left, right, last(data), last(filteredData));
			if (domain !== currentDomain) {
				plotData = filteredData;
				intervalToShow = null;
			}
			if (isNotDefined(plotData) && showMax(width) < data.length) {
				plotData = data.slice(data.length - showMax(width));
				domain = [realXAccessor(first(plotData)), realXAccessor(last(plotData))];
			}
}*/

function extentsWrapper(data, inputXAccessor, realXAccessor, width, useWholeData) {
	function domain(inputDomain, xAccessor, currentPlotData, currentDomain, subsequent = false) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		var left = first(inputDomain);
		var right = last(inputDomain);

		var filteredData = getFilteredResponse(data, left, right, xAccessor);

		var plotData, domain
		if (canShowTheseManyPeriods(width, filteredData.length)) {
			plotData = filteredData;
			domain = subsequent ? inputDomain : [realXAccessor(first(plotData)), realXAccessor(last(plotData))]
		} else {
			plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width));
			domain = currentDomain || [realXAccessor(first(plotData)), realXAccessor(last(plotData))];
		}

		return { plotData, domain };
	}

	domain.isItemVisibleInDomain = function(d, domain) {
	};

	return domain;
}

function canShowTheseManyPeriods(width, arrayLength) {
	var threshold = 0.75; // number of datapoints per 1 px
	return arrayLength < width * threshold && arrayLength > 1;
}

function showMax(width) {
	var threshold = 0.75; // number of datapoints per 1 px
	return Math.floor(width * threshold);
}

function getFilteredResponse(data, left, right, xAccessor) {
	var newLeftIndex = getClosestItemIndexes(data, left, xAccessor).right;
	var newRightIndex = getClosestItemIndexes(data, right, xAccessor).left;

	var filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	// console.log(right, newRightIndex, dataForInterval.length);

	return filteredData;
}

function compose(funcs) {
	if (funcs.length === 0) {
		return identity
	}

	if (funcs.length === 1) {
		return funcs[0]
	}

	var [head, ...tail] = funcs;

	return args => tail.reduce((composed, f) => f(composed), head(args));
}

export default function() {

	var xAccessor, useWholeData, width,
		map, calculator = [], scaleProvider,
		canShowTheseMany = canShowTheseManyPeriods, indexAccessor, indexMutator;

	function evaluate(data) {

		var mappedData = data.map(map);

		var composedCalculator = compose(calculator);
		var calculatedData = composedCalculator(mappedData);

		var {
			data: finalData,
			xScale,
			xAccessor: realXAccessor
		} = scaleProvider(calculatedData, xAccessor, indexAccessor, indexMutator);

		return {
			filterData: extentsWrapper(finalData, xAccessor, realXAccessor, width, useWholeData),
			xScale,
			xAccessor: realXAccessor,
			lastItem: last(finalData),
		}
		/*return {
			fullData: mappedData,
			// xAccessor: realXAccessor,
			// inputXAccesor: xAccessor,
			domainCalculator: extentsWrapper(xAccessor, realXAccessor, allowedIntervals, canShowTheseMany, useWholeData),
		};*/
	}
	evaluate.xAccessor = function(x) {
		if (!arguments.length) return xAccessor;
		xAccessor = x;
		return evaluate;
	};
	evaluate.map = function(x) {
		if (!arguments.length) return map;
		map = x;
		return evaluate;
	};
	evaluate.indexAccessor = function(x) {
		if (!arguments.length) return indexAccessor;
		indexAccessor = x;
		return evaluate;
	};
	evaluate.indexMutator = function(x) {
		if (!arguments.length) return indexMutator;
		indexMutator = x;
		return evaluate;
	};
	evaluate.scaleProvider = function(x) {
		if (!arguments.length) return scaleProvider;
		scaleProvider = x;
		return evaluate;
	};
	evaluate.useWholeData = function(x) {
		if (!arguments.length) return useWholeData;
		useWholeData = x;
		return evaluate;
	};
	evaluate.width = function(x) {
		if (!arguments.length) return width;
		width = x;
		return evaluate;
	};
	evaluate.calculator = function(x) {
		if (!arguments.length) return calculator;
		calculator = x;
		return evaluate;
	};

	return evaluate;
}