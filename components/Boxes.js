/**
 * The boxes component in the Home page.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableHighlight } from 'react-native';
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
            onPress={() => {
              this.props.NACController.direct('LineUp');
            }}
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
              this.props.NACController.direct('Schedule');
            }}
            underlayColor={'rgb(255,255,255)'}
            activeOpacity={0.05}
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

            onPress={() => {
              this.props.NACController.direct('Balance');
            }}
            underlayColor={'rgb(255,255,255)'}
            activeOpacity={0.05}
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
            underlayColor={'rgb(255,255,255)'}
            activeOpacity={0.05}
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
            underlayColor={'rgb(255,255,255)'}
            activeOpacity={0.05}
            style={[styles.box, { backgroundColor: 'rgb(205, 102, 93)' }]}
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
            underlayColor={'rgb(255,255,255)'}
            activeOpacity={0.05}
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
    flexDirection: 'column'
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    flex: 3,
    margin: 'auto',
    width: 100,
    justifyContent: 'center',
    marginBottom: 5
  },
  box: {
    flex: 1,
    height: Layout.window.width / 3,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center'
  },
  boxText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center'
  }
});
