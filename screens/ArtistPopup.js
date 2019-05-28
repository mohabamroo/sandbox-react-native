import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image} from 'react-native';
import Modal from 'react-native-modal';
import Layout from '../constants/Layout';


export default class ArtistPopup extends React.Component {
  render() {
    let artist = this.props.artist;
    return (
      <Modal isVisible={this.props.isVisible} >
        <View style={styles.container}>
          <Image source={{ uri: artist.artist_image }} style={styles.image} resizeMode={'cover'}/>
          <View
            style={[
              styles.triangle,
              { borderBottomColor: 'red' }
            ]}
          />
          <View
            style={[
              styles.triangle2,
              { borderTopColor: '#008691' }
            ]}
          />
          <ScrollView
            style={[
              styles.textArea,
              { backgroundColor: '#008691' }
            ]}
            contentContainerStyle={{
              padding: 10
            }}
          >
          <Text> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </ScrollView>
      </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: '30%',
    height: '70%',
    width: '100%',
    backgroundColor: '#fff'
  },
  image: {
    height: Layout.window.width * 0.9
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
    top: Layout.window.width * 0.4,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: Layout.window.width * 0.9 ,
    borderTopWidth: Layout.window.width * 0.2,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end',
    transform: [{ rotate: '180deg' }]
  },
  textArea: {
    position: 'absolute',
    top: Layout.window.width * 0.6,
    width: Layout.window.width * 0.9,
    height: Layout.window.width * 0.85
  }
});
