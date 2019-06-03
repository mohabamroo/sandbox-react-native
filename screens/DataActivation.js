import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image,
  Picker
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Footer from '../components/Footer';
const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import { AntDesign, Entypo } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal';
import Assets from '../constants/Assets';
import { Permissions, ImagePicker, CAMERA_ROLL } from 'expo';

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'pics',
      txt:
        'Text between two or more users of mobile devices, videos, and sound content, as well as ideograms known as emoji (happy faces, sad faces, and other icons).',
      years: [],
      days: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32'
      ],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      day: null,
      month: null,
      year: null,
      cca2: 'US',
      callingCode: '1',
      fetching: false,
      PermissionsReady: false,
      image: null,
      base64: null
    };
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
    console.log('icon press');
    if (this.state.PermissionsReady) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true
      });
      console.log('TCL: Media -> onPressIcon -> result', result);
      if (!result.cancelled) {
        this.setState({ image: result.uri, base64: result.base64 });
      }
    } else {
      this.getPermissionOne();
    }
  };

  componentWillMount() {
    this.getPermissionOne();
    var years = [];
    for (i = 0; i < 50; i++) {
      years.push(String(new Date().getFullYear() - i));
    }
    this.setState({ years });
  }
  sendData = () => {
    var form = new FormData();
    form.append(
      'client_date_of_birth',
      `${this.state.day}-${this.state.month}-${this.state.year}`
    );
    form.append('client_photo', 'wait');
    form.append('country', this.state.cca2);
    this.setState({ fetching: true });
    fetch('https://nacelle.nbhood.com/api/tickets/techiiestan@gmail.com/', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: form
    }).then(res => {
      if (res.status != 200) {
        alert(res._bodyInit);
      } else {
        this.props.navigation.navigate('Home');
      }
      this.setState({ fetching: false });
    });
  };
  render() {
    return (
      <View style={__GStyles.default.container}>
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
              style={{
                flex: 1,
                width: width * 0.9,
                height: height * 0.21,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffec59'
              }}
            >
              <View style={{}}>
                <Image
                  style={{ width: width * 0.4, height: height * 0.35 }}
                  source={require('../assets/images/pp.png')}
                />
                {/* FIXME: */}
                {/* {this.state.image && (
                  <Image
                    style={styles.preview}
                    source={{ uri: this.state.image }}
                  />
                )} */}
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
                height: 30,
                justifyContent: 'space-between',
                paddingHorizontal: 10
              }}
            >
              <Text style={{ color: '#fabb79' }}>country</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ModalDropdown
                  defaultValue="country"
                  style={{ flexDirection: 'row' }}
                  textStyle={{ color: '#fabb79', fontSize: 14 }}
                >
                  <CountryPicker
                    onChange={value => {
                      this.setState({
                        cca2: value.cca2,
                        callingCode: value.callingCode
                      });
                    }}
                    cca2={this.state.cca2}
                    translation="eng"
                    filterable
                    showCountryNameWithFlag={false}
                  />
                </ModalDropdown>

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
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  backgroundColor: 'white',
                  height: 30,
                  justifyContent: 'space-between',
                  paddingHorizontal: 10
                }}
              >
                <ModalDropdown
                  options={this.state.days}
                  defaultValue="Date"
                  textStyle={{ color: '#fabb79', fontSize: 14 }}
                  dropdownStyle={{ width: width * 0.25 }}
                  onSelect={txt => this.setState({ day: this.state.days[txt] })}
                />
                <AntDesign name="down" size={12} color="#fabb79" />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  backgroundColor: 'white',
                  height: 30,
                  justifyContent: 'space-between',
                  paddingHorizontal: 10
                }}
              >
                <ModalDropdown
                  options={this.state.months}
                  defaultValue="Month"
                  textStyle={{ color: '#fabb79', fontSize: 14 }}
                  dropdownStyle={{ width: width * 0.25 }}
                  onSelect={txt =>
                    this.setState({ month: this.state.months[txt] })
                  }
                />
                <AntDesign name="down" size={12} color="#fabb79" />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  backgroundColor: 'white',
                  height: 30,
                  justifyContent: 'space-between',
                  paddingHorizontal: 10
                }}
              >
                <ModalDropdown
                  options={this.state.years}
                  dropdownStyle={{ width: width * 0.25, left: width * 0.68 }}
                  defaultValue="Year"
                  textStyle={{ color: '#fabb79', fontSize: 14 }}
                  onSelect={txt =>
                    this.setState({ year: this.state.years[txt] })
                  }
                />
                <AntDesign name="down" size={12} color="#fabb79" />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.sendData}
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
              <Text style={{ color: '#ffec59' }}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
  }
});
