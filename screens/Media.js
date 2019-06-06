import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  UIManager,
  LayoutAnimation,
  Platform,
  Image,
  FlatList,
  Linking,
  ImageBackground,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import MediaPopup from './MediaPopup';
import Layout, * as layout from '../constants/Layout';
import * as __GStyles from '../styles';
import { MediaDB } from '../Config/DB';
import Colors from '../constants/Colors';
import Assets, * as assets from '../constants/Assets';
const URLs = require('../Config/ExternalURL');

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    let colors = [
      '#7bc19e',
      '#60a484',
      '#189aa9',
      '#ffec59',
      '#fabb79',
      '#e9665d',
      '#f8b7bb',
      '#f069a7',
      '#fde9d6'
    ];
    this.state = {
      active: 'pics',
      images: {},
      videos: [],
      musics: [],
      imagesArr: [],
      showSlider: false,
      index: 0,
      yearsExpanded: false,
      imagesYears: [],
      selectedImages: [],
      yearsColors: [
        Colors.pinkish,
        Colors.greenish,
        Colors.redish,
        Colors.rose
      ],
      videosColors: this.shuffle(colors),
      musicsColors: this.shuffle(colors),
      activeSection: []
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.openSwiper = this.openSwiper.bind(this);
    this.renderAccordion = this.renderAccordion.bind(this);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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
    this.fetchMediaCache();
    this.refreshMedia();
  }

  fetchMediaCache() {
    MediaDB.Get()
      .then(files => {
        this.setMediaContent(files);
      })
      .catch(err => {
        console.log('failed to fetch from cache', err);
      });
  }

  setMediaContent(files) {
    files = files || {};
    files.images = files.images.map((x, idx) => {
      return {
        ...x,
        backgroundColor: this.state.yearsColors[
          idx % Number(this.state.yearsColors.length)
        ]
      };
    });
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
      imagesArr: files.images,
      videos: files.videos,
      musics: files.musics,
      imagesYears: yearsArr,
      activeYear,
      selectedImages: imagesObj[activeYear]
    });
  }

  refreshMedia() {
    fetch(URLs.Media)
      .then(response => {
        return response.json();
      })
      .then(apiResponse => {
        if (apiResponse.status == 200) {
          console.log('Refreshed media');
          this.setMediaContent(apiResponse.data);
          MediaDB.Set(apiResponse.data);
        } else {
          console.log('media not refreshed');
        }
      })
      .catch(err => {
        // FIXME: what to do on internet corruption
        console.log('TCL: MEdia Screen -> componentDidMount -> err', err);
      });
  }

  handleYearChange(newState) {
    this.setState({
      ...newState,
      selectedImages: this.state.images[newState.activeYear]
    });
    this.changeLayout();
  }

  _keyExtractor(item, idx) {
    return idx + '';
  }

  openSwiper(index, sectionIdx) {
    this.setState({
      selectedImages: this.state.imagesArr[sectionIdx].images,
      showSlider: true,
      index
    });
  }

  _renderSectionTitle(content, index) {
    return <View />;
  }

  _renderHeader(section, index) {
    return (
      <View
        style={[
          styles.accordionHeader,
          { backgroundColor: section.backgroundColor }
        ]}
      >
        <Text style={styles.yearItem}>{section.year}</Text>
      </View>
    );
  }

  _renderContent(section, sectionIndex) {
    return (
      <FlatList
        style={[styles.imagesContainer]}
        data={section.images}
        removeClippedSubviews={true}
        keyExtractor={this._keyExtractor}
        numColumns={2}
        renderItem={(item, index) => (
          <TouchableHighlight
            onPress={() => this.openSwiper(index, sectionIndex)}
          >
            <Image
              key={index}
              source={{
                uri: item.image,
                width: 200,
                height: 200
              }}
              style={styles.cardImg}
              resizeMode="cover"
            />
          </TouchableHighlight>
        )}
      />
    );
  }

  _onChange(activeSection) {
    console.log('TCL: Media -> _onChange -> activeSection', activeSection);
    if (this.state.activeSection == activeSection) {
      activeSection = null;
    }
    this.setState({ activeSection });
  }

  renderVideoRow(item, index, type = 'video') {
    let backgroundColor = this.state[type + 'sColors'][
      index % Number(this.state[type + 'sColors'].length)
    ];

    return (
      <TouchableHighlight
        key={index}
        style={[
          styles.videoRow,
          index == this.state[type + 's'].length - 1 ? styles.footerMargin : {}
        ]}
        onPress={() => Linking.openURL(item[type + '_url'])}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.previewPic}>
            <Image
              resizeMode="cover"
              source={{
                uri: item[type + '_image'],
                width: 150,
                height: 100
              }}
              style={styles.videoImg}
            />
            <Image source={assets.default['playIco']} style={styles.playIco} />
          </View>
          <Text style={styles.videoTitle}>{item[type + '_title']}</Text>
          <View
            style={[styles.videoInfo, { borderBottomColor: backgroundColor }]}
          />
        </View>
      </TouchableHighlight>
    );
  }

  renderAccordion() {
    returnable = [];
    this.state.imagesArr.forEach((section, sectionIndex) => {
      returnable.push(
        <View key={sectionIndex} style={{ width: '100%' }}>
          <TouchableHighlight
            style={[
              styles.accordionHeader,
              { backgroundColor: section.backgroundColor }
            ]}
            onPress={() => {
              this._onChange(sectionIndex);
            }}
            underlayColor={section.backgroundColor}
            activeOpacity={0.1}
          >
            <Text style={styles.yearItem}>{section.year}</Text>
          </TouchableHighlight>
          {this.state.activeSection == sectionIndex && (
            <FlatList
              style={[styles.imagesContainer]}
              data={section.images}
              keyExtractor={this._keyExtractor}
              numColumns={2}
              renderItem={({ item, index }) => (
                <TouchableHighlight
                  onPress={() => {
                    this.openSwiper(index, sectionIndex);
                  }}
                >
                  <Image
                    key={index}
                    source={{
                      uri: item.image,
                      width: 200,
                      height: 200
                    }}
                    style={styles.cardImg}
                    resizeMode="cover"
                  />
                </TouchableHighlight>
              )}
            />
          )}
        </View>
      );
    });
    return returnable;
  }

  render() {
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg2}
        style={__GStyles.default.container}
      >
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
                      this.state.active == 'pics' ? '#e9665d' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: this.state.active == 'pics' ? '#ffec59' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'pics' ? '>' : ''} Pictures
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ active: 'videos' });
              }}
              style={{ flex: 0.5 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'videos' ? '#e9665d' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'videos' ? '#ffec59' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'videos' ? '>' : ''} Videos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ active: 'music' });
              }}
              style={{ flex: 0.5 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'music' ? '#e9665d' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'music' ? '#ffec59' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'music' ? '>' : ''} Music
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Images Tab */}
          {this.state.active == 'pics' ? (
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 200, width: '100%' }}
            >
              {this.renderAccordion()}
            </ScrollView>
          ) : null}

          {/* Videos Tab */}
          {this.state.active == 'videos' ? (
            <View
              style={{ width: '100%', flex: 1, backgroundColor: 'transparent' }}
            >
              <FlatList
                style={styles.videosContainer}
                data={this.state.videos}
                keyExtractor={this._keyExtractor}
                renderItem={({ item, index }) =>
                  this.renderVideoRow(item, index, 'video')
                }
              />
            </View>
          ) : null}

          {/* Music Tab */}
          {this.state.active == 'music' ? (
            <View
              style={{ width: '100%', flex: 1, backgroundColor: 'transparent' }}
            >
              <FlatList
                style={styles.videosContainer}
                data={this.state.musics}
                keyExtractor={this._keyExtractor}
                renderItem={({ item, index }) =>
                  this.renderVideoRow(item, index, 'music')
                }
              />
            </View>
          ) : null}
        </View>
        {this.state.showSlider && (
          <MediaPopup
            isVisible={this.state.showSlider}
            index={this.state.index}
            selectedImages={this.state.selectedImages}
            onClose={() => this.setState({ showSlider: false })}
          />
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  imagesContainer: {
    width: Layout.window.width,
    backgroundColor: 'transparent'
  },
  cardImg: {
    flex: 1,
    width: Layout.window.width / 2
  },
  backGround: {
    width: '100%',
    flex: 1
  },
  tabsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fde9d6'
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15
  },
  text: {
    fontSize: 17,
    color: 'black',
    padding: 10
  },

  btnText: {
    textAlign: 'left',
    color: Colors.yellowish,
    fontSize: 20,
    fontWeight: 'bold'
  },

  btnTextHolder: {
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.5)',
    marginBottom: 5,
    marginTop: 5
  },
  Btn: {
    padding: 10,
    backgroundColor: Colors.greenish
  },
  yearItem: {
    color: Colors.yellowish,
    paddingLeft: 15,
    fontWeight: 'bold',
    fontSize: 15,
    padding: 5
  },
  videoTitle: {
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    top: '35%',
    marginLeft: Layout.window.width / 2.5,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    width: (Layout.window.width * 3) / 5,
    zIndex: 10
  },
  videosContainer: { backgroundColor: 'transparent' },
  videoImg: {
    height: '100%',
    width: Layout.window.width / 2.5
  },
  paddingDiv: {
    height: Layout.window.height / 4
  },
  footerMargin: {
    marginBottom: Layout.window.height / 3
  },
  previewPic: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  },
  playIco: {
    position: 'absolute',
    height: 30,
    width: 30,
    top: '35%',
    flex: 1,
    alignItems: 'center',
    bottom: 0,
    right: 0,
    left: 40
  },
  videoRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: Layout.window.width / 3,
    overflow: 'hidden',
    position: 'relative'
  },
  videoInfo: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: Layout.window.width * 0.75,
    borderBottomWidth: Layout.window.width * 2.1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }]
  },
  accordionHeader: {
    padding: 7
  }
});
