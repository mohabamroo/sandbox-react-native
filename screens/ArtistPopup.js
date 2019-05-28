import React from 'react';
import {
	Linking,
	ScrollView,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { Zocial, EvilIcons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import Footer from '../components/Footer';
import { likeArtist } from '../Config/ExternalURL';

export default class ArtistPopup extends React.Component {
	constructor() {
		super();
		this._likeArtist = this._likeArtist.bind(this);
	}

	_likeArtist(opts) {
		console.log(likeArtist);
		fetch(likeArtist, {
			method: 'post',
			body: JSON.stringify(opts)
		})
			.then(res => {
				console.log('Artist Liked.', res);
			})
			.catch(err => {
				console.log('error liking artist.', err);
			});
	}

	render() {
		let { artist, color1, color2 } = this.props;
		console.log('ARTIST', artist);
		return (
			<Modal isVisible={this.props.isVisible}>
				<View style={[styles.container, { backgroundColor: color1 }]}>
					<Image
						source={{ uri: artist.artist_image }}
						style={styles.image}
						resizeMode={'cover'}
					/>
					<TouchableOpacity
						style={styles.like}
						onPress={() =>
							this._likeArtist({ artist_id: artist.artist_id, user_id: 1 })
						}
					>
						<EvilIcons name="heart" size={40} color="white" />
					</TouchableOpacity>
					<View style={[styles.triangle, { borderBottomColor: color2 }]} />
					<Text style={styles.artistName}>{artist.artist_name}</Text>
					<TouchableOpacity
						onPress={() => this.props.onClose()}
						style={[styles.close, { backgroundColor: color1 }]}
					>
						<Text style={styles.x}>X</Text>
					</TouchableOpacity>
					<View style={[styles.triangle2, { borderTopColor: color1 }]} />
					<TouchableOpacity
						style={styles.icon}
						onPress={() => Linking.openURL(artist.artist_soundcloud)}
					>
						<Zocial name="soundcloud" size={20} color="orange" />
					</TouchableOpacity>
					<ScrollView
						style={[styles.textArea, { backgroundColor: color1 }]}
						contentContainerStyle={{
							padding: 10
						}}
					>
						<Text style={styles.description}>{artist.artist_description}</Text>
					</ScrollView>
				</View>
				<View style={{ position: 'absolute', bottom: -20, left: -20, flex: 1 }}>
					<Footer />
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginBottom: '30%',
		height: '70%',
		width: '100%'
	},
	icon: {
		position: 'absolute',
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		top: Layout.window.width * 0.46,
		right: Layout.window.width * 0.06
	},
	image: {
		height: Layout.window.width * 0.9
	},
	like: {
		position: 'absolute',
		top: 10,
		left: 10
	},
	triangle: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderRightWidth: Layout.window.width * 0.7,
		borderBottomWidth: Layout.window.width * 0.6,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		transform: [{ rotate: '180deg' }]
	},
	triangle2: {
		position: 'absolute',
		top: Layout.window.width * 0.5,
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderRightWidth: Layout.window.width * 0.9,
		borderTopWidth: Layout.window.width * 0.1,
		borderRightColor: 'transparent',
		alignSelf: 'flex-end',
		transform: [{ rotate: '180deg' }]
	},
	textArea: {
		position: 'absolute',
		top: Layout.window.width * 0.6,
		width: Layout.window.width * 0.9,
		height: Layout.window.width * 0.85
	},
	artistName: {
		position: 'absolute',
		right: 5,
		top: Layout.window.width * 0.05,
		fontSize: 25,
		color: 'white',
		fontWeight: 'bold'
	},
	x: {
		color: 'white',
		textAlign: 'center',
		fontSize: 20
	},
	close: {
		position: 'absolute',
		top: -10,
		right: -5,
		height: 25,
		width: 20,
		justifyContent: 'center'
	},
	description: {
		position: 'absolute',
		right: 5,
		top: Layout.window.width * 0.05,
		fontSize: 14,
		color: 'white',
		fontWeight: '200'
	}
});
