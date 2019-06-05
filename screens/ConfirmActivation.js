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
import CodeInput from 'react-native-confirmation-code-input';
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
      active: 'pics',
      txt: 'Please enter the 4 digit code you received in the space below.'
    };
    this.navigationController = new NavigationController(this.props.navigation);
  }

  submitCode = code => {
    this.setState({ fetching: true });
    var email = this.props.navigation.getParam('email');
    var form = new FormData();
    form.append('email', email);
    form.append('token', code);

    fetch(URLs.verifyCode, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: form
    }).then(res => {
      console.log('TCL: Media -> res', res);
      if (res.status != 200) {
        Alert.alert(
          'Wrong code',
          'You have entered the wrong code, please check and try again.'
        );
      } else {
        this.props.navigation.navigate('DataActivation', {
          email,
          notifyParent: this.props.navigation.state.params.notifyParent,
          backBtnRoute: 'Home'
        });
      }
      this.setState({ fetching: false });
    });
  };

  reSendCode = () => {
    var email = this.props.navigation.getParam('email');

    var form = new FormData();
    form.append('email', email);
    this.setState({ codeFetching: true });
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
          this.setState({ codeFetching: false });
        } else {
          const self = this;
          this.setState({
            fetching: false,
            disabled: true
          });
          setTimeout(() => {
            self.setState({ disabled: false });
          }, 1000 * 60);
        }
      })
      .catch(err => {
        this.setState({ codeFetching: false });
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
        <HeaderComponent
          backRoute={this.props.navigation.state.params.backBtnRoute}
          NACController={this.navigationController}
          navigation={this.props.navigation}
        />
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
              <Text style={{ color: '#ffec59', fontSize: 10 }}>
                Enter code:
              </Text>
              <CodeInput
                ref="codeInputRef2"
                codeLength={4}
                secureTextEntry={false}
                keyboardType="numeric"
                autoFocus={false}
                ignoreCase={true}
                inputPosition="center"
                size={65}
                containerStyle={{ marginTop: 20 }}
                onFulfill={txt => this.submitCode(txt)}
                codeInputStyle={{
                  backgroundColor: 'white',
                  color: '#FBBA79',
                  fontSize: 20
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  this.navigationController.direct('DataActivation', {
                    backBtnRoute: 'Home'
                  })
                }
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
                    SUBMIT YOUR CODE
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.reSendCode()}
                disabled={this.state.disabled}
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
                {this.state.codeFetching ? (
                  <ActivityIndicator color="#ffec59" />
                ) : (
                  <Text style={{ color: '#ffec59', fontWeight: 'bold' }}>
                    RE-SEND CODE
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
    flexDirection: 'row',
    backgroundColor: '#fde9d6'
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  }
});
