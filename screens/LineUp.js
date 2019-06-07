import React from 'react';
import {
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	AppState,
	ImageBackground,
	BackHandler,
	Platform,
	Image
} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import ArtistPopup from './ArtistPopup';
import Assets, * as assets from '../constants/Assets';
import { FavoritesDB, ArtistsDB } from '../Config/DB';
import * as __GStyles from '../styles';
import Layout from '../constants/Layout';
import ArtistRow from '../components/ArtistRow';
const URLs = require('../Config/ExternalURL');

export default class LinksScreen extends React.Component {
	backHandler;
	constructor(props) {
		super(props);

		this.state = {
			active: 'all',
			colors: ['#fabb79', '#008691', '#e9665d', '#60a484'],
			colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
			artists: [],
			currentCount: 0,
			current_artist: null,
			show_popup: false,
			color1: '#fff',
			color2: '#fff',
			refreshing: true,
			loggedIn: this.props.navigation.state.params.loggedIn,
			user: this.props.navigation.state.params.user
		};
		this.handleBackClick = this.handleBackClick.bind(this);
	}

	async componentDidMount() {
		let artists = await ArtistsDB.Get();
		artists = artists.map(x => {
			return { ...x, visible: true };
		});
		main = artists.filter(x => x.artist_session.session_stage === 'Main Stage');
		sandbox = artists.filter(x => x.artist_session.session_stage === 'Sandbox Stage');
		this.handleBackClick();
		this.setState({
			artists,
			refreshing: false,
			currentCount: artists.length,
			initialArtists: artists,
			appState: AppState.currentState,
			main,
			sandbox
		});
		this.fetchFavorites();
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	handleBackClick() {
		const self = this;
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			function() {
				if (self.state.show_popup) {
					self.setState({ show_popup: false });
					return true;
				}
				return false;
			}
		);
	}

	renderArtist(item, index) {
		let color = this.state.colors[
			item.index % Number(this.state.colors.length)
		];
		let color2 = this.state.colors2[
			item.index % Number(this.state.colors2.length)
		];
		return (
			<ArtistRow
				index={item.index}
				artist={item.item}
				color={color}
				color2={color2}
				loggedIn={this.state.loggedIn}
				user={this.state.user}
				notifyParent={() => this.fetchFavorites()}
				lastRow={item.index == this.state.currentCount - 1}
				click={() =>
					this.setState({
						show_popup: true,
						current_artist: item.item,
						current_artist_idx: index,
						color1: color,
						color2
					})
				}
			/>
		);
	}

	_handleAppStateChange = newState => {
		this.setState(newState);
		// let currentActive = newState.active;
		// let newArr = this.state.initialArtists.filter(row => {
		// 	// FIXME: the session data is removed from the backend
		// 	let stage =
		// 		row['artist_session'] && row['artist_session']['session_stage']
		// 			? row['artist_session']['session_stage']
		// 			: 'main';
		// 	stage = stage ? stage.replace('stage', '').toLowerCase() : stage;
		// 	let visible =
		// 		currentActive == 'all' || (stage && stage.includes(currentActive));
		// 	return visible;
		// });
		// this.setState({
		// 	artists: newArr,
		// 	currentCount: newArr.length
		// });
	};

	fetchFavorites() {
		if (this.state.loggedIn) {
			let initialArtists = this.state.initialArtists;
			FavoritesDB.Get().then(artists => {
				initialArtists.forEach((artist, index) => {
					initialArtists[index]['liked'] = false;
				});
				if (artists) {
					artists.forEach(likedArtist => {
						if (likedArtist && likedArtist.artist_id) {
							initialArtists.forEach((artist, index) => {
								if (artist.artist_id == likedArtist.artist_id) {
									initialArtists[index]['liked'] = true;
								}
							});
						}
					});
				}
				main = initialArtists.filter(x => x.artist_session.session_stage === 'Main Stage');
				sandbox = initialArtists.filter(x => x.artist_session.session_stage === 'Sandbox Stage');
				this.setState({ artists: initialArtists, main, sandbox });
			});
		}
	}

	formateDate(jsDate) {
		// d-M-Y-H-i
		let formattedDate =
			jsDate.getDate() + '-' + jsDate.getMonth() + '-' + jsDate.getYear();
		console.log('TCL: Loading -> formateDate -> formattedDate', formattedDate);
		return formattedDate;
	}

	_onRefresh() {
		this.setState({ refreshing: true });
		fetch(URLs.getArtists(this.formateDate(new Date())))
			.then(response => {
				if (response.status == 200) {
					return response.json();
				}
			})
			.then(artists => {
				main = artists.filter(x => x.artist_session.session_stage === 'Main Stage');
				sandbox = artists.filter(x => x.artist_session.session_stage === 'Sandbox Stage');
				let newState = {
					artists: artists.data,
					currentCount: artists.data.length,
					initialArtists: artists.data,
					refreshing: false,
					active: this.state.active,
					main,
					sandbox
				};
				ArtistsDB.Set(artists.data);
				this._handleAppStateChange(newState);
			})
			.catch(err => {
				// FIXME: what to do on internet corruption
				this.setState({ refreshing: false });
				console.log('TCL: Balance Screen -> componentDidMount -> err', err);
			});
	}

	render() {
		return (
			<ImageBackground
				resizeMode="repeat"
				source={Assets.bg4}
				style={__GStyles.default.container}
			>
				<HeaderComponent navigation={this.props.navigation} />
				<View style={styles.tabsContainer}>
					<TouchableOpacity
						onPress={() => {
							this._handleAppStateChange({ active: 'all' });
						}}
						style={{ flex: 0.5 }}
					>
						<View
							style={[
								styles.tab,
								{
									backgroundColor:
										this.state.active == 'all' ? '#ffec59' : 'transparent'
								}
							]}
						>
							<Text
								style={[
									{
										fontWeight: 'bold',
										fontSize: 12,
										color: this.state.active == 'all' ? '#f3996e' : '#eeb8bc'
									}
								]}
							>
								{' '}
								{this.state.active == 'all' ? '>' : ''} ALL
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this._handleAppStateChange({ active: 'main' });
						}}
						style={{ flex: 1 }}
					>
						<View
							style={[
								styles.tab,
								{
									backgroundColor:
										this.state.active == 'main' ? '#ffec59' : 'transparent'
								}
							]}
						>
							<Text
								style={[
									{
										fontWeight: 'bold',
										fontSize: 12,
										color: this.state.active == 'main' ? '#f3996e' : '#eeb8bc'
									}
								]}
							>
								{' '}
								{this.state.active == 'main' ? '>' : ''} MAIN STAGE
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this._handleAppStateChange({
								active: 'sandbox'
							});
						}}
						style={{ flex: 1 }}
					>
						<View
							style={[
								styles.tab,
								{
									backgroundColor:
										this.state.active == 'sandbox' ? '#ffec59' : 'transparent'
								}
							]}
						>
							<Text
								style={[
									{
										fontWeight: 'bold',
										fontSize: 12,
										color:
											this.state.active == 'sandbox' ? '#f3996e' : '#eeb8bc'
									}
								]}
							>
								{' '}
								{this.state.active == 'sandbox' ? '>' : ''} SANDBOX STAGE
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1 }}>
					{this.state.artists &&
						this.state.active == 'all' && (
							<FlatList
								data={this.state.artists}
								windowSize={30}
								extraData={this.state.artists}
								removeClippedSubviews={Platform.OS !== 'ios'}
								ListFooterComponent={<View style={{ height: 220 }} />}
								style={{ flex: 1 }}
								keyExtractor={(item, idx) => idx + ''}
								renderItem={this.renderArtist.bind(this)}
								getItemLayout={(data, index) => ({
									length: Layout.window.width / 3,
									offset: (Layout.window.width / 3) * index,
									index
								})}
								refreshing={this.state.refreshing}
								onRefresh={() => this._onRefresh()}
							/>
						)}
					{this.state.artists &&
						this.state.active == 'main' && (
							<FlatList
								data={this.state.main}
								windowSize={30}
								extraData={this.state.main}
								removeClippedSubviews={Platform.OS !== 'ios'}
								ListFooterComponent={<View style={{ height: 220 }} />}
								style={{ flex: 1 }}
								keyExtractor={(item, idx) => idx + ''}
								renderItem={this.renderArtist.bind(this)}
								getItemLayout={(data, index) => ({
									length: Layout.window.width / 3,
									offset: (Layout.window.width / 3) * index,
									index
								})}
								refreshing={this.state.refreshing}
								onRefresh={() => this._onRefresh()}
							/>
						)}
					{this.state.artists &&
						this.state.active == 'sandbox' && (
							<FlatList
								data={this.state.sandbox}
								windowSize={30}
								extraData={this.state.sandbox}
								removeClippedSubviews={Platform.OS !== 'ios'}
								ListFooterComponent={<View style={{ height: 220 }} />}
								style={{ flex: 1 }}
								keyExtractor={(item, idx) => idx + ''}
								renderItem={this.renderArtist.bind(this)}
								getItemLayout={(data, index) => ({
									length: Layout.window.width / 3,
									offset: (Layout.window.width / 3) * index,
									index
								})}
								refreshing={this.state.refreshing}
								onRefresh={() => this._onRefresh()}
							/>
						)}
				</View>

				{this.state.current_artist &&
					this.state.show_popup && (
						<ArtistPopup
							loggedIn={this.state.loggedIn}
							user={this.state.user}
							artist={this.state.current_artist}
							color1={this.state.color1}
							color2={this.state.color2}
							notifyParent={() => this.fetchFavorites()}
							onClose={() => this.setState({ show_popup: false })}
						/>
					)}
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	backGround: {
		width: '100%',
		flex: 1
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	tabsContainer: {
		justifyContent: 'space-between',
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
