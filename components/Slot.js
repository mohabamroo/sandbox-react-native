import React from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	TouchableHighlight,
	Alert,
	ActivityIndicator,
  ImageBackground
} from 'react-native';
import moment from 'moment';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';
import { FavoritesDB } from '../Config/DB';
import LikeButton from './LikeButton';
import Layout from '../constants/Layout';
import Assets from '../constants/Assets';
const URLs = require('../Config/ExternalURL');

export default class Slot extends React.Component {

	render() {
		let {width, color, item, user_id, loggedIn, artists, empty} = this.props;
    if(empty){
      return <View style={{ width, height: 150 }} />
    } else 
		return (
      <TouchableHighlight
        onPress={() => this.props.onPress()}
      >
        <View
          style={{
            flexDirection: 'row',
            width: width,
            height: 150,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: color
          }}
        >
          <View style={{ width: width - 150 }} />

          <ImageBackground
            source={{ uri: item.artistImage }}
            style={{
              width: 150,
              height: 150,
              backgroundColor: '#fff'
            }}
          >
            {this.props.loggedIn && (
              <LikeButton
                style={{
                  width: 25,
                  height: 25,
                  position: 'absolute',
                  top: 5,
                  right: 10,
                  zIndex: 3
                }}
                size={14}
                liked={artists.length > 0 && artists.filter(x => x.artist_id == item.artistId)[0]['liked']}
                loggedIn={loggedIn}
                user_id={user_id}
                artist_id={item.artistId}
                notifyParent={() => this.props.notifyParent()}
              />
            )}
          </ImageBackground>

          <View
            style={[
              styles.triangle,
              styles.triangleDown,
              styles.nameArea,
              { borderBottomColor: color, position: 'absolute', right: 75 }
            ]}
          />
          <View style={styles.textArea}>
            <Text style={styles.name}>{item.artistName}</Text>
          </View>
        </View>
      </TouchableHighlight>
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
		borderBottomWidth: Layout.window.width,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: Layout.window.width / 2,
		borderRightWidth: Layout.window.width / 4,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent'
	},
	triangleDown: {
		transform: [{ rotate: '180deg' }]
	},
	nameArea: {
		marginLeft: (Layout.window.width / 6) * -1
	},
	textArea: {
		position: 'absolute',
		top: Layout.window.height * 0.025,
		right: 120
	},
	name: {
		fontSize: 18,
		fontWeight: 'bold',
		width: Layout.window.width / 3,
		color: 'white',
		width: 110,
		textAlign: 'right'
	},
	tabsContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#ffec59',
		height: 35
	},
	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 35
	}
});
