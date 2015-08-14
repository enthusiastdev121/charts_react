'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithZoomPan = require('lib/charts/CandleStickChartWithZoomPan');

var ZoomAndPanPage = React.createClass({
	statics: {
		title: 'Svg vs Canvas'
	},
	render() {
		return (
			<ContentSection title={ZoomAndPanPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/SVG-VS-CANVAS')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser type="svg">
							{(type) => <CandleStickChartWithZoomPan data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = ZoomAndPanPage;
