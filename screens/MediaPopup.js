import React from 'react';
import {
	Linking,
	ScrollView,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	ImageBackground
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import Layout from '../constants/Layout';
import Footer from '../components/Footer';
import Assets from '../constants/Assets';

const { height, width } = Dimensions.get('window');

export default class ArtistPopup extends React.Component {
	constructor() {
		super();
		this.state = {
			index: 0
		};
	}

	render() {
		let { selectedImages, isVisible, index } = this.props;
		return (
			<Modal
				isVisible={isVisible}
				style={{ margin: 1 }}
				onModalShow={() => this._carousel.snapToItem(index)}
			>
				<View style={styles.container}>
					<ImageBackground
						style={[styles.container, { position: 'absolute', opacity: 0.3 }]}
						source={Assets.bg1}
						resizeMode="repeat"
					/>

					<View
						style={{
							height: '85%',
							width: '100%',
							backgroundColor: 'transparent',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Carousel
							ref={c => {
								this._carousel = c;
							}}
							data={selectedImages}
							renderItem={item => {
								return (
									<Image
										source={{ uri: item.item.image }}
										resizeMode="contain"
										style={{
											alignSelf: 'center',
											width: width * 0.95,
											height: height * 0.7,
											marginTop: 50
										}}
									/>
								);
							}}
							sliderWidth={width}
							itemWidth={width}
							slidewidth={width}
							horizontal
							layout={'stack'}
							onSnapToItem={index => this.setState({ index })}
							slideStyle={{
								alignSelf: 'center',
							}}
							containerCustomStyle={{
								backgroundColor: 'transparent'
							}}
						/>
					</View>
				</View>
				<View style={{ position: 'absolute', bottom: 0, left: 0, flex: 1 }}>
					<Footer />
				</View>
				<TouchableOpacity
					style={styles.close}
					onPress={() => this.props.onClose()}
				>
					<Image source={Assets.close} resizeMode={'contain'} style={{width: 35}}/>
				</TouchableOpacity>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%'
	},
	close: {
		position: 'absolute',
		top: 30,
		right: 30,
		height: 40,
		width: 35,
		justifyContent: 'center'
	}
});
