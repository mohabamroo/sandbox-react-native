import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import Layout from '../constants/Layout';

export default class ArtistRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { artist: row, index, color, color2 } = this.props;

    return (
      <TouchableOpacity
        style={[this.props.lastRow ? styles.footerMargin : {}]}
        onPress={() => this.props.click()}
        activeOpacity={0.95}
      >
        <View key={index} style={styles.artistRow}>
          <Image source={{ uri: row.artist_image }} style={styles.image} />
          <View
            style={[
              styles.triangle,
              styles.triangleDown,
              styles.nameArea,
              { borderBottomColor: color }
            ]}
          />
          <Text style={styles.artistName}>{row['artist_name']}</Text>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionDay}>
              {row['artist_session'] && row['artist_session']['session_stage']
                ? row['artist_session']['session_stage'].toUpperCase()
                : 'MAIN STAGE'}
            </Text>
            <Text style={styles.sessionTime}>
              {row['artist_session'] && row['artist_session']['session_day']
                ? row['artist_session']['session_day'].replace('day', 'DAY ') +
                  ', ' +
                  row['artist_session']['session_start_time'] +
                  ' - ' +
                  row['artist_session']['session_end_time']
                : ''}
            </Text>
          </View>
          <View
            style={[
              styles.triangle2,
              styles.triangleCornerBottomRight,
              styles.footerArea,
              { borderTopColor: color2 }
            ]}
          >
            <View
              style={{
                flex: 1,
                width: Layout.window.width,
                height: Layout.window.width,
                backgroundColor: 'red'
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1
  },

  artistRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: Layout.window.width / 3,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: Layout.window.width / 3,
    height: Layout.window.width / 3,
    backgroundColor: '#fde9d6'
  },
  triangle: {
    width: 0,
    height: 0,
    borderBottomWidth: Layout.window.width,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: Layout.window.width,
    borderRightWidth: Layout.window.width / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  triangleDown: {
    transform: [{ rotate: '180deg' }]
  },
  nameArea: {
    marginLeft: (Layout.window.width / 6) * -1
  },
  footerArea: {
    position: 'absolute',
    right: 0,
    zIndex: 9
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 2 * (Layout.window.width / 2.5),
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end'
  },
  triangleCornerBottomRight: {
    transform: [{ rotate: '180deg' }]
  },
  artistName: {
    position: 'absolute',
    top: 20,
    left: Layout.window.width / 3 - 20,
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#fff'
  },
  sessionInfo: {
    color: '#fff',
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 20,
    textAlign: 'right',
    zIndex: 10
  },
  sessionDay: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 14
  },
  sessionTime: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'right'
  },
  footerMargin: {
    marginBottom: Layout.window.height / 3
  }
});
