import React from 'react';
import {
	ScrollView,
	Image,
	ListView,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	ImageBackground,
	AppState
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import ArtistPopup from './ArtistPopup';

import * as __GStyles from '../styles';
import { ArtistsDB } from '../Config/DB';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';

export default class LinksScreen extends React.Component {
	ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	constructor(props) {
		super(props);
		this.state = {
			active: 'all',
			colors: ['#fabb79', '#008691', '#e9665d', '#60a484'],
			colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
			artists: this.ds.cloneWithRows([]),
			current_artist: null,
			show_popup: false,
			color1: '#fff',
			color2: '#fff'
		};
	}
	async componentDidMount() {
		let artists = await ArtistsDB.Get();
		artists = artists.map(x => {
			return { ...x, visible: true };
		});
		this.setState({
			artists: this.ds.cloneWithRows(artists),
			initialArtists: artists,
			appState: AppState.currentState
		});
	}

	componentWillUnmount() {}

	renderArtist(row, L, index) {
		let color = this.state.colors[index % Number(this.state.colors.length)];
		let color2 = this.state.colors2[index % Number(this.state.colors2.length)];
		return (
			<TouchableOpacity
				onPress={() =>
					this.setState({
						show_popup: true,
						current_artist: row,
						color1: color,
						color2
					})
				}
			>
				<View key={index} style={styles.artistRow}>
					<Image source={{ uri: row.artist_image }} style={styles.image} />
					<View
						style={[
							styles.triangle,
							styles.triangleDown,
							styles.nameArea,
							{ borderBottomColor: color }
						]}
					/>
					<Text style={styles.artistName}>{row['artist_name']}</Text>
					{/**<Image source={Assets.artist1} style={styles.artistsRowImage} /> */}
					<View style={styles.sessionInfo}>
						<Text style={styles.sessionDay}>
							{row['artist_session'] && row['artist_session']['session_stage']
								? row['artist_session']['session_stage']
								: 'Main Stage'}
						</Text>
						<Text style={styles.sessionTime}>
							{row['artist_session']
								? row['artist_session']['session_day'] +
								  ', ' +
								  row['artist_session']['session_start_time'] +
								  ' - ' +
								  row['artist_session']['session_end_time']
								: ''}
						</Text>
					</View>
					<View
						style={[
							styles.triangle2,
							styles.triangleCornerBottomRight,
							styles.footerArea,
							{ borderTopColor: color2 }
						]}
					>
						<View
							style={{
								flex: 1,
								width: Layout.window.width,
								height: Layout.window.width,
								backgroundColor: 'red'
							}}
						/>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
	section() {
		return;
	}

	_handleAppStateChange = newState => {
		this.setState(newState);
		let currentActive = newState.active;
		let newArr = this.state.initialArtists.filter(row => {
			let stage = (row['artist_session'] && row['artist_session']['session_stage'])
				? row['artist_session']['session_stage']
				: 'Main Stage'
			stage = stage ? stage.replace('stage', '').toLowerCase() : stage;
			let visible =
				currentActive == 'all' || (stage && stage.includes(currentActive));
			return visible;
		});
		this.setState({
			artists: this.ds.cloneWithRows(newArr)
		});
	};

	render() {
		return (
			<View style={__GStyles.default.container}>
				<HeaderComponent navigation={this.props.navigation} />
				<View style={styles.container}>
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
									{this.state.active == 'all' ? '>' : ''} All
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
									{this.state.active == 'main' ? '>' : ''} Main Stage
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
									{this.state.active == 'sandbox' ? '>' : ''} Sandbox Stage
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								this._handleAppStateChange({
									active: 'morning'
								});
							}}
							style={{ flex: 1 }}
						>
							<View
								style={[
									styles.tab,
									{
										backgroundColor:
											this.state.active == 'morning' ? '#ffec59' : 'transparent'
									}
								]}
							>
								<Text
									style={[
										{
											fontWeight: 'bold',
											fontSize: 12,
											color:
												this.state.active == 'morning' ? '#f3996e' : '#eeb8bc'
										}
									]}
								>
									{' '}
									{this.state.active == 'morning' ? '>' : ''} Morning Stage
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<ScrollView bounces={false} style={{ flex: 1 }}>
						<ListView
							bounces={false}
							dataSource={this.state.artists}
							renderRow={this.renderArtist.bind(this)}
							enableEmptySections={this.section}
						/>
					</ScrollView>
				</View>
				{this.state.current_artist && (
					<ArtistPopup
						isVisible={this.state.show_popup}
						artist={this.state.current_artist}
						color1={this.state.color1}
						color2={this.state.color2}
						onClose={() => this.setState({ show_popup: false })}
					/>
				)}
			</View>
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
	},
	artistRow: {
		flex: 1,
		flexDirection: 'row',
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
		borderBottomWidth: Layout.window.width,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: Layout.window.width,
		borderRightWidth: Layout.window.width / 2,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent'
	},
	triangleDown: {
		transform: [{ rotate: '180deg' }]
	},
	nameArea: {
		marginLeft: (Layout.window.width / 6) * -1
	},
	footerArea: {
		position: 'absolute',
		right: 0,
		zIndex: 9
	},
	triangle2: {
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderRightWidth: 2 * (Layout.window.width / 2.5),
		borderTopWidth: 100,
		borderRightColor: 'transparent',
		alignSelf: 'flex-end'
	},
	triangleCornerBottomRight: {
		transform: [{ rotate: '180deg' }]
	},
	artistName: {
		position: 'absolute',
		top: 20,
		left: Layout.window.width / 3 - 20,
		fontSize: 18,
		fontWeight: 'bold',
		width: Layout.window.width / 3,
		color: '#fff'
	},
	sessionInfo: {
		color: '#fff',
		position: 'absolute',
		bottom: 5,
		right: 5,
		fontSize: 20,
		zIndex: 10
	},
	sessionDay: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'right'
	},
	sessionTime: {
		color: '#fff'
	}
});
