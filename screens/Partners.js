import React from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View, Text, ListView, ImageBackground } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as __GStyles from '../styles';
import Accordion from 'react-native-collapsible/Accordion';
import Footer from '../components/Footer';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
export default class Partners extends React.Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  constructor(props){
    super(props);
  }
  render() {
    return (
      <ImageBackground resizeMode="repeat" source={Assets.bg1} style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView bounces={false} style={styles.container} contentContainerStyle={__GStyles.default.contentContainer}>
          <Image style={[styles.image, {height: this.props.navigation.state.params.in.height || Layout.window.height}]} resizeMode="cover" source={{uri: this.props.navigation.state.params.in.partners_image}} />
        </ScrollView>
        <Footer />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    image: {
        width: Layout.window.width,
        resizeMode: 'cover',
        backgroundColor: '#fff'
    }
});
