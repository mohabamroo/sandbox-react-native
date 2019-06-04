import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import moment from 'moment';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';
import { FavoritesDB } from '../Config/DB';

import Layout from '../constants/Layout';
import Assets from '../constants/Assets';
const URLs = require('../Config/ExternalURL');

export default class ArtistRow extends React.Component {
  preventDefault = false;
  constructor(props) {
    super(props);
    this.state = {
      artist: this.props.artist,
      user_id: 38
    };
  }

  async componentDidMount() {}

  componentWillUnmount() {}

  _handleLikeClick() {
    console.log('like clicked');
    this.preventDefault = true;
    this._likeArtist();
    this.preventDefault = false;
  }

  _likeArtist() {
    let newLike = this.state.artist.liked == true ? false : true;
    this.setState({
      artist: { ...this.state.artist, liked: newLike }
    });
    let reqURL = newLike == true ? likeArtist : removeArtistLike;
    let opts = {
      artist_id: this.state.artist.artist_id,
      user_id: this.state.user_id
    };
    fetch(reqURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opts)
    }).then(res => {
      if (res.status == 200) {
        this.refreshFavorites().then(() => {
          this.props.notifyParent();
        });
      } else {
        this.setState({
          artist: { ...this.state.artist, liked: false }
        });
      }
    });
  }

  refreshFavorites() {
    return new Promise((res, rej) => {
      fetch(URLs.getFavorites(this.state.user_id))
        .then(response => response.json())
        .then(apiResponse => {
          if (apiResponse.Status == 200) {
            FavoritesDB.Set(apiResponse.data).then(() => res());
          } else {
            console.log(
              'TCL: ArtistPopup -> refreshFavorites -> apiResponse',
              apiResponse
            );
          }
        })
        .catch(err => {
          rej(err);
          // FIXME: what to do on internet corruption
        });
    });
  }

  handleRowClick() {
    if (!this.preventDefault) {
      this.props.click();
    }
  }

  render() {
    let { artist: row, index, color, color2 } = this.props;
    return (
      <TouchableHighlight
        onPress={() => this.handleRowClick()}
      >
        <View key={index} style={styles.artistRow}>
          <Image source={{ uri: row.artist_image }} style={styles.image} />
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
              top: 5,
              left: 5,
              zIndex: 3
            }}
            activeOpacity={0.5}
            onPress={() => this._handleLikeClick()}
          >
            <Image
              source={
                row && row.liked == true ? Assets.heart_on : Assets.heart_off
              }
              style={{
                width: 14,
                height: 14
              }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.triangle,
              styles.triangleDown,
              styles.nameArea,
              { borderBottomColor: color }
            ]}
          />
          <Text style={styles.artistName}>{row['artist_name']}</Text>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionDay}>
              {row['artist_session'] && row['artist_session']['session_stage']
                ? row['artist_session']['session_stage'].toUpperCase()
                : 'MAIN STAGE'}
            </Text>
            <Text style={styles.sessionTime}>
              {row['artist_session'] && row['artist_session']['session_day']
                ? row['artist_session']['session_day'].replace('day', 'DAY ') +
                  ', ' +
                  moment(row['artist_session']['session_start_time'], 'HH:mm').format('hh:mmA') +
                  ' - ' +
                    moment(row['artist_session']['session_end_time'], 'HH:mm').format('hh:mmA')
                : ''}
            </Text>
          </View>
          <View
            style={[
              styles.triangle2,
              styles.triangleCornerBottomRight,
              styles.footerArea,
              { borderTopColor: color2 }
            ]}
          >
            <View
              style={{
                flex: 1,
                width: Layout.window.width,
                height: Layout.window.width,
                backgroundColor: 'red'
              }}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1
  },

  artistRow: {
    flexDirection: 'row',
    width: '100%',
    height: Layout.window.width / 3,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: Layout.window.width / 3,
    height: Layout.window.width / 3,
    backgroundColor: '#fde9d6'
  },
  triangle: {
    width: 0,
    height: 0,
    borderBottomWidth: Layout.window.width,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: Layout.window.width,
    borderRightWidth: Layout.window.width / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  triangleDown: {
    transform: [{ rotate: '180deg' }]
  },
  nameArea: {
    marginLeft: (Layout.window.width / 6) * -1
  },
  footerArea: {
    position: 'absolute',
    right: 0,
    zIndex: 9
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 2 * (Layout.window.width / 2.5),
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end'
  },
  triangleCornerBottomRight: {
    transform: [{ rotate: '180deg' }]
  },
  artistName: {
    position: 'absolute',
    top: 20,
    left: Layout.window.width / 3 - 20,
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#fff'
  },
  sessionInfo: {
    color: '#fff',
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 20,
    textAlign: 'right',
    zIndex: 10
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
