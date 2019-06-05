import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import { NavigationController } from '../navigation/index';
import Assets from '../constants/Assets';
import Footer from '../components/Footer';
const URLs = require('../Config/ExternalURL');

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fetching: false,
      active: 'pics',
      txt:
        'In order to receive your wristband at the SANDBOX gates you will need to activate your ticket. For those without app access, you will be able to activate on door.' +
        'Please enter the e-mail at which you received your SANDBOX e-pass to get your Activation Code.'
    };
    this.navigationController = new NavigationController(this.props.navigation);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  sendCode = () => {
    if (!this.validateEmail(this.state.email)) {
      Alert.alert(
        'Invalid Email',
        'You have entered an invalid email, please try again.'
      );

      return;
    }
    var form = new FormData();
    form.append('email', this.state.email);
    this.setState({ fetching: true });
    fetch(URLs.sendSMS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: form
    })
      .then(res => {
        // FIXME: code is 200 even though message was not sent
        if (res.status != 200) {
          const newMessage = res._bodyInit.replace(/\"/g, '');
          Alert.alert('Invalid Email', newMessage);
          this.setState({ fetching: false });
        } else {
          const self = this;
          this.setState({
            fetching: false
          });
          this.props.navigation.navigate('ConfirmActivation', {
            email: this.state.email.toLowerCase(),
            notifyParent: this.props.navigation.state.params.notifyParent,
            backBtnRoute: 'Home'
          });
        }
      })
      .catch(err => {
        this.setState({ fetching: false });
        Alert.alert(
          'Network failed',
          'Check your internet connection and try again please.'
        );
      });
  };

  render() {
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg1}
        style={__GStyles.default.container}
      >
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView style={styles.container}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 40
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  paddingHorizontal: 20,
                  paddingVertical: 20
                }}
              >
                {this.state.txt}
              </Text>
            </View>
            <View
              style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 35 }}
            >
              <Text style={{ color: '#ffec59', fontSize: 10, marginBottom: 5 }}>
                Enter You Email
              </Text>
              <TextInput
                onChangeText={email => this.setState({ email })}
                style={{
                  width: width * 0.9,
                  backgroundColor: 'white',
                  height: 60,
                  color: '#fabb79',
                  fontWeight: 'bold',
                  paddingLeft: 10
                }}
                placeholder="E-mail"
                placeholderTextColor="#fabb79"
              />
              <TouchableOpacity
                disabled={this.state.disabled}
                onPress={this.sendCode}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  marginVertical: 20,
                  justifyContent: 'center',
                  width: width * 0.9,
                  height: 40,
                  backgroundColor: '#189aa9'
                }}
              >
                {this.state.fetching ? (
                  <ActivityIndicator color="#ffec59" />
                ) : (
                  <Text style={{ color: '#ffec59', fontWeight: 'bold' }}>
                    {(this.state.submittedOnce ? 'RE-' : '') + 'SEND CODE'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Footer />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9665d'
  },
  backGround: {
    width: '100%',
    flex: 1
  },
  tabsContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row'
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  }
});
