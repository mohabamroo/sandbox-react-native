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
      timeState: 2
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
          </View>
          <ScrollView style={{marginTop: -10}}>
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
