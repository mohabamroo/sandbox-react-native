import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');
import * as __GStyles from '../styles';
import Assets from '../constants/Assets';
export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
     
    };
  }
  render() {
    const {isActive,name,balance,friend,isfriend}=this.props
    return (
        <ImageBackground
        resizeMode="stretch"
        source={Assets.homeProfile}
        style={styles.profileBG}
      >
      {isActive?
        <TouchableOpacity style={{overflow:'hidden'}} >
        <Image source={require('../assets/images/man.jpg')} style={{height:97,width:width*.4,borderBottomRightRadius:50,borderTopRightRadius:40}}/> 
        
      <View style={styles.triangle} > 
      </View>
      <View style={{position:'absolute',top:10,}}>
           <Text style={{fontSize:16,color:'#f069a7',fontWeight:'bold',left:width*.28 ,}}>{name}</Text>
           <Text style={{fontSize:12,color:'#e9665d',left:width*.32,}}>-Your Balance is:<Text style={{fontWeight:'bold'}}> {balance}</Text> EGP</Text>
            {isfriend?<Text style={{fontSize:12,color:'#e9665d',left:width*.32,}}>-Friends in the BOX:{friend}</Text>:null}
           
        </View>
        
        
          </TouchableOpacity>
        
        :
         <View style={styles.textContainer}>
          <Text style={styles.beforeActivationTextBG}>
            You did not activate you pass yet ?!
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.buttonActivate}
            onPress={() => {
              console.log('Press');
            }}
          >
            <View>
              <Text style={styles.activateText}>
                {String('Activate Your PASS now').toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>}
       
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9665d'
  },
  profileBG: {
    width: '100%',
    height: 100,
    zIndex: 3,
    justifyContent: 'center'
  },
  counter: {
    backgroundColor: '#7bc19e',
    width: '100%',
    height: 100,
    zIndex: 2,
    marginTop: -10
  },
  beforeActivationTextBG: {
    backgroundColor: '#fde9d6',
    padding: 5,
    color: '#f069a7',
    fontSize: 12
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '10%'
  },
  buttonActivate: {
    backgroundColor: '#f069a7',
    padding: 10
  },
  activateText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 165,
    borderRightWidth: 34,
    borderBottomWidth: 93,
    borderLeftColor: '#fde9d6',
    borderRightColor: 'transparent',
    borderBottomColor: '#fde9d6',
    position:'absolute',
    bottom:3,
    transform: [
      {rotate: '180deg'}
    ],
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flex:1,
    marginLeft:width*.21,
    borderTopLeftRadius:15,
    borderBottomLeftRadius:4
  },
});
