import React from 'react';
import {
	FlatList,
	StyleSheet,
	View,
	Text,
	Dimensions,
	ImageBackground,
	Image
} from 'react-native';
import CheckBox from 'react-native-check-box';
import HeaderComponent from '../components/HeaderComponent';
import VisibilityView from '../components/VisibilityView';
import { DiscoverDB } from '../Config/DB';
import * as __GStyles from '../styles';
import Assets from '../constants/Assets';

const { height, width } = Dimensions.get('window');

export default class Discover extends React.Component {
	constructor() {
		super();
		this.state = {
			map: false,
			places: false,
			colors: [
				'#7bc19e',
				'#e9655d',
				'#ffeb59',
				'#60a383',
				'#837563',
				'#f9bb79',
				'#f8b7bb',
				'#f069a7',
				'#fde9d6'
			]
		};
	}

	async componentWillMount() {
		let places = await DiscoverDB.Get();
		map = places.filter(item => item.location_type === 'SHOW ALL')[0];
		places = places.filter(item => !(item.location_type === 'SHOW ALL'));

		show = {};
		for (i in places) {
			item = places[i];
			show[item.location_type] = false;
		}
		this.setState({
			map,
			places,
			show
		});
	}

	render() {
		return (
			<View style={__GStyles.default.container}>
				<HeaderComponent navigation={this.props.navigation} />
				<ImageBackground
					source={Assets.bg1}
					style={{ width: width, height: 400 }}
					resizeMode={'repeat'}
				>
					<ImageBackground
						source={{ uri: this.state.map.location_image }}
						style={{ width: width, height: 400 }}
						resizeMode={'stretch'}
					>
						{this.state.places &&
							this.state.places.map(item => (
								<VisibilityView
									key={item.location_type}
									width={width}
									item={item}
									show={this.state.show[item.location_type]}
								/>
							))}
					</ImageBackground>
				</ImageBackground>
				{this.state.places && (
					<FlatList
						keyExtractor={(item, index) => `${index}`}
						data={this.state.places}
						style={{ width: '100%' }}
						renderItem={item => {
							return (
								<View
									style={{
										backgroundColor: this.state.colors[
											item.index % Number(this.state.colors.length)
										]
									}}
								>
									<CheckBox
										style={{ flex: 1, padding: 10 }}
                    checkBoxColor={'white'}
                    checkedCheckBoxColor={'black'}
										onClick={() => {
                      show = this.state.show
                      show[item.item.location_type] = !show[item.item.location_type]
											this.setState({
												show
											});
										}}
										isChecked={this.state.show[item.item.location_type]}
										rightText={item.item.location_type}
                    rightTextStyle={{
                      fontSize: 16,
                      color: '#ffffff',
                      fontWeight: 'bold'
                    }}
									/>
								</View>
							);
						}}
					/>
				)}
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
