'use strict';

import React from "react";
import { helper } from "react-stockcharts";
var { TypeChooser } = helper;

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import BarChart from "lib/charts/BarChart";

var BarChartPage = React.createClass({
	statics: {
		title: "Bar Chart"
	},
	render() {
		return (
			<ContentSection title={BarChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<BarChart data={this.props.barData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BAR-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default BarChartPage;
