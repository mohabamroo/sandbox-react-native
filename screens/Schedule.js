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
	ScrollView,
	Alert
} from 'react-native';
import moment from 'moment';
import Layout from '../constants/Layout';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';
import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import { AntDesign } from '@expo/vector-icons';
// import the page components
import Assets from '../constants/Assets';
import ArtistPopup from './ArtistPopup';
import Footer from '../components/Footer';
import LikeButton from '../components/LikeButton';
import Slot from '../components/Slot';

import * as __GStyles from '../styles';
import { SchedualDB, ArtistsDB, UserDB, FavoritesDB } from '../Config/DB';
const URLs = require('../Config/ExternalURL');

const interval = 110;
export default class Schedule extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show_popup: false,
			current_artist: null,
			active: 'day1',
			timer: 0,
			colors1: ['#fabb79', '#008691', '#e9665d', '#60a484'],
			colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
			colorIdx: 0,
			artists: [],
			loggedIn: this.props.navigation.state.params.loggedIn,
			user: this.props.navigation.state.params.user
		};
	}

	componentDidMount() {
		this.fetchCategories();
		this.fetchArtists();
	}

	setDay() {
		let now = moment();
		let event_day = '';
		if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 13, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 14, hour: 5, minute: 0 })
			)
		) {
			event_day = 'day1';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 14, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 15, hour: 4, minute: 0 })
			)
		) {
			event_day = 'day2';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 15, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 16, hour: 4, minute: 0 })
			)
		) {
			event_day = 'day3';
		} else {
			return;
		}
		this.setState({ today: event_day });
		this._handleAppStateChange({ active: event_day });
	}

	async fetchArtists() {
		let artists = await ArtistsDB.Get();
		this.setState({ artists });
		this.fetchFavorites();
	}

	async fetchCategories() {
		let scheduleRes = await SchedualDB.Get();
		this.setSchedule(scheduleRes);
		this.refreshSchedule();
	}

	renderTimeslot(current, array) {
		array.push(
			<View
				style={{
					height: 40,
					width: interval,
					backgroundColor: '#e9665d',
					alignItems: 'center'
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						marginTop: 5
					}}
				>
					<View style={{ flexDirection: 'column' }}>
						<Text style={{ color: '#ffec59', marginLeft: 4 }}>
							{current.format('h:mmA')}
						</Text>
					</View>
				</View>
			</View>
		);
		return array;
	}

	fetchFavorites() {
		if (this.state.loggedIn) {
			let initialArtists = this.state.artists;
			FavoritesDB.Get().then(artists => {
				initialArtists.forEach((artist, index) => {
					initialArtists[index]['liked'] = false;
				});
				if (artists) {
					artists.forEach(likedArtist => {
						if (likedArtist && likedArtist.artist_id) {
							initialArtists.forEach((artist, index) => {
								if (artist.artist_id == likedArtist.artist_id) {
									initialArtists[index]['liked'] = true;
								}
							});
						}
					});
				}
				this.setState({ artists: initialArtists });
			});
		}
	}

	autoScroll(day) {
		if (this.state.today !== day) {
			this.setState({ timer: 0 });
			setTimeout(() => this.scrollView.scrollTo({ x: 0, animated: true }), 100);
			return;
		}
		let now = moment();
		let begin = this.state[day].begin;
		if (
			Math.abs(begin.date() - now.date()) < 1 &&
			begin.hours() >= 12 &&
			now.hours() < 12
		) {
			isInitial = false;
			begin.subtract(24, 'hours');
			let dayObj = this.state[day];
			dayObj.begin = begin;
			this.setState({
				[day]: { ...dayObj }
			});
		}

		let slots = Math.abs(now.diff(begin, 'minutes')) / 30;
		let scrollValue = (slots - 2) * interval;
		let timer = (slots + 0.45) * interval;
		let max = this.state[day].timeslots.length * interval - Layout.window.width;
		this.setState({ timer: Math.max(0, timer) });

		this.scrollView.scrollTo({
			x: Math.max(0, Math.min(scrollValue, max)),
			animated: true
		});
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
			while (!current.isAfter(end)) {
				let last =
					moment(current)
						.add(30, 'minutes')
						.diff(end, 'minutes') == 0;
				let currentSlot =
					this.state.today === day &&
					moment().hours() == current.hours() &&
					moment().minutes() > current.minutes() &&
					moment().minutes() < current.minutes() + 30;
				timeslots = this.renderTimeslot(current, timeslots);
				current.add(30, 'minutes');
			}
			// mainStage slots
			if (beginMain.isAfter(begin)) {
				let difference = Math.abs(beginMain.diff(begin, 'minutes')) / 15;
				mainSlots.push({ width: (difference * interval) / 2, empty: true });
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
					let difference =
						Math.abs(currentEnd.diff(currentBegin, 'minutes')) / 15;
					mainSlots.push({
						width: (difference * interval) / 2,
						item: mainStage[i],
						color: '#f8b7bb'
					});
				} else {
					let difference = Math.abs(currentBegin.diff(prevEnd, 'minutes')) / 15;
					mainSlots.push({ width: (difference * interval) / 2, empty: true });
					difference = Math.abs(currentBegin.diff(currentEnd, 'minutes')) / 15;
					mainSlots.push({
						width: (difference * interval) / 2,
						item: mainStage[i],
						color: '#f8b7bb'
					});
				}
			}
			// sandBox slots
			if (beginSand.isAfter(begin)) {
				let difference = beginSand.diff(begin, 'minutes') / 15;
				sandSlots.push({ width: (difference * interval) / 2, empty: true });
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
					sandSlots.push({
						width: (difference * interval) / 2,
						item: sandBox[j],
						color: 'rgb(123,	192	,158)'
					});
				} else {
					let difference = currentBegin.diff(prevEnd, 'minutes') / 15;
					sandSlots.push({ width: (difference * interval) / 2, empty: true });
					difference = currentBegin.diff(currentEnd, 'minutes') / 15;
					sandSlots.push({
						width: (difference * interval) / 2,
						item: sandBox[j],
						color: 'rgb(123,	192	,158)'
					});
				}
			}

			if (day == 'day1') {
				this.setState({
					timeslots,
					mainSlots,
					sandSlots
				});
			}

			this.setState({
				[day]: {
					timeslots,
					mainSlots,
					sandSlots,
					begin
				}
			});
		});
		this.setDay();
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

	_handleAppStateChange(newState) {
		day = newState.active;

		this.setState(
			{
				active: day,
				timeslots: this.state[day].timeslots,
				mainSlots: this.state[day].mainSlots,
				sandSlots: this.state[day].sandSlots
			},
			this.autoScroll(day)
		);
	}

	renderTabs() {
		return (
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					onPress={() => {
						this._handleAppStateChange({ active: 'day1' });
					}}
					style={{ flex: 1 }}
				>
					<View
						style={[
							styles.tab,
							{
								backgroundColor:
									this.state.active == 'day1' ? '#e9665d' : 'transparent'
							}
						]}
					>
						<Text
							style={[
								{
									fontWeight: 'bold',
									fontSize: 12,
									color: this.state.active == 'day1' ? '#ffec59' : '#e9665d'
								}
							]}
						>
							{' '}
							{this.state.active == 'day1' ? '>' : ''} Thursday
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this._handleAppStateChange({ active: 'day2' });
					}}
					style={{ flex: 1 }}
				>
					<View
						style={[
							styles.tab,
							{
								backgroundColor:
									this.state.active == 'day2' ? '#e9665d' : 'transparent'
							}
						]}
					>
						<Text
							style={[
								{
									fontWeight: 'bold',
									fontSize: 12,
									color: this.state.active == 'day2' ? '#ffec59' : '#e9665d'
								}
							]}
						>
							{' '}
							{this.state.active == 'day2' ? '>' : ''} Friday
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this._handleAppStateChange({
							active: 'day3'
						});
					}}
					style={{ flex: 1 }}
				>
					<View
						style={[
							styles.tab,
							{
								backgroundColor:
									this.state.active == 'day3' ? '#e9665d' : 'transparent'
							}
						]}
					>
						<Text
							style={[
								{
									fontWeight: 'bold',
									fontSize: 12,
									color: this.state.active == 'day3' ? '#ffec59' : '#e9665d'
								}
							]}
						>
							{' '}
							{this.state.active == 'day3' ? '>' : ''} Saturday
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	render() {
		return (
			<ImageBackground
				style={__GStyles.default.container}
				source={require('../assets/images/patterns/bg2b.png')}
				resizeMode={'repeat'}
			>
				<HeaderComponent navigation={this.props.navigation} />
				<ImageBackground
					style={__GStyles.default.container}
					source={require('../assets/images/bgschedul.png')}
					resizeMode={'cover'}
				>
					{this.renderTabs()}
					<ScrollView
						ref={element => (this.scrollView = element)}
						horizontal
						contentContainerStyle={{ flexDirection: 'column' }}
					>
						<View style={{ flexDirection: 'row' }}>
							{this.state.timeslots &&
								this.state.timeslots.map((item, index) => {
									return item;
								})}
						</View>
						<View style={{ flexDirection: 'row', marginLeft: interval / 2 }}>
							{this.state.mainSlots &&
								this.state.mainSlots.map((object, index) => (
									<Slot
										onPress={() => {
											current_artist = this.state.artists.filter(
												x => x.artist_id == item.artistId
											)[0];
											this.setState({
												show_popup: true,
												current_artist
											});
										}}
										artists={this.state.artists}
										user_id={this.state.user.id}
										loggedIn={this.state.loggedIn}
										notifyParent={() => this.fetchFavorites()}
										{...object}
									/>
								))}
						</View>
						<View style={{ flexDirection: 'row', marginLeft: interval / 2 }}>
							{this.state.sandSlots &&
								this.state.sandSlots.map((object, index) => (
									<Slot
										onPress={() => {
											current_artist = this.state.artists.filter(
												x => x.artist_id == item.artistId
											)[0];
											this.setState({
												show_popup: true,
												current_artist
											});
										}}
										artists={this.state.artists}
										user_id={this.state.user.id}
										loggedIn={this.state.loggedIn}
										notifyParent={() => this.fetchFavorites()}
										{...object}
									/>
								))}
						</View>
						{this.state.today === this.state.active && (
							<View
								style={{
									marginTop: 20,
									position: 'absolute',
									marginLeft: this.state.timer,
									alignItems: 'center'
								}}
							>
								<View
									style={{
										height: 10,
										width: 10,
										borderRadius: 5,
										backgroundColor: '#ffec59',
										alignSelf: 'center'
									}}
								/>
								<View
									style={{
										width: 1,
										backgroundColor: '#ffec59',
										height: Layout.window.height
									}}
								/>
							</View>
						)}
					</ScrollView>
					<Image
						source={require('../assets/images/main.png')}
						style={{
							height: 160,
							width: interval / 2,
							resizeMode: 'cover',
							position: 'absolute',
							top: 70,
							left: -3,
							transform: [{ rotate: '-3deg' }]
						}}
					/>
					<Image
						source={require('../assets/images/sandBox.png')}
						style={{
							height: 160,
							width: interval / 2,
							resizeMode: 'cover',
							position: 'absolute',
							top: 220,
							left: -3,
							transform: [{ rotate: '-3deg' }]
						}}
					/>
				</ImageBackground>
				{this.state.current_artist &&
					this.state.show_popup && (
						<ArtistPopup
							loggedIn={this.state.loggedIn}
							user={this.state.user}
							artist={this.state.current_artist}
							color1={this.state.colors1[this.state.colorIdx]}
							color2={this.state.colors2[this.state.colorIdx]}
							notifyParent={() => this.fetchFavorites()}
							onClose={() =>
								this.setState({
									show_popup: false,
									colorIdx:
										this.state.colorIdx + (1 % this.state.colors1.length)
								})
							}
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
	},
	tabsContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#ffec59',
		height: 35
	},
	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 35
	}
});
