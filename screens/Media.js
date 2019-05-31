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
  ScrollView
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import MediaPopup from './MediaPopup';
import Layout, * as layout from '../constants/Layout';
import Footer from '../components/Footer';
import * as __GStyles from '../styles';
import { MediaDB } from '../Config/DB';
import Colors from '../constants/Colors';
import Assets, * as assets from '../constants/Assets';
import Accordion from 'react-native-collapsible/Accordion';

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
    MediaDB.Get()
      .then(files => {
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
      })
      .catch(err => {
        console.log('failed to fetch from cache', err);
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
        style={[
          styles.imagesContainer,
          sectionIndex == this.state.imagesArr.length - 1
            ? styles.footerMargin
            : {}
        ]}
        data={section.images}
        keyExtractor={this._keyExtractor}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity
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
          </TouchableOpacity>
        )}
      />
    );
  }
  _onChange(activeSection) {
    this.setState({ activeSection });
  }

  renderVideoRow(item, index, type = 'video') {
    let backgroundColor = this.state[type + 'sColors'][
      index % Number(this.state[type + 'sColors'].length)
    ];

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.videoRow,
          index == this.state[type + 's'].length - 1 ? styles.footerMargin : {}
        ]}
        onPress={() => Linking.openURL(item[type + '_url'])}
      >
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
      </TouchableOpacity>
    );
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
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
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
            <ScrollView>
              <Accordion
                activeSections={this.state.activeSection}
                sections={this.state.imagesArr}
                renderSectionTitle={this._renderSectionTitle.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                renderContent={this._renderContent.bind(this)}
                onChange={this._onChange.bind(this)}
              />
              {/* <View style={styles.btnTextHolder}>
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
              </View> */}
            </ScrollView>
          ) : null}

          {/* Videos Tab */}
          {this.state.active == 'videos' ? (
            <ImageBackground
              resizeMode="repeat"
              source={Assets.bg5}
              style={{ width: '100%' }}
            >
              <FlatList
                style={styles.videosContainer}
                data={this.state.videos}
                keyExtractor={this._keyExtractor}
                renderItem={({ item, index }) =>
                  this.renderVideoRow(item, index, 'video')
                }
              />
            </ImageBackground>
          ) : null}

          {/* Music Tab */}
          {this.state.active == 'music' ? (
            <ImageBackground
              resizeMode="repeat"
              source={Assets.bg5}
              style={{ width: '100%' }}
            >
              <FlatList
                style={styles.videosContainer}
                data={this.state.musics}
                keyExtractor={this._keyExtractor}
                renderItem={({ item, index }) =>
                  this.renderVideoRow(item, index, 'music')
                }
              />
            </ImageBackground>
          ) : null}
        </View>

        <MediaPopup
          isVisible={this.state.showSlider}
          index={this.state.index}
          selectedImages={this.state.selectedImages}
          onClose={() => this.setState({ showSlider: false })}
        />

        <Footer />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greenish,
    alignItems: 'center'
  },
  imagesContainer: {
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
    justifyContent: 'space-evenly',
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
  videosContainer: { color: 'red' },
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
