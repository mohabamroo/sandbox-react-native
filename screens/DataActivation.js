import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image,
  Picker,
  ActivityIndicator,
  ImageBackground,
  Alert
} from 'react-native';
// import * as RNFS from 'react-native-fs';

import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import { AntDesign, Entypo } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal';
import { Permissions, ImagePicker, CAMERA_ROLL, Camera } from 'expo';
import { UserDB } from '../Config/DB';
import Assets from '../constants/Assets';
import Footer from '../components/Footer';
import { NavigationController } from '../navigation/index';
const URLs = require('../Config/ExternalURL');

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'pics',
      txt: 'Please complete the steps below to activate your SANDBOX pass.',
      years: [],
      days: Array(31)
        .fill()
        .map((x, i) => i + 1),
      months: {
        January: '01',
        February: '02',
        March: '03',
        April: '04',
        May: '05',
        June: '06',
        July: '07',
        August: '08',
        September: '09',
        October: '10',
        November: '11',
        December: '12'
      },
      day: null,
      selectedMonthValue: null,
      selectedMonthName: 'Month',
      yearValue: null,
      cca2: 'US',
      email: this.props.navigation.state.params.email,
      callingCode: '1',
      fetching: false,
      PermissionsReady: false,
      image: null,
      base64: null,
      countryName: 'Country'
    };
    this.navigationController = new NavigationController(this.props.navigation);
  }

  getPermissionOne = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status == 'granted') {
      this.getPermissionTwo();
    } else {
      alert('not grandted');
    }
  };

  getPermissionTwo = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status == 'granted') {
      this.setState({ PermissionsReady: true });
    } else {
      this.setState({ PermissionsReady: false });
      alert('not grandted');
    }
  };

  onPressIcon = async () => {
    if (this.state.PermissionsReady) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        base64: true,
        quality: 0.5
      });
      if (!result.cancelled) {
        let imageName = this.state.email.split('@')[0] + '-' + this.makeid(10);
        var photo = {
          uri: result.uri,
          type: 'image/jpeg',
          name: imageName + '.jpg'
        };
        this.setState({
          image: result.uri,
          base64: result.base64,
          imageObj: photo
        });
        console.log('TCL: Media -> photo', photo);
      }
    } else {
      this.getPermissionOne();
    }
  };

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  componentWillMount() {
    this.getPermissionOne();
    var years = [];
    for (i = 0; i < 50; i++) {
      years.push(String(new Date().getFullYear() - i));
    }
    this.setState({ years });
  }

  async sendData() {
    if (
      !this.state.yearValue ||
      !this.state.selectedMonthValue ||
      !this.state.dayValue ||
      !this.state.cca2 ||
      !this.state.image ||
      !this.state.email
    ) {
      const newMessage = 'Please fill in the missing information.';
      Alert.alert('Missing Information', newMessage);
      this.props.navigation.state.params.notifyParent();
      return;
    }
    var form = new FormData();
    form.append(
      'client_date_of_birth',
      `${this.state.yearValue}-${this.state.selectedMonthValue}-${
        this.state.dayValue
      }`
    );

    form.append('client_photo', this.state.imageObj);
    form.append('country', this.state.cca2);
    form.append('code', URLs.activationSecret);

    this.setState({ fetching: true });
    fetch(`${URLs.registerAccount}/${this.state.email}/`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: form
    })
      .then(res => {
        if (res.status != 200) {
          const newMessage = res._bodyInit.replace(/\"/g, '');
          Alert.alert('Invalid data', newMessage);
        } else {
          res.json().then(jsonData => {
            UserDB.Set(jsonData).then(cache => {
              console.log('set user in cache');
              this.props.navigation.state.params.notifyParent();
              this.props.navigation.navigate('Home');
            });
          });
        }
        this.setState({ fetching: false });
      })
      .catch(err => {
        this.setState({ fetching: false });
        Alert.alert(
          'Network failed',
          'Check your internet connection and try again please.'
        );
      });
  }

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
              alignItems: 'center'
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
                  fontSize: 12,
                  color: 'white',
                  paddingHorizontal: 20,
                  paddingVertical: 20
                }}
              >
                {this.state.txt}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.onPressIcon()}
              style={[
                {
                  flex: 1,
                  width: width * 0.9,
                  height: height * 0.35,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffec59'
                },
                this.state.image ? { backgroundColor: 'transparent' } : {}
              ]}
            >
              <View style={{}}>
                {!this.state.image && (
                  <Image
                    style={{ width: width * 0.4, height: height * 0.35 }}
                    source={require('../assets/images/pp.png')}
                  />
                )}
                {this.state.image && (
                  <Image
                    source={{ uri: this.state.image }}
                    style={{ width: width * 0.8, height: height * 0.35 }}
                  />
                )}
              </View>
              <View style={{ position: 'absolute', bottom: 10 }}>
                <Text style={{ fontSize: 10, color: '#837563' }}>
                  Tap anywhere to launch the camera
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ color: '#ffec59', fontSize: 10, marginVertical: 5 }}>
              Enter your country
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 35,
                justifyContent: 'space-between',
                paddingHorizontal: 10
              }}
            >
              <Text style={{ color: '#fabb79' }}>{this.state.countryName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                  onChange={value => {
                    this.setState({
                      countryName: value.name,
                      cca2: value.cca2,
                      callingCode: value.callingCode
                    });
                  }}
                  cca2={this.state.cca2}
                  translation="eng"
                  filterable
                  showCountryNameWithFlag={false}
                />

                <AntDesign
                  name="down"
                  size={15}
                  color="#fabb79"
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            <Text style={{ color: '#ffec59', fontSize: 10, marginVertical: 5 }}>
              Enter your Date of Birth
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ModalDropdown
                style={styles.dropdownInput}
                options={this.state.days}
                defaultValue="Date"
                dropdownStyle={{ width: width * 0.25 }}
                onSelect={txt =>
                  this.setState({ dayValue: this.state.days[txt] })
                }
              >
                <View style={styles.inputLabel}>
                  <Text style={styles.labelText}>
                    {this.state.dayValue ? this.state.dayValue : 'Date'}
                  </Text>
                  <AntDesign
                    style={styles.labelArrow}
                    name="down"
                    size={12}
                    color="#fabb79"
                  />
                </View>
              </ModalDropdown>

              <ModalDropdown
                style={styles.dropdownInput}
                options={Object.keys(this.state.months)}
                defaultValue="Month"
                textStyle={{ color: '#fabb79', fontSize: 14 }}
                dropdownStyle={{ width: width * 0.25 }}
                onSelect={txt => {
                  let monthName = Object.keys(this.state.months)[txt];
                  this.setState({
                    selectedMonthValue: this.state.months[monthName],
                    selectedMonthName: monthName
                  });
                }}
              >
                <View style={styles.inputLabel}>
                  <Text style={styles.labelText}>
                    {this.state.selectedMonthName
                      ? this.state.selectedMonthName
                      : 'Month'}
                  </Text>
                  <AntDesign
                    style={styles.labelArrow}
                    name="down"
                    size={12}
                    color="#fabb79"
                  />
                </View>
              </ModalDropdown>

              <ModalDropdown
                style={[styles.dropdownInput, { marginRight: 0 }]}
                options={this.state.years}
                dropdownStyle={{ width: width * 0.25, left: width * 0.68 }}
                defaultValue="Year"
                textStyle={{ color: '#fabb79', fontSize: 14 }}
                onSelect={txt =>
                  this.setState({ yearValue: this.state.years[txt] })
                }
              >
                <View style={styles.inputLabel}>
                  <Text style={styles.labelText}>
                    {this.state.yearValue ? this.state.yearValue : 'Year'}
                  </Text>
                  <AntDesign
                    style={styles.labelArrow}
                    name="down"
                    size={12}
                    color="#fabb79"
                  />
                </View>
              </ModalDropdown>
            </View>
            <TouchableOpacity
              onPress={() => this.sendData()}
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
                  SUBMIT
                </Text>
              )}
            </TouchableOpacity>
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
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  dropdownInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 35,
    marginRight: 10
  },
  inputLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  labelText: {
    width: '90%',
    color: '#fabb79',
    fontSize: 14
  },
  labelArrow: {}
});
