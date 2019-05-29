import React from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Text,
	Dimensions,
	ImageBackground,
	Image
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { DiscoverDB } from '../Config/DB';
import * as __GStyles from '../styles';

const { height, width } = Dimensions.get('window');

export default class Discover extends React.Component {
	constructor() {
		super();
		this.state = {
			map: false,
			places: false
		};
	}

	async componentWillMount() {
		let places = await DiscoverDB.Get();
		map = places.filter(item => item.location_type === 'SHOW ALL')[0];
		places = places.filter(item => !(item.location_type === 'SHOW ALL'));
		this.setState({
			map,
			places
		});
	}

	render() {
		console.log('LLLL', this.state.places);
		return (
			<View style={__GStyles.default.container}>
				<HeaderComponent navigation={this.props.navigation} />
				<ImageBackground
					source={{ uri: this.state.map.location_image }}
					style={{ width: width, height: 400 }}
          resizeMode={'contain'}
				>
					{this.state.places &&
						this.state.places.map(item => (
							<Image
                key={item.location_type}
								source={{ uri: item.location_image }}
								style={{ width: width, height: 400, position: 'absolute' }}
                resizeMode={'contain'}
							/>
						))}
				</ImageBackground>

				<ScrollView style={styles.container} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: '#fff'
	}
});
