import React from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View, Text, ListView, ImageBackground } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

import * as __GStyles from '../styles';

import {InfoDB} from '../Config/DB/index';
import {NavigationController} from '../navigation/index';
import Assets from '../constants/Assets';
import Footer from '../components/Footer';
export default class Info extends React.Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  constructor(props){
    super(props);
    this.navigationController = new NavigationController(this.props.navigation);
    this.state = {
      infoMainSections: this.ds.cloneWithRows([]),
      rowsColors: ['#008691', '#f8b7bb', '#60a484', '#fabb79', '#e9665d', '#ffec59'],
      mapNaming: {
        "rules": "Festival rules",
        "bus_routes" : "SHUTTLE BUSES & ROUTES",
        "faqs": "FAQs",
        "policies" : "policies",
        "safety" : "Safety & medical info",
        "partners" : "partners, Sponsors & credit"
      }
    }
  }
  async componentDidMount(){
    // loading the information page content
    let info = await InfoDB.Get();
    let infoMainSections = new Array();
    for(let i in info){
      infoMainSections.push(i);
    }
    this.setState({infoMainSections: this.ds.cloneWithRows(infoMainSections), wholeInfo: info});
  }
  renderRowNews(row, L, index){
    return (
      <TouchableOpacity activeOpacity={0.95} onPress={() => {this.checkInfoAndGo(row)}}>
        <View style={[styles.row, {backgroundColor: this.state.rowsColors[index]}]}>
          <Image resizeMode='contain' source={Assets.tmpIcon} style={styles.icon}/>
          <Text style={styles.text}>{String(this.state.mapNaming[row] ? this.state.mapNaming[row] : row).toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  checkInfoAndGo(row){
    if(this.state.wholeInfo[row]){
      this.navigationController.direct(row, {header: this.state.mapNaming[row],in: this.state.wholeInfo[row]})
    }
  }
  render() {
    return (
      <ImageBackground resizeMode="repeat" source={Assets.bg5} style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView bounces={false} style={styles.container} contentContainerStyle={__GStyles.default.contentContainer}>
          {/* Go ahead and delete ExpoLinksView and replace it with your
            * content, we just wanted to provide you with some helpful links */}
          <ListView
              bounces={false}
              dataSource={this.state.infoMainSections}
              renderRow={this.renderRowNews.bind(this)}
              enableEmptySections={true}
          ></ListView>
        </ScrollView>
        <Footer />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: 20,
    paddingBottom: 20
  },  
  icon: {
    width: 50,
    height: 50,
    marginRight: '5%',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
