import React from 'react';
import {
  ScrollView,
  ListView,
  StyleSheet,
  View,
  ImageBackground,
  RefreshControl,
  BackHandler
} from 'react-native';
import ArtistPopup from './ArtistPopup';
import Assets from '../constants/Assets';
import { NavigationController } from '../navigation/index';

import * as __GStyles from '../styles';
import { FavoritesDB } from '../Config/DB';
import ArtistRow from '../components/ArtistRow';
import { Label } from '../components/Label';
import { UserBrief } from '../components/UserBrief';
import Layout, * as layout from '../constants/Layout';
import Footer from '../components/Footer';

const URLs = require('../Config/ExternalURL');

export default class ProfileScreen extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  backHandler;
  constructor(props) {
    super(props);
    this.navigationController = new NavigationController(this.props.navigation);
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
      userID: this.props.navigation.state.params.user.id,
      user: this.props.navigation.state.params.user,
      notifyOnBack: this.props.navigation.state.params.notifyOnBack
    };
    this._onRefresh = this._onRefresh.bind(this);
    this.handleBackClick= this.handleBackClick.bind(this);
  }

  async componentDidMount() {
    // fetch favorites
    this.fetchFavoritesList();
    this.refreshFavoritesList();
    this.handleBackClick();
  }

	handleBackClick() {
		const self = this;
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
			if(self.state.show_popup) {
				self.setState({show_popup: false, current_artist: null});
				return true;
			}
			return false;
		  });
	}

  fetchFavoritesList() {
    FavoritesDB.Get()
      .then(artists => {
        if (artists == null) {
          throw new Error('Null cache');
        } else {
          this.setArtists(artists);
        }
      })
      .catch(err => {
        this.refreshFavoritesList();
      });
  }

  refreshFavoritesList() {
    this.setState({ refreshing: true });
    fetch(URLs.getFavorites(this.state.userID))
      .then(response => {
        return response.json();
      })
      .then(apiResponse => {
        if (apiResponse.Status == 200) {
          this.setArtists(apiResponse.data);
          FavoritesDB.Set(apiResponse.data);
        } else {
          this.setState({ refreshing: false });
        }
      })
      .catch(err => {
        this.setState({ refreshing: false });
        // FIXME: what to do on internet corruption
        console.log('TCL: ProfileScreen -> componentDidMount -> err', err);
      });
  }

  _onRefresh() {
    console.log('refreshing favorites list');
    this.refreshFavoritesList();
  }

  sortArrayAsc(array, key) {
    return array.sort(function(a, b) {
      return a.artist_name < b.artist_name
        ? -1
        : b.artist_name < a.artist_name
        ? 1
        : 0;
    });
  }

  setArtists(artists) {
    artists = artists.filter(x => x.artist_session);
    artists = this.sortArrayAsc(artists, 'artist_name');
    let dsData = this.ds.cloneWithRows(artists);
    this.setState({
      artists: dsData,
      refreshing: false
    });
  }

	componentWillUnmount() {
		this.backHandler.remove();
	}

  renderArtist(row, L, index) {
    let color = this.state.colors[index % Number(this.state.colors.length)];
    let color2 = this.state.colors2[index % Number(this.state.colors2.length)];
    row.liked = true;
    return (
      <ArtistRow
        index={index}
        loggedIn={true}
        user={this.state.user}
        artist={row}
        color={color}
        color2={color2}
        notifyParent={() => this.fetchFavorites()}
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

  __onLayout(event) {
    this.setState({
      marginTop: (event.nativeEvent.layout.height / 2) * -1
    });
  }
  render() {
    let title = {
      text: 'Your Favorites',
      fontColor: 'white',
      bgColor: 'rgb(231,102,97)'
    };
    return (
      <ImageBackground
        source={Assets.bg1}
        resizeMode="repeat"
        style={styles.imageBG}
      >
        <View style={[__GStyles.default.container, { paddingTop: 50 }]}>
          <UserBrief
            notifyOnBack={this.state.notifyOnBack}
            style={{ marginTop: 50 }}
            navigation={this.props.navigation}
            NACController={this.navigationController}
            user={this.state.user}
            hasBackBtn={true}
          />
          <ImageBackground
            source={Assets.circ2}
            style={[__GStyles.default.subHeaderContainer]}
            resizeMode="repeat"
          >
            <View style={__GStyles.default.subHeaderContent}>
              <View
                style={[
                  __GStyles.default.subHeaderContentView,
                  { alignItems: 'flex-end' }
                ]}
              >
                {title && <Label title={title} />}
              </View>
            </View>
          </ImageBackground>

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            bounces={false}
            style={{ flex: 1 }}
          >
            <ListView
              bounces={false}
              dataSource={this.state.artists}
              renderRow={this.renderArtist.bind(this)}
              enableEmptySections={this.section}
            />
            <View style={styles.footerMargin} />
          </ScrollView>
          <Footer />
        </View>
        {this.state.current_artist && (
          <ArtistPopup
            loggedIn={true}
            user={this.state.user}
            isVisible={this.state.show_popup}
            artist={this.state.current_artist}
            color1={this.state.color1}
            color2={this.state.color2}
            onClose={() =>
              this.setState({ current_artist: null, show_popup: false })
            }
            notifyParent={() => this.fetchFavorites()}
            style={{ zIndex: 1 }}
          />
        )}
      </ImageBackground>
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
  },
  imageBG: {
    width: '100%',
    height: '100%'
  },
  footerMargin: {
    height: Layout.window.height / 3
  }
});
