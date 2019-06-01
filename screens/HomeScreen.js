import React from 'react';
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
import Footer from '../components/Footer';
import Quadrilateral from '../components/Quadrilateral';
import CurrentlyPlaying from '../components/CurrentlyPlaying';

// import the page components
import { Boxes } from '../components/Boxes';
import { News } from '../components/News';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
import { EventInfoDB, SchedualDB } from '../Config/DB';

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
			currentEvents: null
		};
		this.handleSchedule = this.handleSchedule.bind(this);
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
				moment().set({ year: 2019, month: 5, date: 14, hour: 12, minute: 15 })
			)
		) {
			day = 'day1';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 14, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 15, hour: 11, minute: 59 })
			)
		) {
			day = 'day2';
		} else if (
			now.isAfter(
				moment().set({ year: 2019, month: 5, date: 15, hour: 12, minute: 59 })
			) &&
			now.isBefore(
				moment().set({ year: 2019, month: 5, date: 16, hour: 15, minute: 59 })
			)
		) {
			day = 'day3';
		} else {
      return
    }

    let hour = now.get('hour')
    hour = ('0' + hour).slice(-2);
    let minute = now.get('minute')
    minute = minute > 30 ? '30' : '00'

    time = hour+':'+minute
    this.setState({
      currentEvents: {
        sandbox: schedule[day][time]['sandBoxStage'],
        main: schedule[day][time]['MainStage']
      }
    });
	}

	async componentDidMount() {
		// check the timestate..
		let general = await EventInfoDB.Get();
		let schedule = await SchedualDB.Get();
		console.log('TCL: HomeScreen -> componentDidMount -> general', general);
		this.setState(
			{
				general,
				schedule
			},
			() => {
				this.handleState();
			}
		);
		this.handleSchedule();
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
										console.log('Press');
										this.navigationController.direct('Profile');
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
					</View>
					<ScrollView style={{ marginTop: -10 }}>
						<View style={styles.counter}>
							{this.state.timeState == 1 && (
								<View style={styles.seeYouContainer}>
									<Text style={styles.seeYou}>SEE YOU NEXT YEAR</Text>
								</View>
							)}
							{this.state.timeState == 2 && (
								<View style={styles.seeYouContainer}>
									<Text style={styles.dotsText}> ... </Text>
								</View>
							)}
						</View>
						{this.state.currentEvents && <CurrentlyPlaying currentEvents={this.state.currentEvents}/>}
						<Boxes NACController={this.navigationController} />
						{/** The boxes area */}

						{/**News section */}

						<News />
						<View style={styles.paddingDiv} />
					</ScrollView>
				</View>
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
		color: '#fff'
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
