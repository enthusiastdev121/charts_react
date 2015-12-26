## v0.3.1

#### Changes

1. Fix [#39](https://github.com/rrag/react-stockcharts/issues/39)
1. Add eslint rules to prevent these from happening again
1. Change `utils.js` and `ChartDataUtil.js` to use es6 exports
1. fix `svg` for `Brush`

## v0.3.0

#### Breaking Changes

1. Changes to `Histogram` to accept `stroke` as a boolean param instead of a function. the `stroke` color cannot be different from `fill`
1. `OHLCTooltip` uses `d3.format(".4s")` as the format to show volume. This shows a suffix of M (Mega) for Million and G (Giga) for Billion. These are per the [SI-prefix](https://en.wikipedia.org/wiki/Metric_prefix). You can change it to a different format by passing a prop `volumeFormat` that accepts a function taking the volume and returning a formatted string

#### Changes

1. Add new methods to `ChartCanvas`
1. Add `Brush` and `ClickCallback` interactive components
1. Fix bug on zoom, for charts not using stockscale
1. Change to use ES6 module exports instead of commonjs `module.exports = ...`

## v0.2.12

#### Changes

1. Fixed a bug where `React` was not imported in `fitWidth`

## v0.2.11

#### Breaking Changes

1. Opacity works only when using Hex colors, using color names like `steelblue` `red` `black` is not recommended. This is to address #1 in [issue #22](https://github.com/rrag/react-stockcharts/issues/22)

#### Changes

1. Support for Dark theme

## v0.2.10

#### Changes

1. Create interactive indicators
    1. `FibonacciRetracement`
    1. `TrendLine`
1. Add a new prop `widthRatio` which takes values from 0 to 1 (defaults to 0.5) for `HistogramSeries` & `CandlestickSeries` to control the width
1. Add new tooltip `SingleValueTooltip`

## v0.2.9

#### Changes

1. Fix the moving average stroke color bug that was introduced from `v0.2.8`
1. Initial version of Interactive indicator `TrendLine`

## v0.2.8

#### Changes

1. Create a pure function instead of React Components extending PureComponent, this way the `componentWillReceiveProps` will not be called when no props are changed
1. Stop mutating the state of `EventHandler`, instead use a separate mutable state variable to hold a list of callbacks for drawing on canvas

## v0.2.6

#### Changes

1. Use `save-svg-as-png` `v1.0.1` instead of referring from source
1. Add onClick handler for all tooltips
1. Change onClick handler of `MovingAverageTooltip` to provide `chartId, dataSeriesId, options`

## v0.2.5

#### Changes

1. Use React 0.14.0 instead of 0.14.0-rc1
1. Add default yAccessor to Area & Line Series
1. Add checks for defensive iteration of children
1. Fix Kagi defect where volume is not reset
1. Add utility method to convert hex to rgba
1. Fix axes so svg and canvas result in near pixel perfect output
1. Round off x of Histogram so svg and canvas look similar
1. Change import in examples from ReStock to react-stockcharts
1. Add zIndex as property to ChartCanvas


## v0.2.4

#### Changes

1. Fix updating data for Kagi, Renko, P&F. Add examples [#17](https://github.com/rrag/react-stockcharts/issues/17)

## v0.2.3

#### Changes

1. Make it work with both react 0.13.3 & 0.14.0-rc1 [#12](https://github.com/rrag/react-stockcharts/issues/12)

## v0.2.2

#### Breaking Changes

1. Use react & react-dom 0.14.0-rc1 as dependency, added `peerDependency` to resolve [#12](https://github.com/rrag/react-stockcharts/issues/12)

#### Internal changes

1. Change the way chart series are developed so `context` is not used.

## v0.2.1

#### Breaking Changes

1. Use react 0.14.0-beta3 as dependency

#### Other changes

1. Improve the handling of the chart on [updating data](#/updating_data)
    1. provide a new `pushData` method to push new data points, and another `alterData` method to modify existing data. By creating these methods, it is easy to identify if a change to the Chart is due to data changes or change of height/width of the chart
1. Add example for serverside rendering
1. Add example for downloading chart as png - works for both canvas & svg

#### Internal changes

1. In an attempt to improve performance of pan actions on firefox, the pan actions when done for canvas now do not update the state during pan. To achieve this the following changes were done
    1. Create Canvas based X & YAxis
    1. Canvas based `EdgeCoordinates` and `MouseCoordinates` and `CurrentCoordinate`
    1. Create 2 canvas as against one for each chart.
        - One canvas that is redrawn on mouse move, this canvas contains the `MouseCoordinates`, `CurrentCoordinate`, and 
        - One canvas that is drawn on zoom or pan action, this contains everything else, including the `XAxis`, `YAxis`, the actual Chart series, `EdgeCoordinate`



## v0.2

#### Breaking Changes

1. `<DataTransform>` is now removed, Check out examples on how to use the new `dataTransform` property of `ChartCanvas`
1. `<OverlaySeries>` is now removed, and `<DataSeries>` is used in its place and also it no longer accepts `type` instead accepts an `indicator` prop. This will keep the `OverlaySeries` extensible for custom overlays too. This is a significant change as it combines indicators and overlays to be interchangable. Multiple `DataSeries` in the same `Chart` contribute to the same `scales`
1. `DataSeries` no longer accepts `xAccessor` instead, it is moved to `Chart`. Use of `xAccessor` on the `Chart` is for very simple usecases, since it does not benefit from the stock scale
1. Simple moving average and Exponential moving average are converted as indicators
1. Axes are now accesible via `ReStock.axes.XAxis`, `ReStock.axes.YAxis` against `ReStock.XAxis`, `ReStock.YAxis` in 0.1.x
1. No more `react-stockchart.css`. The stylesheet is no longer used. All the styling has been moved to the individual components. If you prefer to have different style attributes you can use the style related  properties of the individual components or create a custom stylesheet with the class defined in each component

#### Other changes

1. Pure React based `svg` axes. Both `XAxis` and `YAxis` do not use `d3` to render inside `componentDidMount` / `componentDidUpdate`
1. Added new indicators/overlays Bollinger band, RSI, MACD
1. A new property `type` is added to `ChartCanvas` and it takes one of 2 values
    - `svg` which creates the chart using pure svg
    - `hybrid` which creates the chart using a combination of `svg` and `canvas`. `canvas` is used to draw the different series, like Line, Area, Candlestick, Histogram etc. and `svg` is used for the `XXXTooltip`, `MousePointer`, `XAxis` `YAxis` and the `EdgeIndicator`
1. add `jsnext:main` to `package.json` for use with [rollup](https://github.com/rollup/rollup)

---
