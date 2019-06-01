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
  FlatList,
  Linking,
  ImageBackground,
  TouchableHighlight
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

import * as __GStyles from '../styles';
import Assets from '../constants/Assets';

export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'pics'
    };
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

  render() {
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg2}
        style={__GStyles.default.container}
      >
        {' '}
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
      </ImageBackground>
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
