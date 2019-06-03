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
import moment from 'moment';

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

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_popup: false,
      current_artist: null,
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
    this.fetchArtists()
  }

  async fetchArtists() {
    let artists = await ArtistsDB.Get();
    this.setState({artists})
  }

  async fetchCategories() {
    let scheduleRes = await SchedualDB.Get();
    this.setSchedule(scheduleRes);
    this.refreshSchedule();
  }

  setSchedule(schedObj) {
    Object.keys(schedObj).forEach(day => {

      let mainStage = schedObj[day]['Main Stage']
      let sandBox = schedObj[day]['SANDBOX Stage']
      let i = 0, j = 0, maxI = mainStage.length, maxJ = sandBox.length;
      let begin, end;

      // Set Begin and End Times of the day
      beginMain = moment(mainStage[0]['session_start_time'], "HH:mm")
      beginSand = moment(sandBox[0]['session_start_time'], "HH:mm")
      begin = beginMain.isBefore(beginSand) ? beginMain : beginSand

      endMain = moment(mainStage[mainStage.length-1]['session_end_time'], "HH:mm").add(24, 'hours')
      endSand = moment(sandBox[sandBox.length-1]['session_end_time'], "HH:mm").add(24, 'hours')
      end = endMain.isBefore(endSand) ? endSand : endMain

      console.log('begin:', begin.format("HH:mm"), 'end', end.format("HH:mm") )
      let mainSlots = [], sandSlots = [];
      while(begin.isBefore(end)){
        beginMain = moment(mainStage[i]['session_start_time'], "HH:mm")
        beginSand = moment(sandBox[j]['session_start_time'], "HH:mm")
        endMain = moment(mainStage[i]['session_end_time'], "HH:mm")
        endSand = moment(sandBox[j]['session_end_time'], "HH:mm")
        begin.add(30,'minutes')
      }


    });
    // if (!schedObj.day1) return;
    // this.setState({
    //   day_1: {
    //     MainStage: schedObj.day1['Main Stage'],
    //     sandBoxStage: schedObj.day1['SANDBOX Stage']
    //   },
    //   day_2: {
    //     MainStage: schedObj.day2['Main Stage'],
    //     sandBoxStage: schedObj.day2['SANDBOX Stage']
    //   },
    //   day_3: {
    //     MainStage: schedObj.day3['Main Stage'],
    //     sandBoxStage: schedObj.day3['SANDBOX Stage']
    //   }
    // });

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
      <TouchableOpacity onPress={() =>{
        current_artist = this.state.artists.filter(
          x => x.artist_id == item.artistId
        )[0];
        this.setState({
        show_popup: true,
        current_artist,
        color1: '#7bc19e',
        color2: '#f8b7bb'
      })}}>
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
      <TouchableOpacity onPress={() =>{
        current_artist = this.state.artists.filter(
          x => x.artist_id == item.artistId
        )[0];
        this.setState({
        show_popup: true,
        current_artist,
        color1: '#7bc19e',
        color2: '#f8b7bb'
      })}}>
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

  renderSlot(item) {
    return null
  }

  render() {
    /**  <Image
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
      />*/
    return (
      <ImageBackground
        style={__GStyles.default.container}
        source={require('../assets/images/bgschedul.png')}
        resizeMode={'cover'}
      >
          <HeaderComponent navigation={this.props.navigation} />

          <View style={{ flexDirection: 'row' }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[]}
              extraData={this.state}
              keyExtractor={item => item.artistId}
              renderItem={({ item }) => this.renderSlot(item)}
            />
          </View>
          {this.state.current_artist && this.state.show_popup && (
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
