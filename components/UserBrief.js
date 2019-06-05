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
export class UserBrief extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
              uri: 'https://nacelle.nbhood.com/' + user.client_photo
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
              { borderBottomColor: '#EEB8BB' }
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
            <Text style={{ fontSize: 12, color: '#e9665d' }}>
              Your Balance is:
              <Text style={{ fontWeight: 'bold' }}> {balance}</Text> EGP
            </Text>
          </View>
        </View>
        {this.props.hasBackBtn ? (
          <View
            style={[
              styles.floatingLabel,
              { right: 20, backgroundColor: '#E9665C' }
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
                  fontSize: 12,
                  
                }}
              >
                YOUR PASS
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.floatingLabel, { right: 20 }]}>
            <TouchableOpacity
              onPress={() => {
                this.props.NACController.direct('Profile', {
                  user: this.props.user
                });
              }}
            >
              <Text
                style={{
                  color: '#FFEB5C',
                  fontWeight: 'bold',
                  fontSize: 12,
                  
                }}
              >
                YOUR PROFILE
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {this.props.hasBackBtn && (
          <View style={[styles.floatingLabel, { left: 20 }]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text
                style={[
                  {
                    color: '#FFEB5C',
                    fontWeight: 'bold',
                    fontSize: 12,
                    
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
    borderLeftColor: '#FDE9D6',
    borderRightColor: 'transparent',
    borderBottomColor: '#FDE9D6',
    borderTopColor: '#FDE9D6'
  },
  triangleDown: {
    transform: [{ rotate: '180deg' }]
  },
  nameArea: {
    marginLeft: (Layout.window.width / 6) * -1
  },
  textArea: {
    position: 'absolute',
    top: 20,
    left: Layout.window.width / 3
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#f069a7',
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    color: 'white'
  }
});
