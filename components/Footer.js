import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import * as GStyles from '../styles';
import Layout, * as layout from '../constants/Layout';
import Assets from '../constants/Assets';

export default class Footer extends React.Component {
  render() {
    return (
      <View style={styles.footerContainer}>
        {/* FIXME: */}
        <Image
          resizeMode="contain"
          source={Assets.logo}
          style={styles.footerImage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    width: Layout.window.width / 1.5,
    height: Layout.window.height / 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    overflow: 'hidden'
  },
  footerImage: {
    width: Layout.window.width / 1.5
  }
});
