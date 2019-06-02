import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import { AntDesign } from '@expo/vector-icons';
// import the page components
import Assets from '../constants/Assets';

import * as __GStyles from '../styles';
import Footer from '../components/Footer';
import { SchedualDB } from '../Config/DB';
const URLs = require('../Config/ExternalURL');

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      day_1: {
        MainStage: [],
        sandBoxStage: []
      },
      day_2: {
        MainStage: [],
        sandBoxStage: []
      },
      day_3: {
        MainStage: [],
        sandBoxStage: []
      }
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  async fetchCategories() {
    let scheduleRes = await SchedualDB.Get();
    this.setSchedule(scheduleRes);
    this.refreshSchedule();
  }

  setSchedule(schedObj) {
    if (!schedObj.day1) return;
    this.setState({
      day_1: {
        MainStage: schedObj.day1['Main Stage'],
        sandBoxStage: schedObj.day1['SANDBOX Stage']
      },
      day_2: {
        MainStage: schedObj.day2['Main Stage'],
        sandBoxStage: schedObj.day2['SANDBOX Stage']
      },
      day_3: {
        MainStage: schedObj.day3['Main Stage'],
        sandBoxStage: schedObj.day3['SANDBOX Stage']
      }
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
      <TouchableOpacity>
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
      <TouchableOpacity>
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

          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../assets/images/main.png')}
              style={{ height: 150, width: 60, resizeMode: 'cover' }}
            />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.day_1.MainStage}
              extraData={this.state}
              keyExtractor={item => item.artistId}
              renderItem={({ item }) => this.renderMainStageArtiest(item)}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../assets/images/sandBox.png')}
              style={{ height: 150, width: 60 }}
            />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.day_1.sandBoxStage}
              extraData={this.state}
              keyExtractor={item => item.artistId}
              renderItem={({ item }) => this.renderSandBoxStageArtiest(item)}
            />
          </View>

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
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderRightWidth: 74,
    borderBottomWidth: 150,
    borderLeftColor: 'transparent',
    borderRightColor: '#f8b7bb',
    borderBottomColor: '#f8b7bb',
    position: 'absolute',
    transform: [{ rotate: '180deg' }],
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderRightWidth: 74,
    borderBottomWidth: 150,
    borderLeftColor: 'transparent',
    borderRightColor: '#7ac19d',
    borderBottomColor: '#7ac19d',
    position: 'absolute',
    transform: [{ rotate: '180deg' }],
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1
  }
});
