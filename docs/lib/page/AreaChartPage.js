

import React from "react";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import AreaChart from "lib/charts/AreaChart";
import AreaChartWithYPercent from "lib/charts/AreaChartWithYPercent";
import { TypeChooser } from "react-stockcharts/lib/helper";

class OverviewPage extends React.Component {
	render() {
		return (
			<ContentSection title={OverviewPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<AreaChart  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/AREACHART") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<AreaChartWithYPercent data={this.props.someData} type="svg" />
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

OverviewPage.title = "Area Chart";

export default OverviewPage;
