/**
 * The boxes component in the Home page.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Layout from '../constants/Layout';
import * as assets from '../constants/Assets';
import CountDown from 'react-native-countdown-component';
export class CountDownTimer extends React.Component {
  constructor(props) {
    super(props);
    console.log('TCL: CountDownTimer -> constructor -> props', props);
    this.state = {
      eventStartTime: this.props.startDateTime,
      duration: this.props.duration
    };
  }
  componentWillUnmount() {
    // NOTE setup flag
    this.isUnmounted = true;
  }
  render() {
    return (
      <View
        style={[
          styles.counterContainer,
          this.state.finishedCounting ? styles.hidden : {}
        ]}
      >
        <CountDown
          size={30}
          until={this.state.duration}
          onFinish={() => {
            this.props.notifyParent();
            this.setState({ finishedCounting: true });
          }}
          digitStyle={{
            backgroundColor: 'transparent'
          }}
          digitTxtStyle={{ color: '#FFEB5C', fontSize: 56 }}
          timeLabelStyle={{ color: 'white', marginTop: -85, fontSize: 12 }}
          separatorStyle={{
            color: '#FFEB5C',
            marginTop: 60,
            borderRadius: 0
          }}
          timeToShow={['D', 'H', 'M', 'S']}
          timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
          showSeparator={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  counterContainer: {
    backgroundColor: '#7bc19e',
    width: '100%',
    zIndex: 2,
    marginTop: -10,
    paddingBottom: 25
  },
  hidden: { height: 0 }
});
