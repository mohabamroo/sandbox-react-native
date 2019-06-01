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
import { EventInfoDB } from '../Config/DB';
import { CountDownTimer } from '../components/CountDownTimer';
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

  recursiveFunc(endDateTime) {
    const self = this;
    setTimeout(() => {
      const newEndedFlag = Math.floor((endDateTime - new Date()) / 1000);
      self.setState({
        endedFlag: newEndedFlag <= 0
      });
      this.recursiveFunc(endDateTime);
    }, 5 * 1000);
  }

  constructor(props) {
    super(props);
    this.navigationController = new NavigationController(this.props.navigation);
    const startDateTime = new Date('2019-06-13T13:00:00Z');
    const endDateTime = new Date('2019-06-16T04:00:00Z');
    const diff = Math.floor((startDateTime - new Date()) / 1000);
    const endedFlag = Math.floor((endDateTime - new Date()) / 1000);
    this.recursiveFunc(endDateTime);
    this.state = {
      timeState: 2,
      startDateTime,
      countDown: diff,
      endedFlag: endedFlag <= 0
    };
  }
  async componentDidMount() {
    // check the timestate..
    let general = await EventInfoDB.Get();
    console.log('TCL: HomeScreen -> componentDidMount -> general', general);
    this.setState(
      {
        general
      },
      () => {
        this.handleState();
      }
    );
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
            {this.state.countDown > 0 ? (
              <CountDownTimer
                duration={this.state.countDown}
                startDateTime={this.state.startDateTime}
              />
            ) : null}
          </View>
          <ScrollView style={{ marginTop: -10 }}>
            {this.state.endedFlag && (
              <View style={styles.counter}>
                <View style={styles.seeYouContainer}>
                  <Text style={styles.seeYou}>SEE YOU NEXT YEAR!</Text>
                </View>
              </View>
            )}

            <CurrentlyPlaying />
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
