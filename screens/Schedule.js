import React from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
  TouchableHighlight,
	ImageBackground,
	ScrollView
} from 'react-native';
import moment from 'moment';
import Layout from '../constants/Layout';

import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import { AntDesign } from '@expo/vector-icons';
// import the page components
import Assets from '../constants/Assets';
import ArtistPopup from './ArtistPopup';

import * as __GStyles from '../styles';
import Footer from '../components/Footer';
import { SchedualDB, ArtistsDB } from '../Config/DB';
const URLs = require('../Config/ExternalURL');

const interval = 110;

export default class Schedule extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show_popup: false,
			current_artist: null
		};
	}

	componentDidMount() {
		this.fetchCategories();
		this.fetchArtists();
	}

	async fetchArtists() {
		let artists = await ArtistsDB.Get();
		this.setState({ artists });
	}

	async fetchCategories() {
		let scheduleRes = await SchedualDB.Get();
		this.setSchedule(scheduleRes);
		this.refreshSchedule();
	}

	emptySpace(width, array) {
		array.push(<View style={{ width, height: 150 }} />);
		return array;
	}

	sessionSpace(width, array, item, color) {
		array.push(
			<TouchableHighlight
				onPress={() => {
					current_artist = this.state.artists.filter(
						x => x.artist_id == item.artistId
					)[0];
					this.setState({
						show_popup: true,
						current_artist,
						color1: '#7bc19e',
						color2: '#f8b7bb'
					});
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						width: width,
						height: 150,
						overflow: 'hidden',
						position: 'relative',
						backgroundColor: color
					}}
				>
					<View style={{ width: width - 150 }} />

					<Image
						source={{ uri: item.artistImage }}
						style={{
							width: 150,
							height: 150,
							backgroundColor: '#fff'
						}}
					/>

					<View
						style={[
							styles.triangle,
							styles.triangleDown,
							styles.nameArea,
							{ borderBottomColor: color, position: 'absolute', right: 75 }
						]}
					/>
					<View style={styles.textArea}>
						<Text style={styles.name}>{item.artistName}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
		return array;
	}

	setSchedule(schedObj) {
		Object.keys(schedObj).forEach(day => {
			let mainStage = schedObj[day]['Main Stage'];
			let sandBox = schedObj[day]['SANDBOX Stage'];
			let i = 0,
				j = 0,
				maxI = mainStage.length,
				maxJ = sandBox.length;
			let begin, end;

			// Set Begin and End Times of the day
			beginMain = moment(mainStage[0]['session_start_time'], 'HH:mm');
			beginSand = moment(sandBox[0]['session_start_time'], 'HH:mm');
			begin = beginMain.isBefore(beginSand) ? beginMain : beginSand;

			endMain = moment(
				mainStage[mainStage.length - 1]['session_end_time'],
				'HH:mm'
			).add(24, 'hours');
			endSand = moment(
				sandBox[sandBox.length - 1]['session_end_time'],
				'HH:mm'
			).add(24, 'hours');
			end = endMain.isBefore(endSand) ? endSand : endMain;

			let mainSlots = [],
				sandSlots = [];
			let timeslots = [];
			current = moment(begin);
			while (current.isBefore(end)) {
				let last =
					moment(current)
						.add(30, 'minutes')
						.diff(end, 'minutes') == 0;
				timeslots.push(
					<View
						style={{
							height: 40,
							width: last ? interval + 60 : interval,
							backgroundColor: '#e9665d',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<Text style={{ color: '#ffec59', marginLeft: 4 }}>
							{current.format('h:mmA')}
						</Text>
						{last && (
							<Text style={{ color: '#ffec59', marginLeft: 'auto' }}>
								{current.add(30, 'minutes').format('h:mmA')}
							</Text>
						)}
					</View>
				);
				current.add(30, 'minutes');
			}
			// mainStage slots
			if (beginMain.isAfter(begin)) {
				let difference = beginMain.diff(begin, 'minutes') / 15;
				mainSlots = this.emptySpace((difference * interval) / 2, mainSlots);
			}
			for (; i < mainStage.length; i++) {
				let currentBegin, prevEnd, currentEnd;
				currentBegin = moment(mainStage[i]['session_start_time'], 'HH:mm');
				currentEnd = moment(mainStage[i]['session_end_time'], 'HH:mm');
				if (currentBegin.hours() < 12) currentBegin.add(1, 'days');
				if (currentEnd.hours() < 12) currentEnd.add(1, 'days');
				if (i > 0) {
					prevEnd = moment(mainStage[i - 1]['session_end_time'], 'HH:mm');
					if (prevEnd.hours() < 12) prevEnd.add(1, 'days');
				}
				if (i == 0 || currentBegin.isSame(prevEnd)) {
					let difference = currentEnd.diff(currentBegin, 'minutes') / 15;
					mainSlots = this.sessionSpace(
						(difference * interval) / 2,
						mainSlots,
						mainStage[i],
						'#f8b7bb'
					);
				} else {
					let difference = currentBegin.diff(prevEnd, 'minutes') / 15;
					mainSlots = this.emptySpace((difference * interval) / 2, mainSlots);
					difference = currentBegin.diff(currentEnd, 'minutes') / 15;
					mainSlots = this.sessionSpace(
						(difference * interval) / 2,
						mainSlots,
						mainStage[i],
						'#f8b7bb'
					);
				}
			}
			// sandBox slots
			if (beginSand.isAfter(begin)) {
				let difference = beginSand.diff(begin, 'minutes') / 15;
				sandSlots = this.emptySpace((difference * interval) / 2, sandSlots);
			}
			for (; j < sandBox.length; j++) {
				let currentBegin, prevEnd, currentEnd;
				currentBegin = moment(sandBox[j]['session_start_time'], 'HH:mm');
				currentEnd = moment(sandBox[j]['session_end_time'], 'HH:mm');
				if (currentBegin.hours() < 12) currentBegin.add(1, 'days');
				if (currentEnd.hours() < 12) currentEnd.add(1, 'days');
				if (j > 0) {
					prevEnd = moment(sandBox[j - 1]['session_end_time'], 'HH:mm');
					if (prevEnd.hours() < 12) prevEnd.add(1, 'days');
				}
				if (j == 0 || currentBegin.isSame(prevEnd)) {
					let difference = currentEnd.diff(currentBegin, 'minutes') / 15;
					sandSlots = this.sessionSpace(
						(difference * interval) / 2,
						sandSlots,
						sandBox[j],
						'rgb(123,	192	,158)'
					);
				} else {
					let difference = currentBegin.diff(prevEnd, 'minutes') / 15;
					sandSlots = this.emptySpace((difference * interval) / 2, sandSlots);
					difference = currentBegin.diff(currentEnd, 'minutes') / 15;
					sandSlots = this.sessionSpace(
						(difference * interval) / 2,
						sandSlots,
						sandBox[j],
						'rgb(123,	192	,158)'
					);
				}
			}
			this.setState({
				[day]: {
					timeslots,
					mainSlots,
					sandSlots
				}
			});
		});
	}

	refreshSchedule() {
		fetch(URLs.scheduleURL)
			.then(response => response.json())
			.then(apiResponse => {
				if (apiResponse.status == 200) {
					this.setSchedule(apiResponse.data);
					SchedualDB.Set(apiResponse.data);
				} else {
					console.log('Could not refresh schedule');
				}
			})
			.catch(err => {
				// FIXME: what to do on internet corruption
				console.log('TCL: News Screen -> componentDidMount -> err', err);
			});
	}

	renderMainStageArtiest = item => {
		return (
			<TouchableOpacity
				onPress={() => {
					current_artist = this.state.artists.filter(
						x => x.artist_id == item.artistId
					)[0];
					this.setState({
						show_popup: true,
						current_artist,
						color1: '#7bc19e',
						color2: '#f8b7bb'
					});
				}}
			>
				<Image
					source={{ uri: item.artistImage }}
					style={{ height: 150, width: width * 0.3, marginLeft: width * 0.21 }}
				/>
				<View
					style={{
						position: 'absolute',
						height: 150,
						width: width * 0.3,
						marginLeft: width * 0.21,
						backgroundColor: 'rgba(0,0,0,.1)'
					}}
				/>
				<View style={styles.triangle} />
				<View
					style={{
						position: 'absolute',
						top: 10,
						left: 15,
						paddingRight: width * 0.3
					}}
				>
					<Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
						{item.artistName}
					</Text>
				</View>
				<AntDesign
					name="hearto"
					size={15}
					color="white"
					style={{ position: 'absolute', right: 10, top: 10 }}
				/>
			</TouchableOpacity>
		);
	};
	renderSandBoxStageArtiest = item => {
		return (
			<TouchableOpacity
				onPress={() => {
					current_artist = this.state.artists.filter(
						x => x.artist_id == item.artistId
					)[0];
					this.setState({
						show_popup: true,
						current_artist,
						color1: '#7bc19e',
						color2: '#f8b7bb'
					});
				}}
			>
				<Image
					source={{ uri: item.artistImage }}
					style={{ height: 150, width: width * 0.3, marginLeft: width * 0.21 }}
				/>
				<View
					style={{
						position: 'absolute',
						height: 150,
						width: width * 0.3,
						marginLeft: width * 0.21,
						backgroundColor: 'rgba(0,0,0,.1)'
					}}
				/>
				<View style={styles.triangle2} />
				<View
					style={{
						position: 'absolute',
						top: 10,
						left: 15,
						paddingRight: width * 0.3
					}}
				>
					<Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
						{item.artistName}
					</Text>
				</View>
				<AntDesign
					name="hearto"
					size={17}
					color="white"
					style={{ position: 'absolute', right: 10, top: 10 }}
				/>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<ImageBackground
				style={__GStyles.default.container}
				source={require('../assets/images/bgschedul.png')}
				resizeMode={'cover'}
			>
				<HeaderComponent navigation={this.props.navigation} />

				<ScrollView
					horizontal
					contentContainerStyle={{ flexDirection: 'column' }}
				>
					<View style={{ flexDirection: 'row' }}>
						{this.state.day1 &&
							this.state.day1.timeslots &&
							this.state.day1.timeslots.map((item, index) => {
								return item;
							})}
					</View>
					<View style={{ flexDirection: 'row', marginLeft: 60 }}>
						{this.state.day1 &&
							this.state.day1.mainSlots &&
							this.state.day1.mainSlots.map((item, index) => {
								return item;
							})}
					</View>
					<View style={{ flexDirection: 'row', marginLeft: 60 }}>
						{this.state.day1 &&
							this.state.day1.sandSlots &&
							this.state.day1.sandSlots.map((item, index) => {
								return item;
							})}
					</View>
				</ScrollView>
				<Image
					source={require('../assets/images/main.png')}
					style={{
						height: 160,
						width: 70,
						resizeMode: 'cover',
						position: 'absolute',
						top: 140,
						left: -3,
						transform: [{ skewX: '3deg' }]
					}}
				/>
				<Image
					source={require('../assets/images/sandBox.png')}
					style={{
						height: 160,
						width: 70,
						resizeMode: 'cover',
						position: 'absolute',
						top: 290,
						left: -3,
						transform: [{ skewX: '3deg' }]
					}}
				/>
				{this.state.current_artist &&
					this.state.show_popup && (
						<ArtistPopup
							artist={this.state.current_artist}
							color1={this.state.color1}
							color2={this.state.color2}
							notifyParent={() => this.fetchFavorites()}
							onClose={() => this.setState({ show_popup: false })}
						/>
					)}
				<Footer />
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#e9665d'
	},
	triangle: {
		width: 0,
		height: 0,
		borderBottomWidth: Layout.window.width,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: Layout.window.width / 2,
		borderRightWidth: Layout.window.width / 4,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent'
	},
	triangleDown: {
		transform: [{ rotate: '180deg' }]
	},
	nameArea: {
		marginLeft: (Layout.window.width / 6) * -1
	},
	textArea: {
		position: 'absolute',
		top: Layout.window.height * 0.025,
		right: 120
	},
	name: {
		fontSize: 18,
		fontWeight: 'bold',
		width: Layout.window.width / 3,
		color: 'white',
		width: 110,
		textAlign: 'right'
	}
});
