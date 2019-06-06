/**
 * The boxes component in the Home page.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image
} from 'react-native';
import Layout from '../constants/Layout';
import * as assets from '../constants/Assets';

export class Boxes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <TouchableHighlight
            activeOpacity={0.6}
            onPress={() => {
              this.props.NACController.direct('LineUp', {
                user: this.props.user,
                loggedIn: this.props.loggedIn
              });
            }}
            underlayColor={'#f7e25b'}
            style={[styles.box, { backgroundColor: '#f7e25b' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['lineupIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>LINE UP</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.NACController.direct('Schedule', {
                user: this.props.user,
                loggedIn: this.props.loggedIn
              });
            }}
            underlayColor={'#61A485'}
            activeOpacity={0.6}
            style={[styles.box, { backgroundColor: '#61A485' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['scheduleIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>SCHEDULE</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!this.props.loggedIn}
            onPress={() => {
              if (this.props.loggedIn)
                this.props.NACController.direct('Balance', {
                  user: this.props.user
                });
            }}
            underlayColor={'#f9bb79'}
            activeOpacity={0.6}
            style={[styles.box, { backgroundColor: '#f9bb79' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['balanceIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>BALANCE</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.subContainer}>
          <TouchableHighlight
            onPress={() => {
              this.props.NACController.direct('Media');
            }}
            underlayColor={'#ef69a7'}
            activeOpacity={0.6}
            style={[styles.box, { backgroundColor: '#ef69a7' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['mediaIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>MEDIA</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.NACController.direct('Discover');
            }}
            underlayColor={'#cd665d'}
            activeOpacity={0.6}
            style={[styles.box, { backgroundColor: '#cd665d' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['discoverIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>DISCOVER</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.NACController.direct('Info');
            }}
            underlayColor={'#7ac19d'}
            activeOpacity={0.6}
            style={[styles.box, { backgroundColor: '#7ac19d' }]}
          >
            <View style={styles.boxBtn}>
              <Image
                source={assets.default['infoIco']}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>INFO</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ccc'
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    flex: 2,
    margin: 'auto',
    width: 90,
    justifyContent: 'center'
  },
  box: {
    flex: 1,
    height: Layout.window.width / 3,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    paddingTop: 35
  },
  boxBtn: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto'
  },
  boxText: {
    fontSize: 11,
    marginTop: 6,
    flex: 1,
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center'
  }
});
