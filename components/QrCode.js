import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import * as __GStyles from '../styles';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
const URLs = require('../Config/ExternalURL');

export class QrCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user
    };
  }
  render() {
    const { user, balance } = this.state;
    return (
      <View style={styles.container}>
        {/* <View>
          <Image source={Assets.logoOnly} resizeMode="contain" style={{  height: 100 }} />
        </View> */}
        <View>
          <Image
            source={{
              uri: URLs.imagesRoot + user.qrcode
            }}
            style={{
              width: Layout.window.width < 350? Layout.window.width : 350,
              height: Layout.window.width < 350? Layout.window.width : 350,
              backgroundColor: '#fde9d6'
            }}
          />
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.nameText}>{user.client_name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log('closing');
            this.props.navigation.goBack();
          }}
          style={[styles.labelWrapper, { marginTop: 30 }]}
        >
          <Image
            source={Assets.QRclose}
            style={{
              width: 20,
              height: 20,
              padding: 10,
              backgroundColor: '#fde9d6'
            }}
          />
          <Text style={[styles.nameText, { fontSize: 12, marginTop: 10 }]}>
            TAP HERE TO CLOSE
          </Text>
        </TouchableOpacity>
        <View style={{height: Layout.window.height / 4}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 70,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  labelWrapper: {
    marginTop: 15,
    alignItems: 'center',
    textAlign: 'center'
  }
});
