import React from 'react';
import { Dimensions, StyleSheet, View, Text,FlatList,Image,TouchableOpacity,ImageBackground } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
const { width, height } = Dimensions.get('window');
import { AntDesign } from '@expo/vector-icons';
// import the page components
import Assets from '../constants/Assets';

import * as __GStyles from '../styles';
import Footer from '../components/Footer'

export default class Schedule extends React.Component {
  constructor(props) {
		super(props)

		this.state = {
      day_1: {
        MainStage: [],
        sandBoxStage: [],
      },
      day_2: {
        MainStage: [],
        sandBoxStage: [],
      },
      day_3: {
        MainStage: [],
        sandBoxStage: [],
      },
		}
  }
  
  componentDidMount() {
    this.fetchCategories()
  }
  fetchCategories = () => {
    fetch('https://sandboxfestival.com/wp-json/sandbox/get/v3/home_schedule/1')
    .then((res => res.json()))
    .then((resJson) => {
      // alert(JSON.stringify(resJson))
        this.setState({
          day_1: { MainStage: resJson.data.day1["Main Stage"], sandBoxStage: resJson.data.day1["SANDBOX Stage"] },
          day_2: { MainStage: resJson.data.day2["Main Stage"], sandBoxStage: resJson.data.day2["SANDBOX Stage"] },
          day_3: { MainStage: resJson.data.day3["Main Stage"], sandBoxStage: resJson.data.day3["SANDBOX Stage"] },
        })
    })
    .catch((err) => {

    })
  }
  renderMainStageArtiest = (item) => {
		return (
			<TouchableOpacity >
          <Image source={{ uri: item.artistImage }} style={{height:150,width:width*.3,marginLeft:width*.21}}/> 
          <View style={{position:'absolute',height:150,width:width*.3,marginLeft:width*.21,backgroundColor:'rgba(0,0,0,.1)'}}/>
        <View style={styles.triangle} > 
        </View>
        <View style={{position:'absolute',top:10,left:15,paddingRight:width*.3}}>
             <Text style={{fontSize:22,color:'white',fontWeight:'bold',}}>{item.artistName}</Text>
          </View>
          <AntDesign name="hearto" size={15} color="white"  style={{position:'absolute',right:10,top:10,}}/>
			</TouchableOpacity>
		)
  }
  renderSandBoxStageArtiest = (item) => {
		return (
			<TouchableOpacity >
          <Image source={{ uri: item.artistImage }} style={{height:150,width:width*.3,marginLeft:width*.21}}/> 
          <View style={{position:'absolute',height:150,width:width*.3,marginLeft:width*.21,backgroundColor:'rgba(0,0,0,.1)'}}/>
        <View style={styles.triangle2} > 
        </View>
        <View style={{position:'absolute',top:10,left:15,paddingRight:width*.3}}>
          <Text style={{fontSize:22,color:'white',fontWeight:'bold',}}>{item.artistName}</Text>
        </View>
          <AntDesign name="hearto" size={17} color="white"  style={{position:'absolute',right:10,top:10,}}/>
			</TouchableOpacity>
		)
	}
  render() {
    return (
      <View style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ImageBackground style={styles.container} source={require('../assets/images/bgschedul.png')}>
          <View style={{flexDirection:'row'}}>
            <Image source={require('../assets/images/main.png')}style={{height:150,width:60,resizeMode:'cover'}}  /> 
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.day_1.MainStage}
              extraData={this.state}
              keyExtractor={(item) => item.artistId}
              renderItem={({ item }) => this.renderMainStageArtiest(item)}
              
            />
          </View>
          <View style={{flexDirection:'row'}}>
            <Image source={require('../assets/images/sandBox.png')}style={{height:150,width:60,}}  />  
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.day_1.sandBoxStage}
              extraData={this.state}
              keyExtractor={(item) => item.artistId}
              renderItem={({ item }) => this.renderSandBoxStageArtiest(item)}
              
            />
          </View>
          
        </ImageBackground>
        <Footer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9665d',
  },
triangle: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 60,
  borderRightWidth: 74,
  borderBottomWidth: 150,
  borderLeftColor: 'transparent',
  borderRightColor: '#f8b7bb',
  borderBottomColor: '#f8b7bb',
  position:'absolute',
  transform: [
    {rotate: '180deg'}
  ],
  justifyContent:'flex-end',
  alignItems:'flex-end',
  flex:1
},
triangle2: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 60,
  borderRightWidth: 74,
  borderBottomWidth: 150,
  borderLeftColor: 'transparent',
  borderRightColor: '#7ac19d',
  borderBottomColor: '#7ac19d',
  position:'absolute',
  transform: [
    {rotate: '180deg'}
  ],
  justifyContent:'flex-end',
  alignItems:'flex-end',
  flex:1
},
});
