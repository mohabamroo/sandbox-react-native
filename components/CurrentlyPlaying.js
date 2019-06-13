import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from 'react-native';

import LikeButton from './LikeButton';
import Layout, * as layout from '../constants/Layout';
import Assets from '../constants/Assets';

export default class CurrentlyPlaying extends React.Component {
	constructor(props) {
			super(props)
            console.log("TCL: CurrentlyPlaying -> constructor -> props", props)
			this.state= {
				active: 'now'
			}
	}

	componentDidMount() {
		// TODO: favorites logic
		const favoriteArtists = this.props.favorites;
		const currentArtistID = this.props.artistId;
        console.log("TCL: CurrentlyPlaying -> componentDidMount -> favoriteArtists", favoriteArtists)
	}

	render() {
		let { sandbox, main, nextM, nextS } = this.props.currentEvents;
		// console.log(main, sandbox);
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

					<TouchableOpacity
						onPress={() => this.setState({active: 'now'})}
						style={{
							backgroundColor: this.state.active === 'now' ? '#e9665d':'#ffec59',
							width: '40%',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View style={[styles.play, {borderBottomColor: this.state.active === 'now' ? '#ffec59':'#e9665d'}]} />
						<Text style={[{ color: '#e9665d', fontSize: 12 },  this.state.active === 'now' ?{color:  '#ffec59', fontWeight: 'bold'}:{}]}>NOW PLAYING</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => this.setState({active: 'next'})}
						style={{
							backgroundColor: this.state.active === 'now' ?'#ffec59' :'#e9665d',
							width: '60%',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View
							style={[
								styles.play,
								{ borderBottomColor: this.state.active === 'now' ? '#e9665d':'#ffec59', marginRight: 4 }
							]}
						/>
						<View
							style={{
								backgroundColor: this.state.active === 'now' ? '#e9665d':'#ffec59',
								height: 10,
								width: 2,
								marginRight: 10
							}}
						/>
						<Text style={[{ color: '#e9665d', fontSize: 12 }, this.state.active !== 'now' ? {color:  '#ffec59', fontWeight: 'bold'}:{} ]}>
							PLAYING NEXT
						</Text>
					</TouchableOpacity>
					<View style={[styles.triangle, {borderBottomColor: this.state.active === 'now' ?'#ffec59' :'#e9665d'}]}/>
				</View>
				{this.state.active === 'now' && (
				<View
					style={{
						flexDirection: 'row',
						width: '100%',
						height: 100,
						backgroundColor: 'transparent'
					}}
				>
					{main && (
						<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.showDetials(main)} style={{ width: '50%', height: '100%' }}>
							<View>
								<Image
									source={{ uri: main.artistImage }}
									style={styles.image}
									resizeMode={'cover'}
								/>
							</View>
							{
								this.props.loggedIn && (
									<LikeButton
										style={{
											width: 25,
											height: 25,
											position: 'absolute',
											top: 10,
											left: 5,
											zIndex: 3
										}}
										size={14}
										liked={this.props.favorites && this.props.favorites.filter(x => x.artist_id == main.artistId).length > 0}
										loggedIn={this.props.loggedIn}
										user_id={this.props.user.id}
										artist_id={main.artistId}
										notifyParent={() => this.props.notifyParent()}
									/>
								)
							}
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
							<Text
								style={styles.artistName}
							>
								{main.artistName}
							</Text>
							<Text
								style={styles.stageName}
							>
								MAIN STAGE
							</Text>
						</TouchableOpacity>
					)}
					{sandbox && (
						<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.showDetials(sandbox)} style={{ width: '50%', height: '100%' }}>
							<View >
								<Image
									source={{ uri: sandbox.artistImage }}
									style={styles.image}
									resizeMode={'cover'}
								/>
							</View>
							{
								this.props.loggedIn && (
									<LikeButton
										style={{
											width: 25,
											height: 25,
											position: 'absolute',
											top: 10,
											left: 5,
											zIndex: 3
										}}
										size={14}
										liked={this.props.favorites && this.props.favorites.filter(x => x.artist_id == sandbox.artistId).length > 0}
										loggedIn={this.props.loggedIn}
										user_id={this.props.user.id}
										artist_id={sandbox.artistId}
										notifyParent={() => this.props.notifyParent()}
									/>
								)
							}
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
							<Text
								style={styles.artistName}
							>
								{sandbox.artistName}
							</Text>
							<Text
								style={styles.stageName}
							>
								SANDBOX STAGE
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
			{this.state.active === 'next' && (this.props.currentEvents.nextM || this.props.currentEvents.nextS) &&(
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					height: 100,
					backgroundColor: 'transparent'
				}}
			>
				{this.props.currentEvents.nextM && (
					<TouchableOpacity  activeOpacity={0.9} onPress={() => this.props.showDetials(this.props.currentEvents.nextM)} style={{ width: '50%', height: '100%' }}>
						<View>
							<Image
								source={{ uri: this.props.currentEvents.nextM.artistImage }}
								style={styles.image}
								resizeMode={'cover'}
							/>
						</View>
						{
							this.props.loggedIn && (
								<LikeButton
									style={{
										width: 25,
										height: 25,
										position: 'absolute',
										top: 10,
										left: 5,
										zIndex: 3
									}}
									size={14}
									liked={this.props.favorites && this.props.favorites.filter(x => x.artist_id == nextM.artistId).length > 0}
									loggedIn={this.props.loggedIn}
									user_id={this.props.user.id}
									artist_id={nextM.artistId}
									notifyParent={() => this.props.notifyParent()}
								/>
							)
						}
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
						<Text
							style={styles.artistName}
						>
							{this.props.currentEvents.nextM.artistName}
						</Text>
						<Text
							style={styles.stageName}
						>
							MAIN STAGE
						</Text>
					</TouchableOpacity>
				)}
				{this.props.currentEvents.nextS && (
					<TouchableOpacity  activeOpacity={0.9} onPress={() => this.props.showDetials(this.props.currentEvents.nextS)} style={{ width: '50%', height: '100%' }}>
						<View>
							<Image
								source={{ uri: this.props.currentEvents.nextS.artistImage }}
								style={styles.image}
								resizeMode={'cover'}
							/>
						</View>
						{
							this.props.loggedIn && (
								<LikeButton
									style={{
										width: 25,
										height: 25,
										position: 'absolute',
										top: 10,
										left: 5,
										zIndex: 3
									}}
									size={14}
									liked={this.props.favorites && this.props.favorites.filter(x => x.artist_id == nextS.artistId).length > 0}
									loggedIn={this.props.loggedIn}
									user_id={this.props.user.id}
									artist_id={nextS.artistId}
									notifyParent={() => this.props.notifyParent()}
								/>
							)
						}
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
						<Text
							style={styles.artistName}
						>
							{this.props.currentEvents.nextS.artistName}
						</Text>
						<Text
							style={styles.stageName}
						>
							SANDBOX STAGE
						</Text>
					</TouchableOpacity>
				)}
			</View>
		)}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 150,
		width: '100%',
	},
	triangle: {
		position: 'absolute',
		top: 0,
		right: '59.9%',
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
		borderBottomWidth: 8,
		backgroundColor: 'transparent',
		borderBottomColor: '#e9665d',
		borderStyle: 'solid',
		borderLeftWidth: 8,
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
		borderRightWidth: Layout.window.width * 0.25,
		borderBottomWidth: 450,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		transform: [{ rotate: '180deg' }]
	},
	image: {
		height: 150
	},
	artistName: {
		position: 'absolute',
		top: 5,
		right: 10,
		color: 'white',
		textAlign: 'right',
		fontSize: 12,
		width: Layout.window.width * 0.15,
		fontWeight: 'bold'
	},
	stageName: {
		position: 'absolute',
		bottom: -10,
		right: 10,
		color: '#e9665d',
		fontSize: 10,
		width: Layout.window.width * 0.15,
		fontWeight: 'bold',
		textAlign: 'right'
	}
});
