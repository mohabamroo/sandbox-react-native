import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import Layout from '../constants/Layout';
import Assets from '../constants/Assets';

const { height, width } = Dimensions.get('window');

export default class ArtistPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      opacity: new Animated.Value(0),
      position: new Animated.Value(Layout.window.height)
    };
  }

  componentWillMount() {
    Animated.sequence([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 450
      }),
      Animated.timing(this.state.position, {
        toValue: Layout.window.height * 0.01,
        duration: 450
      })
    ]).start();
  }

  componentDidMount() {
    const self = this;
    setTimeout(() => {
      self._carousel.snapToItem(self.props.index);
    }, 800);
  }

  onClose() {
    Animated.sequence([
      Animated.timing(this.state.position, {
        toValue: Layout.window.height,
        duration: 450
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 450
      })
    ]).start(() => {
      this.props.onClose();
    });
  }

  render() {
    let { selectedImages, isVisible, index } = this.props;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          height: Layout.window.height,
          width: Layout.window.width,
          opacity: this.state.opacity,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            position: 'absolute',
            height: Layout.window.height * 1.2,
            width: Layout.window.width,
            opacity: 0.6,
            backgroundColor: 'black'
          }}
        />
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: 'transparent', top: this.state.position }
          ]}
        >
          <Carousel
            useScrollView
            ref={c => {
              this._carousel = c;
            }}
            data={selectedImages}
            renderItem={item => {
              return (
                <View>
                  <ImageBackground
                    source={{ uri: item.item.image }}
                    resizeMode="contain"
                    style={{
                      alignSelf: 'center',
                      width: width * 0.95,
                      height: 265,
                      marginTop: 50
                    }}
                  >
                    <TouchableOpacity
                      style={styles.close}
                      onPress={() => this.onClose()}
                    >
                      <Image
                        source={Assets.close}
                        resizeMode={'contain'}
                        style={{ width: 40 }}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              );
            }}
            sliderWidth={width}
            itemWidth={width}
            slidewidth={width}
            horizontal
            layout={'default'}
            onSnapToItem={index => this.setState({ index })}
            slideStyle={{
              alignSelf: 'center'
            }}
            containerCustomStyle={{
              backgroundColor: 'transparent'
            }}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  close: {
    position: 'absolute',
    top: -50,
    right: 0,
    height: 40,
    width: 40,
    justifyContent: 'center'
  }
});
