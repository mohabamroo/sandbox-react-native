import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image
} from 'react-native';

import * as GStyles from '../styles';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
import { BalanceDB } from '../Config/DB';
const URLs = require('../Config/ExternalURL');

export class UserBrief extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: this.props.user, qrCode: this.props.user.qr_serial };
  }

  async componentDidMount() {
    console.log("Mounted user brief")
    let balanceObj = await BalanceDB.Get();

    this.setState({ balanceObj });
    this.timer = setInterval(()=> this._onRefresh(), 1000 * 60 * 5);
    // this.pollBalance();
  }



  componentWillUnmount() {
    console.log("unmounting user brief");
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  _onRefresh() {
    let qrCode = this.state.qrCode;
    console.log("TCL: UserBrief -> _onRefresh -> qrCode", qrCode)
    this.setState({ refreshing: true });
    fetch(URLs.getBalance(qrCode))
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(apiResponse => {
        this.setState({ balanceObj: apiResponse, refreshing: false });
        BalanceDB.Set(apiResponse);
        console.log('updated balance');
      })
      .catch(err => {
        // FIXME: what to do on internet corruption
        this.setState({ refreshing: false });
        console.log('TCL: Balance Screen -> componentDidMount -> err', err);
      });
  }

  render() {
    const { user, balance } = this.props;
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.userPattern}
        style={styles.profileBG}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            height: 100,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#FDE9D6'
          }}
        >
          <Image
            source={{
              uri: URLs.imagesRoot + user.client_photo
            }}
            style={{
              width: Layout.window.width / 3,
              height: '100%',
              backgroundColor: '#EEB8BB'
            }}
          />
          <View
            style={[
              styles.triangle,
              styles.triangleDown,
              styles.nameArea,
              { borderBottomColor: '#FDE9D6' }
            ]}
          />
          <View style={styles.textArea}>
            <Text
              style={{
                fontSize: 16,
                color: '#f069a7',
                fontWeight: 'bold'
              }}
            >
              {user.client_name}
            </Text>
            <View
              style={{
                marginLeft: 5,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Text style={{ fontSize: 12, color: '#e9665d' }}>
                Your Balance is:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#e9665d',
                  fontWeight: 'bold',
                  paddingLeft: 5
                }}
              >
                {this.state.balanceObj ? Math.floor((this.state.balanceObj.user.balance)/100) : 0}
                EGP
              </Text>
            </View>
          </View>
        </View>
        {this.props.hasBackBtn ? (
          <View
            style={[
              GStyles.default.backButton,
              styles.floatingLabel,
              { right: 10, left: null, backgroundColor: '#E9665C' }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.NACController.direct('QRCode', {
                  user: this.props.user
                });
              }}
            >
              <Text
                style={{
                  color: '#FFEB5C',
                  fontWeight: 'bold',
                  fontSize: 12
                }}
              >
                YOUR PASS
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              GStyles.default.backButton,
              ,
              styles.floatingLabel,
              { right: 10, left: null }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.NACController.direct('Profile', {
                  user: this.props.user,
                  notifyOnBack: this.props.notifyOnBack
                });
              }}
            >
              <Text
                style={{
                  color: '#FFEB5C',
                  fontWeight: 'bold',
                  fontSize: 12
                }}
              >
                YOUR PROFILE
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {this.props.hasBackBtn && (
          <View style={[GStyles.default.backButton, styles.floatingLabel]}>
            <TouchableOpacity
              onPress={() => {
                console.log("TCL: UserBrief -> render -> this.props", this.props.notifyOnBack)
                if(this.props.notifyOnBack) {
                  this.props.notifyOnBack();
                }
                this.props.navigation.goBack();
              }}
            >
              <Text
                style={[
                  {
                    color: '#FFEB5C',
                    fontWeight: 'bold',
                    fontSize: 12
                  }
                ]}
              >
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  profileBG: {
    width: '100%',
    height: 100,
    zIndex: 3,
    justifyContent: 'center',
    backgroundColor: '#EEB8BB'
    // width: '100%',
    // borderTopWidth: 100,
    // borderTopColor: 'red',
    // borderLeftWidth: 0,
    // borderLeftColor: 'transparent',
    // borderRightWidth: 80,
    // borderRightColor: 'transparent',
    // borderStyle: 'solid'
  },
  triangle: {
    width: 0,
    height: 0,
    borderBottomWidth: Layout.window.width,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: Layout.window.width,
    borderRightWidth: Layout.window.width / 2,
    borderRightColor: 'transparent'
  },
  triangleDown: {
    transform: [{ rotate: '180deg' }]
  },
  nameArea: {
    marginLeft: (Layout.window.width / 6) * -1
  },
  textArea: {
    position: 'absolute',
    top: 30,
    left: Layout.window.width / 3 - 25
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#f069a7',
    padding: 5,
    color: 'white'
  }
});
