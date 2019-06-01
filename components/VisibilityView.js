import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import * as GStyles from '../styles';
import Layout, * as layout from '../constants/Layout';
import Assets from '../constants/Assets';

export default class VisibilityView extends React.Component {
  render() {
    let { item, width, show } = this.props
    if(show){
      return (

          <View style={{width: width, height: width, position: 'absolute'}}>
            <Image
              id={item.location_type}
              source={{ uri: item.location_image }}
              style={{ width: width, height: 400, position: 'absolute' }}
              resizeMode={'contain'}
            />
          </View>

      );
    }
    return (null)

  }
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 220,
    height: Layout.window.height/4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow:'hidden'
  },
  footerImage: {
    width: 200
  }
});
