import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
// Import navigation
import { NavigationActions } from 'react-navigation';

// Import the external URL:
const URLs = require('../Config/ExternalURL');

import {NavigationController} from '../navigation/index';

// Import the DBs 
import { InfoDB, SchedualDB, ArtistsDB, DiscoverDB, NewsDB, EventInfoDB } from '../Config/DB/index';

export default class Loading extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			loadingName: null,
			InfoData: {},
			SchedualData: {},
			ArtistsData: {}
        }
        this.navigationController = new NavigationController(this.props.navigation);
	}
	refresh(callback) {
		httpAddress = URLs.baseURL; //the site i'm building the app for
		var xhr = new XMLHttpRequest();
		xhr.open('GET', httpAddress);
		xhr.onreadystatechange = (e) => {
			if (xhr.readyState !== 4) { //code for completed request
				return;
			}
			// console.log("--- STATUS ---");
			// console.log(xhr.status);
			if (xhr.status === 200) { //successful response
				callback(true);
				// console.log('result goes here: ' + true)
			} else {                  //unsuccessful response
				/* NOTE: React native often reacts strangely to offline uses and as such,
				it may be necessary to directly set state here rather than to rely on a callback */
				callback(false)  //OR: this.state.splash = false

				// console.log('result goes here: ' + false)
			}
		};
		xhr.send();
	}
	async componentDidMount() {
		const _this = this;
		// check the internet connection...
		this.refresh(async (status) => { 
            console.log("The status: ", status);
			if (!status) { 
				// should check the offline content.
				let schedual = await SchedualDB.Get();
				let artist = await ArtistsDB.Get();
                let Info = await InfoDB.Get();
                let General = await EventInfoDB.Get();
				if (!schedual || !artist || !Info || !General) {
					_this.setState({
						loadingName: "There seems to be an issue with your internet connection, please check and try again later."
					})
				} else {
					_this.goTo('Home');
				}
			} else { 
                console.log("the internet is working fine, ");
				// should check and download the content online.
				_this.checkForDownloadableContent().then(success => {
                    console.log("checked the downloadable content and the result is : ", success);
					if (success && success.artistsLastUpdate && success.schedualLastUpdate) {
						console.log('from one');
						_this.DownloadTheData(success);
					} else {
						console.log('from two');
						_this.DownloadTheData(undefined);
					}
				})
			}
		})
	}
	async checkForDownloadableContent() { 
		return new Promise(async (resolve, reject) => {
			/**
			 * Should check for the lastUpdated content from the DBs.
			 */
			let schedualLastUpdate = await SchedualDB.GetLastUpdate();
            let ArtistsLastUpdate = await ArtistsDB.GetLastUpdate();
            let newsLastUpdate = await NewsDB.GetLastUpdate();
            console.log("newsLastUpdate", newsLastUpdate)
			if (schedualLastUpdate && ArtistsLastUpdate) {
				// should return with an object.
				return resolve({
					artistsLastUpdate: ArtistsLastUpdate,
                    schedualLastUpdate: schedualLastUpdate,
                    newsLastUpdate
				})
			}
			else { 
				// return with no previous data.
				return resolve(undefined);
			}
		})
	}
	async DownloadTheData(object) { 
		console.log('DOWNLOADING START');
		// object maybe undefined
		// should start loading each element and proccess the element.
		// first : Load the Artists and save into the SQLlight.
        this.setState({ loading: true, internetErrror: false, });
        let Info,Schedual, Artists, Discover, News, General;
        try{
            Info = await fetch(URLs.info).then((response) => response.json());
            Schedual = await fetch((object && object.schedualLastUpdate) ? URLs.getSchedual(object.schedualLastUpdate) : URLs.getSchedual(undefined)).then((response) => response.json());
            Artists = await fetch((object && object.artistsLastUpdate) ? URLs.getArtists(object.artistsLastUpdate) : URLs.getArtists(undefined)).then((response) => response.json());
            Discover = await fetch(URLs.Discover).then((response) => response.json());
            General = await fetch(URLs.General).then((response) => response.json());
            // News = await fetch((object && object.newsLastUpdate) ? URLs.getNews(object.newsLastUpdate) : URLs.getNews(undefined));
            // console.log("The news:", News);
        }catch(err){
            console.log("Error while downloading", err);
            this.InternetCorruption();
            return;
        }
		if (General.status !== 200 || Info.status !== 200 || Schedual.status !== 200 || Artists.status !== 200 || Discover.status !== 200) {
			// should show to the user there's an internet curruption has been happened and he should check the internet connection.
			this.InternetCorruption();
		}
		// Should save each one of downloads into RealM DB.
        const _this = this;
		this.setState({
			InfoData: Info.data,
			SchedualData: Schedual.data,
            ArtistsData: Artists.data,
            General: General.data,
			SchedualLastUpdate: Schedual.last_update,
			ArtistsLastUpdate: Artists.last_update,
			Discover: Discover.data
		}, () => {
			_this.proccess()	
		})
		
	}
	async proccess() { 
		console.log('PROCCESS');
		this.setState({
			loading: true,
			internetErrror: false,
			ErrorInfo: undefined,
			
		});
		const SavingInfo = await InfoDB.Set(this.state.InfoData);
		
		const SavingSchedual = (this.state.SchedualData) ? await SchedualDB.Set(this.state.SchedualData) : {success: true};
		const SavingScheduallastUpdate = await SchedualDB.SetLastUpdate(this.state.SchedualLastUpdate);
		
		const SavingArtists = (this.state.ArtistsData) ? await ArtistsDB.Set(this.state.ArtistsData) : {success: true};
		const SavingArtistslastUpdate = await ArtistsDB.SetLastUpdate(this.state.ArtistsLastUpdate);
		
        const SavingDiscover = (this.state.Discover) ? await DiscoverDB.Set(this.state.Discover) : { success: true };
        
        const SavingGeneral = (this.state.General) ? await EventInfoDB.Set(this.state.General) : {success: true};

		if (
				!SavingInfo.success
			|| !SavingSchedual.success
			|| !SavingScheduallastUpdate.success
			|| !SavingArtists.success
			|| !SavingArtistslastUpdate.success
            || !SavingDiscover.success
            || !SavingGeneral.success
		) { 
			this.SavingCorruption('Info');
        }
        this.navigationController.reset('Home');
	}
	SavingCorruption() { 
		this.setState({
			loading: false,
			internetErrror: true,
			ErrorInfo: "Save",
			message: "There seems to be an issue with your internet connection, please check and try again later."
		})
	}
	InternetCorruption() { 
		this.setState({
			loading: false,
			internetErrror: true,
			ErrorInfo: "Internet",
			message: "There seems to be an issue with your internet connection, please check and try again later."
		})
	}
	componentWillUnmount() { }
	render() {
		return (
            <View style={styles.container}>
                <Text>{(this.state.loadingName) ? this.state.loadingName : "Loading"}</Text>
            </View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		padding: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	}
})