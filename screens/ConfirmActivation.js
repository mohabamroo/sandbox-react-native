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
  ImageBackground
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import HeaderComponent from '../components/HeaderComponent';
import Footer from '../components/Footer';
const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import { NavigationController } from '../navigation/index';
import Assets from '../constants/Assets';

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

    fetch('https://nacelle.nbhood.com/api/sms/verify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: form
    }).then(res => {
      if (res.status != 200) {
        alert('wrong code');
      } else {
        this.props.navigation.navigate('DataActivation', {
          email,
          notifyParent: this.props.navigation.state.params.notifyParent
        });
      }
      this.setState({ fetching: false });
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
              <Text style={{ color: '#ffec59', fontSize: 10 }}>
                Enter code:
              </Text>
              <CodeInput
                ref="codeInputRef2"
                codeLength={4}
                secureTextEntry={false}
                keyboardType="numeric"
                activeColor="rgba(49, 180, 4, 1)"
                inactiveColor="rgba(49, 180, 4, 1.3)"
                autoFocus={false}
                ignoreCase={true}
                inputPosition="center"
                size={65}
                containerStyle={{ marginTop: 20 }}
                onFulfill={txt => this.submitCode(txt)}
                codeInputStyle={{
                  borderWidth: 1.5,
                  backgroundColor: 'white',
                  fontSize: 20
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  this.navigationController.direct('DataActivation')
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
