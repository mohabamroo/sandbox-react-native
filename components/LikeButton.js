import React from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	Image
} from 'react-native';
import {
	scheduleFavoritesNotifications
} from './Notifications';

import Assets from '../constants/Assets';
import * as layout from '../constants/Layout';
import { FavoritesDB } from '../Config/DB';
import { likeArtist, removeArtistLike } from '../Config/ExternalURL';

export default class LikeButton extends React.Component {
	preventDefault = false;
	constructor(props) {
		super(props);
		this.state = {
			fetchingLike: false,
			liked: this.props.liked
		};
	}

	_handleLikeClick() {
		console.log('like clicked');
		this.preventDefault = true;
		this._likeArtist();
		this.preventDefault = false;
	}

	_likeArtist() {
		let newLike = !this.props.liked;
		this.setState({
			fetchingLike: true
		});
		let reqURL = newLike ? likeArtist : removeArtistLike;

		let opts = {
			artist_id: this.props.artist_id,
			user_id: this.props.user_id
		};
    console.log(reqURL, opts)
		fetch(reqURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(opts)
		})
			.then(response => response.json())
			.then(apiResponse => {
				if (apiResponse.Status == 200) {
					FavoritesDB.Set(apiResponse.data).then(() => {
            scheduleFavoritesNotifications();
            this.props.notifyParent();
          }	
					);
				}
        this.setState({fetchingLike: false})
			})
			.catch(err => {
        this.setState({fetchingLike: false})
			});
	}

	render() {
		const { style, liked, size, loggedIn } = this.props;
		if (loggedIn) {
			return (
				<TouchableOpacity
					style={style}
					activeOpacity={0.5}
					onPress={() => this._handleLikeClick()}
				>
					{this.state.fetchingLike ? (
						<ActivityIndicator color="#ffec59" />
					) : (
						<Image
							source={liked? Assets.heart_on : Assets.heart_off}
							style={{
								width: size,
								height: size
							}}
							resizeMode={'contain'}
						/>
					)}
				</TouchableOpacity>
			);
		}
		return null;
	}
}
