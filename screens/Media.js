import React from 'react';
import {
  ScrollView,
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import MediaPopup from './MediaPopup';
import * as __GStyles from '../styles';
import Assets from '../constants/Assets';

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'pics',
      showSlider: true
    };
  }
  render() {
    return (
      <View style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <View style={styles.container}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ active: 'pics' });
              }}
              style={{ flex: 0.5 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'pics' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: this.state.active == 'pics' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {' '}
                  {this.state.active == 'pics' ? '>' : ''} Pictures
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ active: 'videos' });
              }}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'videos' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'videos' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {' '}
                  {this.state.active == 'videos' ? '>' : ''} Videos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ active: 'music' });
              }}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'music' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'music' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {' '}
                  {this.state.active == 'music' ? '>' : ''} Music
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.container} />
        <MediaPopup isVisible={this.state.showSlider}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
