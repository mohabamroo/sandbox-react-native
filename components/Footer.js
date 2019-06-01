import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import * as GStyles from '../styles';
import Layout, * as layout from '../constants/Layout';
import Assets from '../constants/Assets';

export default class Footer extends React.Component {
  render() {
    return (
      <View style={styles.footerContainer}>
        <Image
          resizeMode="stretch"
          source={Assets.logo}
          style={styles.footerImage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 220,
    height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  footerImage: {
    width: 220,
    height: '100%'
  }
});
