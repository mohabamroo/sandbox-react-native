import React from 'react';
import {
	ScrollView,
	Image,
	TouchableOpacity,
	StyleSheet,
	View,
	Text,
	ListView,
	ImageBackground,
	Dimensions,
	Platform,
	Linking
} from 'react-native';
import { MapView } from 'expo';
import HeaderComponent from '../components/HeaderComponent';
import * as __GStyles from '../styles';
import Accordion from 'react-native-collapsible/Accordion';
import Assets from '../constants/Assets';

const { height, width } = Dimensions.get('window');

export default class BusRoutes extends React.Component {
	ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	constructor(props) {
		super(props);
		this.state = {
			content: this.props.navigation.state.params.in || [],
			colors: ['#008691', '#f8b7bb', '#60a484', '#e9665d'],
			activeSection: [0]
		};
	}
	async componentWillMount() {
		let content = this.state.content;
		this.setState({
			content: content.reduce((acc, val) => acc.concat(val['points']), [])
		});
	}
	renderRowNews(row, L, index) {}
	_renderSectionTitle(content, index) {
		return <View />;
	}
	_renderHeader(section, sectionNumber) {
		return (
			<View
				style={[
					styles.sectionTitle,
					{
						backgroundColor: section.color ? section.color.toLowerCase() : 'red'
					}
				]}
			>
				<Text style={styles.headerText}>{'Area ' + sectionNumber}</Text>
			</View>
		);
	}

	_handlePressDirections(lat, lng) {
		if (Platform.OS === 'ios') {
			Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lng}`);
		} else {
			Linking.openURL(`http://maps.google.com/?daddr=${lat},${lng}`);
		}
	}

	returnRules(content) {
		let returnable = [];
		content.points.forEach((point, idx) => {
			returnable.push(
				<View key={idx} style={styles.pointRow}>
					<View>
						<Text style={styles.pointTitle}>{point.point_name}</Text>
					</View>
					<View style={styles.pointInfoContent}>
						<View style={styles.pointInfo}>
							<Text style={styles.contentText}>Latitude: </Text>
							<Text style={styles.contentText}>{point.point_latitude}</Text>
						</View>
						<View style={styles.pointInfo}>
							<Text style={styles.contentText}>Longitude: </Text>
							<Text style={styles.contentText}>{point.point_latitude}</Text>
						</View>
					</View>
				</View>
			);
		});
		return returnable;
	}
	_renderContent(content, index) {
		return (
			<View
				style={[
					styles.contentContainer,
					{ backgroundColor: this.state.colors[index] }
				]}
			>
				{this.returnRules(content)}
			</View>
		);
	}
	_onChange(activeSection) {
		this.setState({ activeSection });
	}

	render() {
		let addedMarkers = [];
		return (
			<ImageBackground
				resizeMode="repeat"
				source={Assets.bg1}
				style={__GStyles.default.container}
			>
				<HeaderComponent navigation={this.props.navigation} />

				<MapView
					style={{ width: width, height: height }}
					initialRegion={{
						latitude: 27.39449,
						longitude: 33.66895,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}}
				>
					{this.state.content.map((marker, idx) => {
						// let isFree = this.isLocationFree(
						// 	[
						// 		parseFloat(marker.point_longitude),
						// 		parseFloat(marker.point_latitude)
						// 	],
						// 	addedMarkers
						// );
						// addedMarkers.push([
						// 	parseFloat(marker.point_longitude),
						// 	parseFloat(marker.point_latitude)
						// ]);
						return (
							<MapView.Marker
								key={idx}
								coordinate={{
									longitude: parseFloat(marker.point_longitude),
									latitude: parseFloat(marker.point_latitude),
									latitudeDelta: 0.0922,
									longitudeDelta: 0.0421
								}}
								title={marker.point_name}
								pinColor={
									marker.point_name !== 'Sandbox'
										? marker.point_color.toLowerCase()
										: 'green'
								}
								onCalloutPress={() => this._handlePressDirections(marker.point_latitude, marker.point_longitude)}
							/>
						);
					})}
				</MapView>


			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	sectionTitle: {
		padding: 20
	},
	contentContainer: {
		padding: 30,
		paddingTop: 0
	},
	contentText: {
		color: '#fff',
		marginBottom: 5
	},
	headerText: {
		color: '#fff',
		fontSize: 18
	},
	pointRow: {
		padding: 5
	},
	pointTitle: {
		fontWeight: 'bold'
	},
	pointInfoContent: {
		borderBottomWidth: 1,
		borderBottomColor: 'black'
	},
	pointInfo: {
		flexDirection: 'row',
		flex: 1
	}
});
