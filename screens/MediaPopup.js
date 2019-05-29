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
		const { photos, isVisible } = this.props;
		return (
			<Modal isVisible={isVisible} style={{margin: 0}}>
			<View style={styles.container}>
				<ImageBackground
				style={[styles.container, {position: 'absolute', opacity: 0.2}]}
				source={Assets.bg1}
				resizeMode="repeat"
				/>
					<View
						style={{
							height: '100%',
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
							data={[1, 2, 3]}
							renderItem={item => (
								<Image
									source={Assets.robotdev}
									resizeMode="contain"
									style={{ width: '100%'}}
								/>
							)}
							sliderWidth={width}
							itemWidth={width}
							slidewidth={width}
							sliderHeight={height}
							itemHeight={height}
							slideheight={height}
							horizontal
							layout={'default'}
							onSnapToItem={index => this.setState({ index })}
							slideStyle={{
								alignSelf: 'center'
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
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%'
	}
});
