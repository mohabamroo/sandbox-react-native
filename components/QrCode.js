import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';

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
              uri: 'https://nacelle.nbhood.com/' + user.qrcode
            }}
            style={{
              width: 300,
              height: 300,
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

              backgroundColor: '#fde9d6'
            }}
          />
          <Text style={[styles.nameText, { fontSize: 12, marginTop: 10 }]}>
            TAP HERE TO CLOSE
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
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
