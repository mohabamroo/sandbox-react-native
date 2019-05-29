import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  UIManager,
  LayoutAnimation,
  Platform,
  Image,
  FlatList
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import MediaPopup from './MediaPopup';
import Layout, * as layout from '../constants/Layout';

import * as __GStyles from '../styles';
import { MediaDB } from '../Config/DB';
import Colors from '../constants/Colors';

export default class Media extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'pics',
      showSlider: false,
      yearsExpanded: false,
      imagesYears: [],
      selectedImages: [],
      yearsColors: [Colors.pinkish, Colors.greenish, Colors.redish, Colors.rose]

    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ yearsExpanded: !this.state.yearsExpanded });
  };

  arrayToObject = array => {
    return array.reduce((obj, item) => {
      obj[item.year] = item.images;
      return obj;
    }, {});
  };

  componentDidMount() {
    MediaDB.Get()
      .then(files => {
        files = files || {};
        yearsArr = files.images.map((x, idx) => {
          return {
            label: x.year,
            backgroundColor: this.state.yearsColors[
              idx % Number(this.state.yearsColors.length)
            ]
          };
        });
        let imagesObj = this.arrayToObject(files.images);
        let activeYear = yearsArr[0].label;
        this.setState({
          images: imagesObj,
          videos: files.videos,
          music: files.music,
          imagesYears: yearsArr,
          activeYear,
          selectedImages: imagesObj[activeYear]
        });
      })
      .catch(err => {
        console.log('failed to fetch from cache', err);
      });
  }

  handleYearChange(newState) {
    this.setState({
      ...newState,
      selectedImages: this.state.images[this.state.activeYear]
    });
    this.changeLayout();
    console.log('After changing year, ', this.state.selectedImages);
  }

  _keyExtractor(item, idx) {
    return idx + '';
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

          {/* Images Tab */}
          {this.state.active == 'pics' ? (
            <View>
              <View style={styles.btnTextHolder}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.changeLayout}
                  style={styles.Btn}
                >
                  <Text style={styles.btnText}>{this.state.activeYear}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: this.state.yearsExpanded ? null : 0,
                    overflow: 'hidden'
                  }}
                >
                  {this.state.imagesYears.map((year, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[{ backgroundColor: year.backgroundColor }]}
                      onPress={() => {
                        this.handleYearChange({ activeYear: year.label });
                      }}
                    >
                      <Text style={styles.yearItem}>{year.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Images List */}
              <FlatList
                style={styles.imagesContainer}
                data={this.state.selectedImages}
                keyExtractor={this._keyExtractor}
                numColumns={2}
                columnWrapperStyle={{ margin: 2 }}
                renderItem={({ item, index }) => (
                  <Image
                    key={index}
                    source={{
                      uri: item.image,
                      width: 200,
                      height: 200
                    }}
                    style={styles.cardImg}
                  />
                )}
              />
            </View>
          ) : null}

          {/* Videos Tab */}
          {this.state.active == 'videos' ? (
            <View>
              <Text>Videos</Text>
            </View>
          ) : null}

          {/* Music Tab */}
          {this.state.active == 'music' ? (
            <View>
              <Text>Music</Text>
            </View>
          ) : null}
        </View>
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
  imagesContainer: {
    backgroundColor: Colors.greenish
  },
  cardImg: {
    flex: 1,
    width: 200,
    height: 200
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
  text: {
    fontSize: 17,
    color: 'black',
    padding: 10
  },

  btnText: {
    textAlign: 'left',
    color: Colors.yellowish,
    fontSize: 20
  },

  btnTextHolder: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  Btn: {
    padding: 10,
    backgroundColor: Colors.greenish
  },
  yearItem: {
    color: Colors.yellowish,
    paddingLeft: 15,
    fontWeight: 'bold',
    padding: 5
  }
});
