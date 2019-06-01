import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { Zocial, EvilIcons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import Footer from '../components/Footer';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';
import Assets from '../constants/Assets';
import { FavoritesDB } from '../Config/DB';
const URLs = require('../Config/ExternalURL');

export default class ArtistPopup extends React.Component {
  constructor(props) {
    super(props);
    console.log(
      'TCL: ArtistPopup -> constructor -> this.props.artist',
      this.props.artist
    );
    this.state = {
      artist: this.props.artist,
      userID: 38
    };
    this._likeArtist = this._likeArtist.bind(this);
  }

  componentDidMount() {
    console.log(
      'TCL: ArtistPopup -> after mount -> this.props.artist',
      this.props.artist
    );
  }
  refreshFavorites() {
    return new Promise((res, rej) => {
      fetch(URLs.getFavorites(this.state.userID))
        .then(response => response.json())
        .then(apiResponse => {
          if (apiResponse.Status == 200) {
            console.log(
              'TCL: ArtistPopup -> refreshFavorites -> suceess',
              apiResponse.data
            );
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
          console.log('TCL: ProfileScreen -> componentDidMount -> err', err);
        });
    });
  }

  _likeArtist(opts) {
    console.log('TCL: ArtistPopup -> _likeArtist -> opts', opts);
    let newLike = this.state.artist.liked == true ? false : true;
    this.setState({
      artist: { ...this.state.artist, liked: newLike }
    });
    console.log(likeArtist);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', newLike == true ? likeArtist : removeArtistLike, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(opts));
    xhr.onreadystatechange = e => {
      console.log('HELLO');
      console.log(xhr.responseText);
      if (newLike && xhr.responseText == 1) {
        this.refreshFavorites().then(() => {
          console.log('refresh cache');
          this.props.notifyParent();
        });
      } else {
        this.setState({
          artist: { ...this.state.artist, liked: false }
        });
      }
    };
  }

  render() {
    let { artist, color1, color2 } = this.props;
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={[styles.container, { backgroundColor: color1 }]}>
          <Image
            source={{ uri: artist.artist_image }}
            style={styles.image}
            resizeMode={'cover'}
          />
          <TouchableOpacity
            style={styles.like}
            onPress={() =>
              this._likeArtist({ artist_id: artist.artist_id, user_id: 38 })
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
          <View style={[styles.triangle, { borderBottomColor: color2 }]} />
          <Text style={styles.artistName}>{artist.artist_name}</Text>
          <TouchableOpacity
            onPress={() => this.props.onClose()}
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
            <Zocial name="soundcloud" size={22} color="orange" />
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
        </View>
        <View style={{ position: 'absolute', bottom: -20, left: -20, flex: 1 }}>
          <Footer />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: '30%',
    height: '70%',
    width: '100%'
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
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  },
  close: {
    position: 'absolute',
    top: -30,
    right: -20,
    height: 50,
    width: 40,
    justifyContent: 'center'
  },
  description: {
    fontSize: 14,
    color: 'white',
    fontWeight: '200'
  }
});
