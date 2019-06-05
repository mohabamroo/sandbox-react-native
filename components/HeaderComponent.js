/**
 * The header component
 */
import React from 'react';
import { View, ImageBackground, Text, TouchableHighlight } from 'react-native';
import { Label } from './Label';
import * as GStyles from '../styles';
import { Header } from 'react-navigation';

import * as assets from '../constants/Assets';
import * as layout from '../constants/Layout';

export default class HeaderComponent extends Header {
	state = {
		marginTop: 0
	};
	componentDidMount() {}
	__onLayout(event) {
		this.setState({
			marginTop: (event.nativeEvent.layout.height / 2) * -1
		});
	}
	render() {
		const {
			title,
			mainHeader,
			subHeader,
			header,
			backBtn
		} = this.props.navigation.state.params;
		const BG =
			mainHeader && mainHeader.hasOwnProperty('bg')
				? assets.default[mainHeader.bg]
				: assets.default['bg1'];
		const sBG =
			subHeader && subHeader.hasOwnProperty('bg')
				? assets.default[subHeader.bg]
				: assets.default['circ2'];
		// TODO:
		const bbBG =
			backBtn && backBtn.hasOwnProperty('bgColor')
				? assets.default[backBtn.bgColor]
				: 'black';
		const bbFC =
			backBtn && backBtn.hasOwnProperty('fontColor')
				? assets.default[backBtn.fontColor]
				: 'white';
		const hasBackButton = !this.props.navigation.isFirstRouteInParent();
		return (
			<View style={{ alignItems: 'center' }}>
				{/** The Main bar View. */}
				{typeof mainHeader == 'object' && (
					<View
						style={[
							GStyles.default.headerAContainer,
							this.props.customMainStyle
						]}
					>
						<ImageBackground
							source={BG}
							resizeMode="repeat"
							style={GStyles.default.imageBGPatternCurved}
						/>
					</View>
				)}

				{/** The second header should be control form the parent View itself. */}
				{typeof subHeader == 'object' && (
					<View
						style={{
							width: '100%',
							transform: [{ skewY: '1deg' }],
							height: 55,
							backgroundColor: 'transparent',
						}}
					>
						<ImageBackground
							source={sBG}
							style={[
								GStyles.default.subHeaderContainer,
								this.props.customSubStyle
							]}
							resizeMode="repeat"
						>
							<View style={GStyles.default.subHeaderContent}>
								<View style={GStyles.default.subHeaderContentView}>
									{title.text && <Label title={title} text={header} />}
								</View>
							</View>
						</ImageBackground>
					</View>
				)}
				{hasBackButton && (
					<TouchableHighlight
						underlayColor={layout.default.underlayColor}
						onLayout={this.__onLayout.bind(this)}
						style={[GStyles.default.backButton, this.props.backButtonStyle, { backgroundColor: title.bgBack }]}
						onPress={() => {
							if(this.props.backRoute) {
								this.props.NACController.direct(this.props.backRoute);
							} else {
								this.props.navigation.goBack();
							}
						}}
					>
						<Text
							style={{
								color: title.colorBack,
								fontWeight: 'bold',
								fontSize: layout.default.backTextSize
							}}
						>
							BACK
						</Text>
					</TouchableHighlight>
				)}
			</View>
		);
	}
}
