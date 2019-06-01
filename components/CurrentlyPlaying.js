import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as GStyles from '../styles';
import Layout, * as layout from '../constants/Layout';
import Assets from '../constants/Assets';

export default class CurrentlyPlaying extends React.Component {
	render() {
    console.log('CURRENT', this.props.currentEvents.sandbox)
    let { sandbox, main } = this.props.currentEvents;
		return (
			<View style={styles.container}>
				<View
					style={{
						flexDirection: 'row',
						width: '100%',
						height: 35,
						backgroundColor: 'white'
					}}
				>
					<View
						style={{
							backgroundColor: '#ffec59',
							width: '40%',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View style={styles.play} />
						<Text style={{ color: '#f3996e', fontSize: 15 }}>NOW PLAYING</Text>
					</View>
					<View
						style={{
							backgroundColor: '#e9665d',
							width: '60%',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View
							style={[
								styles.play,
								{ borderBottomColor: '#f3996e', marginRight: 4 }
							]}
						/>
						<View
							style={{
								backgroundColor: '#f3996e',
								height: 15,
								width: 2,
								marginRight: 10
							}}
						/>
						<Text style={{ color: '#f3996e', fontSize: 15 }}>
							WHAT IS PLAYING NEXT?!
						</Text>
					</View>
					<View style={styles.triangle} />
				</View>
				<View
					style={{
						flexDirection: 'row',
						width: '100%',
						height: 165,
            backgroundColor: (!sandbox)? '#f8b7bb' :'#7bc19e'
					}}
				>
					{main && (
            <View style={{ width: '50%', height: '100%' }}>
              <Image
                source={{ uri: main.artistImage}}
                style={styles.image}
                resizeMode={'cover'}
              />
              <TouchableOpacity
    						style={{
              		position: 'absolute',
              		top: 15,
              		left: 10
              	}}
    						onPress={() => console.log('ss')}
    					>
    						<Image source={Assets.heart_off} style={{ width: 20, height: 20 }} resizeMode={'contain'}/>
    					</TouchableOpacity>
  						<View
  							style={[
  								styles.triangle1,
  								{
  									position: 'absolute',
  									top: 0,
  									right: 0,
                    borderBottomColor: '#f8b7bb'
  								}
  							]}
  						/>
              <Text style={{ position: 'absolute',top: 5, right: 0, color: 'white', fontSize: 16, width: Layout.window.width * 0.3, fontWeight: 'bold'}}>{main.artistName}</Text>
              <Text style={{ position: 'absolute',bottom: 5, right: 5, color: '#e9665d', fontSize: 12, width: Layout.window.width * 0.15, fontWeight: 'bold', textAlign: 'right'}}>MAIN STAGE</Text>
  					</View>
          )}
          { sandbox && (
					<View
						style={{ width: '50%', height: '100%' }}
					>
            <Image
              source={{ uri: sandbox.artistImage }}
              style={styles.image}
              resizeMode={'cover'}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 15,
                left: 10
              }}
              onPress={() => console.log('ss')}
            >
              <Image source={Assets.heart_off} style={{ width: 20, height: 20 }} resizeMode={'contain'}/>
            </TouchableOpacity>
            <View
              style={[
                styles.triangle1,
                {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  borderBottomColor: '#7bc19e'
                }
              ]}
            />
            <Text style={{ position: 'absolute',top: 5, right: 0, color: 'white', fontSize: 16, width: Layout.window.width * 0.3, fontWeight: 'bold'}}>{sandbox.artistName}</Text>
            <Text style={{ position: 'absolute',bottom: 5, right: 5, color: '#e9665d', fontSize: 12, width: Layout.window.width * 0.15, fontWeight: 'bold', textAlign: 'right'}}>SANDBOX STAGE</Text>
          </View>
          )}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 200,
		width: '100%'
	},
	triangle: {
		position: 'absolute',
		top: 0,
		right: '60%',
		width: 0,
		height: 0,
		borderBottomWidth: 35,
		backgroundColor: 'transparent',
		borderBottomColor: '#e9665d',
		borderStyle: 'solid',
		borderLeftWidth: 35,
		borderRightWidth: 0,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		transform: [{ rotate: '270deg' }]
	},
	play: {
		width: 0,
		height: 0,
		margin: 10,
		borderBottomWidth: 12,
		backgroundColor: 'transparent',
		borderBottomColor: '#e9665d',
		borderStyle: 'solid',
		borderLeftWidth: 12,
		borderRightWidth: 0,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		transform: [{ rotate: '-45deg' }]
	},
	triangle1: {
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderRightWidth: Layout.window.width * 0.35,
		borderBottomWidth: 450,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		transform: [{ rotate: '180deg' }]
	},
  image: {
    height: 165
  }
});
