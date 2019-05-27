import React from 'react';
import { ScrollView, Image, ListView, StyleSheet, TouchableOpacity, View, Text, ImageBackground } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

import * as __GStyles from '../styles';
import { ArtistsDB } from '../Config/DB';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';


export default class LinksScreen extends React.Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  constructor(props){
    super(props);
    this.state = {
      active: 'all',
      colors: ['#fabb79', '#008691', '#e9665d', '#60a484'],
      colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
      artists: this.ds.cloneWithRows([])
    }
  }
  async componentDidMount(){
    let artists = await ArtistsDB.Get();
    this.setState({
      artists: this.ds.cloneWithRows(artists)
    })
    
  }
  renderArtist(row, L, index){
    let color = this.state.colors[index % Number(this.state.colors.length)]
    let color2 = this.state.colors2[index % Number(this.state.colors2.length)]
    return (
      <View key={index} style={styles.artistRow}>
        <Image source={{uri: row.artist_image}} style={styles.image}/>
        <View style={[styles.triangle,styles.triangleDown, styles.nameArea, {borderBottomColor: color}]} />
        <Text style={styles.artistName}>{row["artist_name"]}</Text>
        {/**<Image source={Assets.artist1} style={styles.artistsRowImage} /> */}
        <View style={[styles.triangle2, styles.triangleCornerBottomRight,styles.footerArea, {borderTopColor: color2}]}>
          <View style={{flex: 1, width: Layout.window.width, height: Layout.window.width, backgroundColor: 'red'}}></View>
        </View>
      </View>
    )
  }
  section(){
    return ;
  }
  render() {
    return (
      <ImageBackground source={Assets.bg4} resizeMode="repeat" style={styles.backGround}>
        <HeaderComponent navigation={this.props.navigation} />
          {/* Go ahead and delete ExpoLinksView and replace it with your
            * content, we just wanted to provide you with some helpful links */}
          <View style={styles.container}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity onPress={()=>{this.setState({active: "all"})}} style={{flex: 0.5}}><View style={[styles.tab, { backgroundColor: this.state.active == 'all' ? '#ffec59' : 'transparent'}]}><Text style={[{fontWeight: 'bold', fontSize: 12, color: this.state.active == 'all' ? '#f3996e' : '#eeb8bc'}]}> {this.state.active == 'all' ? ">" : ""} All</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.setState({active: "main"})}} style={{flex: 1,}}><View style={[styles.tab, {backgroundColor: this.state.active == 'main' ? '#ffec59' : 'transparent'}]}><Text style={[{fontWeight: 'bold', fontSize: 12, color: this.state.active == 'main' ? '#f3996e' : '#eeb8bc'}]} > {this.state.active == 'main' ? ">" : ""} Main Stage</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.setState({active: "sandbox"})}} style={{flex: 1,}}><View style={[styles.tab, {backgroundColor: this.state.active == 'sandbox' ? '#ffec59' : 'transparent' }]}><Text style={[{fontWeight: 'bold', fontSize: 12, color: this.state.active == 'sandbox' ? '#f3996e' : '#eeb8bc'}]} > {this.state.active == 'sandbox' ? ">" : ""} Sandbox Stage</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.setState({active: "morning"})}} style={{flex: 1}}><View style={[styles.tab, {backgroundColor: this.state.active == 'morning' ? '#ffec59' : 'transparent' }]}><Text style={[{fontWeight: 'bold', fontSize: 12, color: this.state.active == 'morning' ? '#f3996e' : '#eeb8bc'}]} > {this.state.active == 'morning' ? ">" : ""} Morning Stage</Text></View></TouchableOpacity>
          </View>
          <ScrollView bounces={false} style={{flex: 1}}>
            <ListView 
              bounces={false}
              dataSource={this.state.artists}
              renderRow={this.renderArtist.bind(this)}
              enableEmptySections={this.section}
            />
          </ScrollView>
          </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabsContainer: {
    
    justifyContent: "space-between",
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fde9d6',
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  artistRow: {
    flex: 1,
    flexDirection: "row",
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
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: Layout.window.width,
    borderRightWidth: Layout.window.width / 2,
    borderBottomWidth: Layout.window.width,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleDown: {
    transform: [
      {rotate: '180deg'}
    ]
  },
  nameArea: {
    marginLeft: (Layout.window.width / 6) * -1
  },
  footerArea: {
    position: 'absolute',
    right: 0,
    zIndex: 9,
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 2 * (Layout.window.width / 2.5),
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end',
  },
  triangleCornerBottomRight: {
    transform: [
      {rotate: '180deg'}
    ]
  },
  artistName: {
    position: 'absolute',
    top: 20,
    left:( Layout.window.width / 3) - 20,
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#fff'
  }
});