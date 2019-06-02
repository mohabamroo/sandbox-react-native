import React from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Text,
	ImageBackground,
  Image
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Assets from '../constants/Assets';
import * as __GStyles from '../styles';
import { BalanceDB } from '../Config/DB';
import Layout from '../constants/Layout';
import Footer from '../components/Footer';

export default class Balance extends React.Component {
	async componentDidMount() {
		let balance = await BalanceDB.Get();
		console.log('Balance', balance);
	}

	render() {
		return (
			<ImageBackground
				resizeMode="repeat"
				source={Assets.bg1}
				style={__GStyles.default.container}
			>
				<HeaderComponent navigation={this.props.navigation} />
				<View
					style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
				>
					<View
						style={{
							flexDirection: 'row',
							width: '100%',
							height: Layout.window.width / 3,
							overflow: 'hidden',
							position: 'relative',
              backgroundColor: '#f8b7bb'
						}}
					>
						<Image
							source={{ uri: 'https://sandboxfestival.com/wp-content/uploads/2018/04/SB18-Map-1500x1500-2-no-labels.jpg' }}
							style={{
								width: Layout.window.width / 3,
								height: Layout.window.width / 3,
								backgroundColor: '#fde9d6'
							}}
						/>
            <View
              style={[
                styles.triangle,
                styles.triangleDown,
                styles.nameArea,
                { borderBottomColor: '#f8b7bb' }
              ]}
            />
            <View style={styles.textArea}>
              <Text style={styles.name}>Ramy Georgy</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.balance}>Your balance is:</Text>
                <Text style={styles.number}>200 EGP</Text>
              </View>
            </View>
					</View>
				</View>
				<Footer />
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: '#fff'
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
  textArea: {
    position: 'absolute',
    top: Layout.window.height * 0.07,
    left: Layout.window.width / 3 - 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#ffec59'
  },
  balance: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffec59',
    marginRight: 5
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffec59'
  }
});
