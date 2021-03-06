import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { Entypo, EvilIcons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';
import Assets from '../constants/Assets';
import { FavoritesDB } from '../Config/DB';
import moment from 'moment';
const URLs = require('../Config/ExternalURL');

export default class ArtistPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: this.props.artist,
      opacity: new Animated.Value(0),
      position: new Animated.Value(Layout.window.height),
      loggedIn: this.props.loggedIn,
			user: this.props.user,
			userID: this.props.user ? this.props.user.id : 38
    };
    this._likeArtist = this._likeArtist.bind(this);
  }

  componentWillMount() {
    Animated.sequence([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 450
      }),
      Animated.timing(this.state.position, {
        toValue: Layout.window.height * 0.05,
        duration: 450
      })
    ]).start();
  }

  componentDidMount() {
  }

  _likeArtist(opts) {
    if(this.state.loggedIn){
      let newLike = this.state.artist.liked == true ? false : true;
      this.setState({
        artist: { ...this.state.artist, liked: newLike }
      });
      let reqURL = newLike == true ? likeArtist : removeArtistLike;
      fetch(reqURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opts)
      }).then(res => {
        if (res.status == 200) {
          this.refreshFavorites().then(() => {
            console.log('refreshing cache');
            this.props.notifyParent();
          });
        } else {
          this.setState({
            artist: { ...this.state.artist, liked: false }
          });
        }
      });
    } else {
      Alert.alert('Please login to like this artist.')
    }
  }

  refreshFavorites() {
    return new Promise((res, rej) => {
      fetch(URLs.getFavorites(this.state.userID))
        .then(response => response.json())
        .then(apiResponse => {
          if (apiResponse.Status == 200) {
            FavoritesDB.Set(apiResponse.data).then(() => res());
          } else {

          }
        })
        .catch(err => {
          rej(err);
          // FIXME: what to do on internet corruption
        });
    });
  }

  onClose(){
    Animated.sequence([
      Animated.timing(this.state.position, {
        toValue: Layout.window.height,
        duration: 450
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 450
      })
    ]).start(() => this.props.onClose());

  }

  render() {
    let { artist, color1, color2, isVisible } = this.props;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          height: Layout.window.height,
          width: Layout.window.width,
          opacity: this.state.opacity,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            position: 'absolute',
            height: Layout.window.height * 1.2,
            width: Layout.window.width,
            opacity: 0.8,
            backgroundColor: 'black'
          }}
        />
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: color1, top: this.state.position }
          ]}
        >
          <Image
            source={{ uri: artist.artist_image }}
            style={styles.image}
            resizeMode={'cover'}
          />
          {this.state.loggedIn && (
            <TouchableOpacity
              style={styles.like}
              onPress={() =>
                this._likeArtist({ artist_id: artist.artist_id, user_id: this.state.userID })
              }
            >
              <Image
                source={
                  this.state.artist && this.state.artist.liked == true
                    ? Assets.heart_on
                    : Assets.heart_off
                }
                style={{ width: 25, height: 25 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          )}
          <View style={[styles.triangle, { borderBottomColor: color2 }]} />
          <Text style={styles.artistName}>{artist.artist_name}</Text>
          <View style={styles.sessionInfo}>
						<Text style={styles.sessionDay}>
							{artist['artist_session'] && artist['artist_session']['session_stage']
								? artist['artist_session']['session_stage'].toUpperCase()
								: 'MAIN STAGE'}
						</Text>
						<Text style={styles.sessionTime}>
							{artist['artist_session'] && artist['artist_session']['session_day']
								? artist['artist_session']['session_day'].replace('day', 'DAY ') +
								  ', ' +
								  moment(
										artist['artist_session']['session_start_time'],
										'HH:mm'
								  ).format('hh:mmA') +
								  ' - ' +
								  moment(
										artist['artist_session']['session_end_time'],
										'HH:mm'
								  ).format('hh:mmA')
								: ''}
						</Text>
					</View>
          <TouchableOpacity
            onPress={() => this.onClose()}
            style={styles.close}
          >
            <Image
              source={Assets.close}
              resizeMode={'contain'}
              style={{ width: 30 }}
            />
          </TouchableOpacity>
          <View style={[styles.triangle2, { borderTopColor: color1 }]} />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => Linking.openURL(artist.artist_soundcloud)}
          >
            <Entypo name="soundcloud" size={28} color="orange" />
          </TouchableOpacity>
          <ScrollView
            style={[styles.textArea, { backgroundColor: color1 }]}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 200
            }}
          >
            <Text style={styles.description}>{artist.artist_description}</Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: '30%',
    height: Layout.window.height * 0.7,
    width: Layout.window.width * 0.9
  },
  icon: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    top: Layout.window.width * 0.46,
    right: Layout.window.width * 0.06
  },
  image: {
    height: Layout.window.width * 0.9
  },
  like: {
    position: 'absolute',
    top: 15,
    left: 15
  },
  triangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: Layout.window.width * 0.7,
    borderBottomWidth: Layout.window.width * 0.6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }]
  },
  triangle2: {
    position: 'absolute',
    top: Layout.window.width * 0.5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: Layout.window.width * 0.9,
    borderTopWidth: Layout.window.width * 0.1,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end',
    transform: [{ rotate: '180deg' }]
  },
  textArea: {
    position: 'absolute',
    top: Layout.window.width * 0.6,
    width: Layout.window.width * 0.9,
    height: Layout.window.width * 0.85
  },
  artistName: {
    position: 'absolute',
    right: 17,
    top: Layout.window.width * 0.05,
    maxWidth: Layout.window.width * 0.5,
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  },
  close: {
    position: 'absolute',
    top: -30,
    right: -20,
    height: 50,
    width: 50,
    justifyContent: 'center'
  },
  description: {
    fontSize: 14,
    color: 'white',
    fontWeight: '200'
  },
  sessionInfo: {
    position: 'absolute',
    right: 17,
    top: Layout.window.width * 0.05 + 40,
    fontSize: 20,
    color: 'white',
		textAlign: 'right',
		color: '#fff',

	},
	sessionDay: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'right',
		fontSize: 12
	},
	sessionTime: {
		color: '#fff',
		fontSize: 8,
		textAlign: 'right'
	}
});
