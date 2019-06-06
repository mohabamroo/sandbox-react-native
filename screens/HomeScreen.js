import React from 'react';
import { Notifications } from 'expo'
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ImageBackground,
	Button
} from 'react-native';
import moment from 'moment';
import * as __GStyles from '../styles';
import { NavigationController } from '../navigation/index';
import HeaderComponent from '../components/HeaderComponent';
import Quadrilateral from '../components/Quadrilateral';
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import ArtistPopup from './ArtistPopup';

// import the page components
import { Boxes } from '../components/Boxes';
import { News } from '../components/News';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
import { CountDownTimer } from '../components/CountDownTimer';
import { UserBrief } from '../components/UserBrief';
import {
	EventInfoDB,
	SchedualDB,
	ArtistsDB,
	UserDB,
	FavoritesDB
} from '../Config/DB';
import Footer from '../components/Footer';
import {
	registerForPushNotificationsAsync,
	scheduleFavoritesNotifications
} from '../components/Notifications';

// const start_days = [moment]

export default class HomeScreen extends React.Component {
	__navigationOptions = {
		title: {
			text: 'The Home Screen',
			fontColor: 'yellow',
			bgColor: 'rgb(219, 109, 98)'
		},
		mainHeader: {
			bg: 'bg1'
		},
		subHeader: {
			bg: 'circ2'
		}
	};
	constructor(props) {
		super(props);
		this.navigationController = new NavigationController(this.props.navigation);
		this.state = {
			timeState: 2,
			currentEvents: null,
			current_artist: false,
			show_popup: false,
			loggedIn: false
		};
		this.handleSchedule = this.handleSchedule.bind(this);
		// sets state
		let countState = this.handleCountdown();
		this.refreshUserAccount();
		this.state = {
			...countState
		};
		this.notifyEventStart = this.notifyEventStart.bind(this);
		this.refreshUserAccount = this.refreshUserAccount.bind(this);
	}

	async componentDidMount() {
		// check the timestate..
		let general = await EventInfoDB.Get();
		let schedule = await SchedualDB.Get();
		let artists = await ArtistsDB.Get();
		this.setState(
			{
				general,
				schedule,
				artists
			},
			() => {
				this.handleState();
			}
		);
		this.handleSchedule();
		this._interval = setInterval(() => this.handleSchedule(), 6000000);
		registerForPushNotificationsAsync();
		scheduleFavoritesNotifications();
	}

	componentWillUnmount() {
		clearInterval(this._interval);
	}


	handleSchedule() {
		let { schedule } = this.state;
		days = Object.keys(schedule);
		let now = moment();
		// If festival has not started or has ended
		let day = '';
		if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 13, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 14, hour: 5, minute: 0 })
			)
		) {
			day = 'day1';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 14, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 15, hour: 4, minute: 0 })
			)
		) {
			day = 'day2';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 15, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 16, hour: 4, minute: 0 })
			)
		) {
			day = 'day3';
		} else {
			return;
		}
		let currentM = schedule[day]['Main Stage'].filter(x => {
			start = moment(x.session_start_time, 'HH:mm');
			end = moment(x.session_end_time, 'HH:mm');
			if (end.hours() < 12 && start.hours() >= 12) end.add(1, 'days');
			return start.isBefore(now) && end.isAfter(now);
		});
		let currentS = schedule[day]['SANDBOX Stage'].filter(x => {
			start = moment(x.session_start_time, 'HH:mm');
			end = moment(x.session_end_time, 'HH:mm');
			if (end.hours() < 12 && start.hours() >= 12) end.add(1, 'days');
			return start.isBefore(now) && end.isAfter(now);
		});

		let indexM, indexS, nextM, nextS;
		schedule[day]['Main Stage'].forEach((artist, index) => {
			if (currentM[0].artistName === artist.artistName) indexM = index;
		});

		schedule[day]['SANDBOX Stage'].forEach((artist, index) => {
			if (currentS[0].artistName === artist.artistName) indexS = index;
		});
		if (indexM === currentM.length - 1) {
			indexM = null;
		} else {
			indexM += 1;
			nextM = schedule[day]['Main Stage'][indexM];
		}
		if (indexS === currentS.length - 1) {
			indexS = null;
		} else {
			indexS += 1;
			nextS = schedule[day]['SANDBOX Stage'][indexS];
		}

		this.setState({
			currentEvents: {
				sandbox: currentS[0],
				main: currentM[0],
				nextM,
				nextS
			}
		});
	}

	handleCountdown() {
		// FIXME: hardcoded for testing
		const startDateTime = new Date('2019-06-13T13:00:00Z');
		const endDateTime = new Date('2019-06-16T04:00:00Z');
		let diff = Math.floor((startDateTime - new Date()) / 1000);
		diff = 5000;
		const endedFlag = Math.floor((new Date() - endDateTime) / 1000);
		const self = this;
		return {
			timeState: 2,
			startDateTime,
			countDown: diff,
			endedFlag: endedFlag > 0
		};
	}

	showDetials(artistInfo) {
		current_artist = this.state.artists.filter(
			x => x.artist_id == artistInfo.artistId
		)[0];
		this.setState({
			show_popup: true,
			current_artist
		});
	}

	refreshUserAccount() {
		let userState;
		let self = this;
		UserDB.Get().then(userData => {
			console.log(
				'TCL: HomeScreen -> refreshUserAccount -> userData',
				userData
			);
			if (userData != null) {
				userState = { user: { ...userData }, loggedIn: true };
			} else {
				userState = { loggedIn: false };
			}
			this.setState({ ...userState });
		});
	}

	handleState() {
		// check for after event state.
		let endDateObject = this.state.general
			? this.state.general.festival_end_date
			: new Date();
		let currentDate = Date.now();
		let endDate = new Date();
		endDate.setHours(
			endDateObject.hour,
			endDateObject.minute,
			endDateObject.seconds,
			endDateObject.milliseconds
		);
		endDate.setFullYear(endDateObject.year);
		endDate.setDate(endDateObject.day);
		endDate.setMonth(endDateObject.month);
		if (currentDate >= endDate.getTime()) {
			this.setState({
				timeState: 1
			});
		}
	}

	refreshUserAccount() {
		let userState;
		let self = this;
		UserDB.Get().then(userData => {
			if (userData != null) {
				userState = { user: { ...userData }, loggedIn: true };
			} else {
				userState = { loggedIn: false };
			}
			this.setState({ ...userState });
		});
	}

	notifyEventStart() {
		console.log('event start');
		// this.setState({ countDown: 0 });

		this.navigationController.direct('Loading');
	}

	render() {
		return (
			<ImageBackground
				source={Assets.bg1}
				resizeMode="repeat"
				style={styles.imageBG}
			>
				<View style={__GStyles.default.container}>
					<HeaderComponent
						navigationOptions={this.__navigationOptions}
						navigation={this.props.navigation}
					/>
					<View>
						{!this.state.loggedIn ? (
							<ImageBackground
								resizeMode="stretch"
								source={Assets.homeProfile}
								style={styles.profileBG}
							>
								<View style={styles.textContainer}>
									<Text style={styles.beforeActivationTextBG}>
										You did not activate you pass yet?!
									</Text>
									<TouchableOpacity
										activeOpacity={0.9}
										style={styles.buttonActivate}
										onPress={() => {
											this.navigationController.direct('Activation1', {
												notifyParent: this.refreshUserAccount
											});
										}}
									>
										<View>
											<Text style={styles.activateText}>
												{String('Activate Your PASS now').toUpperCase()}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</ImageBackground>
						) : (
							<UserBrief
								navigation={this.props.navigation}
								NACController={this.navigationController}
								user={this.state.user}
							/>
						)}
					</View>
					<ScrollView style={{ marginTop: -10 }}>
						{this.state.countDown > 0 ? (
							<CountDownTimer
								duration={this.state.countDown}
								startDateTime={this.state.startDateTime}
								notifyParent={this.notifyEventStart}
							/>
						) : null}
						{this.state.endedFlag ? (
							<View style={styles.counter}>
								<View style={styles.seeYouContainer}>
									<Text style={styles.seeYou}>SEE YOU NEXT YEAR</Text>
								</View>
								{/* {this.state.timeState == 2 && (
                <View style={styles.seeYouContainer}>
                  <Text style={styles.dotsText}> ... </Text>
                </View>
              )} */}
							</View>
						) : null}
						{this.state.currentEvents && (
							<CurrentlyPlaying
								currentEvents={this.state.currentEvents}
								showDetials={artist => this.showDetials(artist)}
							/>
						)}
						{/** The boxes area */}
						<Boxes
							user={this.state.user}
							loggedIn={this.state.loggedIn}
							NACController={this.navigationController}
						/>

						{/**News section */}
						<News />
						<View style={styles.paddingDiv} />
					</ScrollView>
				</View>
				{this.state.current_artist &&
					this.state.show_popup && (
						<ArtistPopup
							loggedIn={this.state.loggedIn}
							user={this.state.user}
							artist={this.state.current_artist}
							color1={'#7bc19e'}
							color2={'#f8b7bb'}
							onClose={() => this.setState({ show_popup: false })}
						/>
					)}

				<Footer />
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	imageBG: {
		width: '100%',
		height: '100%'
	},
	profileBG: {
		width: '100%',
		height: 100,
		zIndex: 3,
		justifyContent: 'center'
	},
	counter: {
		backgroundColor: '#7bc19e',
		width: '100%',
		height: 100,
		zIndex: 2,
		marginTop: -10
	},
	beforeActivationTextBG: {
		backgroundColor: '#fde9d6',
		padding: 5,
		color: '#f069a7',
		fontSize: 12
	},
	textContainer: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: '10%'
	},
	buttonActivate: {
		backgroundColor: '#f069a7',
		padding: 10
	},
	activateText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	seeYou: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#FFEB5C'
	},
	seeYouContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dotsText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'rgba(0,0,0,.1)'
	},
	paddingDiv: {
		height: Layout.window.height / 4
	}
});
