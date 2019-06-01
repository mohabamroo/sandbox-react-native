import React from 'react';
import {
  ScrollView,
  ListView,
  StyleSheet,
  View,
  ImageBackground
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import ArtistPopup from './ArtistPopup';
import Footer from '../components/Footer';
import Assets from '../constants/Assets';

import * as __GStyles from '../styles';
import { FavoritesDB } from '../Config/DB';
import ArtistRow from '../components/ArtistRow';
import { Label } from '../components/Label';
const URLs = require('../Config/ExternalURL');

export default class ProfileScreen extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  constructor(props) {
    super(props);
    this.state = {
      active: 'all',
      colors: ['#fabb79', '#008691', '#e9665d', '#60a484'],
      colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
      artists: this.ds.cloneWithRows([]),
      currentCount: 0,
      current_artist: null,
      show_popup: false,
      color1: '#fff',
      color2: '#fff',
      userID: 38
    };
  }

  async componentDidMount() {
    // fetch favorites
    FavoritesDB.Get()
      .then(artists => {
        if (artists == null) {
          throw new Error('Null cache');
        } else {
          this.setArtists(artists);
        }
      })
      .catch(err => {
        console.log('failed to fetch from cache', err);
        fetch(URLs.getFavorites(this.state.userID))
          .then(response => response.json())
          .then(apiResponse => {
            if (apiResponse.Status == 200) {
              this.setArtists(apiResponse.data);
              FavoritesDB.Set(apiResponse.data);
            }
          })
          .catch(err => {
            // FIXME: what to do on internet corruption
            console.log('TCL: ProfileScreen -> componentDidMount -> err', err);
          });
      });
  }

  setArtists(artists) {
    artists = artists.filter(x => x.artist_session);
    let dsData = this.ds.cloneWithRows(artists);
    this.setState({
      artists: dsData
    });
  }

  componentWillUnmount() {}

  renderArtist(row, L, index) {
    let color = this.state.colors[index % Number(this.state.colors.length)];
    let color2 = this.state.colors2[index % Number(this.state.colors2.length)];
    row.liked = true;
    return (
      <ArtistRow
        index={index}
        artist={row}
        color={color}
        color2={color2}
        lastRow={index == this.state.currentCount - 1}
        click={() =>
          this.setState({
            show_popup: true,
            current_artist: row,
            color1: color,
            color2
          })
        }
      />
    );
  }

  section() {
    return;
  }

  // FIXME: weird logic on dislike, what about stage filtering
  fetchFavorites() {
    let initialArtists = this.state.initialArtists;
    // artists: dsData,
    FavoritesDB.Get().then(artists => {
      // changing state
      console.log('Changing state');
      this.setArtists(artists);
    });
  }

  render() {
    let title = {
      text: 'MY FAVORITES',
      fontColor: 'white',
      bgColor: '#E9665C'
    };
    return (
      <View style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ImageBackground
          source={Assets.circ2}
          style={[__GStyles.default.subHeaderContainer]}
          resizeMode="repeat"
        >
          <View style={__GStyles.default.subHeaderContent}>
            <View
              style={[
                __GStyles.default.subHeaderContentView,
                { alignItems: 'flex-start' }
              ]}
            >
              {title && <Label title={title} />}
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          resizeMode="repeat"
          source={Assets.bg4}
          style={[styles.container, { width: '100%' }]}
        >
          <ScrollView bounces={false} style={{ flex: 1 }}>
            <ListView
              bounces={false}
              dataSource={this.state.artists}
              renderRow={this.renderArtist.bind(this)}
              enableEmptySections={this.section}
            />
          </ScrollView>
        </ImageBackground>
        {this.state.current_artist && (
          <ArtistPopup
            isVisible={this.state.show_popup}
            artist={this.state.current_artist}
            color1={this.state.color1}
            color2={this.state.color2}
            onClose={() => this.setState({ show_popup: false })}
            notifyParent={() => this.fetchFavorites()}
          />
        )}
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
