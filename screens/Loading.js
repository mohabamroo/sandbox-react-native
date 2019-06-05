import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image
} from 'react-native';
// Import navigation
import { NavigationActions } from 'react-navigation';

// Import the external URL:
const URLs = require('../Config/ExternalURL');

import { NavigationController } from '../navigation/index';

// Import the DBs
import {
  InfoDB,
  SchedualDB,
  ArtistsDB,
  DiscoverDB,
  NewsDB,
  EventInfoDB,
  MediaDB
} from '../Config/DB/index';
import Assets from '../constants/Assets';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingName: null,
      InfoData: {},
      SchedualData: {},
      ArtistsData: {},
      currentTaskText: 'Downloading festival content...'
    };
    this.navigationController = new NavigationController(this.props.navigation);
  }

  refresh(callback) {
    httpAddress = URLs.baseURL; //the site i'm building the app for
    var xhr = new XMLHttpRequest();
    xhr.open('GET', httpAddress);
    xhr.onreadystatechange = e => {
      if (xhr.readyState !== 4) {
        //code for completed request
        return;
      }
      // console.log("--- STATUS ---");
      // console.log(xhr.status);
      if (xhr.status === 200) {
        //successful response
        callback(true);
        // console.log('result goes here: ' + true)
      } else {
        //unsuccessful response
        /* NOTE: React native often reacts strangely to offline uses and as such,
				it may be necessary to directly set state here rather than to rely on a callback */
        callback(false); //OR: this.state.splash = false

        // console.log('result goes here: ' + false)
      }
    };
    xhr.send();
  }

  async componentDidMount() {
    const _this = this;
    // check the internet connection...
    this.refresh(async status => {
      console.log('The status: ', status);
      if (!status) {
        // should check the offline content.
        let schedule = await SchedualDB.Get();
        let artist = await ArtistsDB.Get();
        let Info = await InfoDB.Get();
        let General = await EventInfoDB.Get();
        if (!schedule || !artist || !Info || !General) {
          let msg = 'There seems to be an issue with your internet connection.';
          _this.setState({
            loadingName: msg,
            currentTaskText: msg
          });
        } else {
          _this.setState({
            currentTaskText: 'using cache data...'
          });
          this.navigationController.reset('Home');
        }
      } else {
        console.log('the internet is working fine, ');
        _this.setState({
          currentTaskText: 'Internet connection is ok.'
        });
        // should check and download the content online.
        _this.checkForDownloadableContent().then(success => {
          _this.setState({
            currentTaskText: 'Checking for downloadable data'
          });
          // FIXME: when to direct to home, what's the condition
          if (
            success &&
            success.artistsLastUpdate &&
            success.scheduleLastUpdate
          ) {
            this.navigationController.reset('Home');
            // console.log('from one');
            // _this.setState({
            //   currentTaskText: 'Downloading data from the intenet'
            // });
            // _this.DownloadTheData(success);
          } else {
            console.log('from two');
            _this.setState({
              currentTaskText: 'Downloading data from the intenet'
            });
            _this.DownloadTheData(undefined);
          }
        });
      }
    });
  }

  async checkForDownloadableContent() {
    return new Promise(async (resolve, reject) => {
      /**
       * Should check for the lastUpdated content from the DBs.
       */
      let scheduleLastUpdate = await SchedualDB.GetLastUpdate();
      let ArtistsLastUpdate = await ArtistsDB.GetLastUpdate();
      let newsLastUpdate = await NewsDB.GetLastUpdate();
      if (scheduleLastUpdate && ArtistsLastUpdate) {
        // should return with an object.
        return resolve({
          artistsLastUpdate: ArtistsLastUpdate,
          scheduleLastUpdate: scheduleLastUpdate,
          newsLastUpdate
        });
      } else {
        // return with no previous data.
        return resolve(undefined);
      }
    });
  }

  async DownloadTheData(object) {
    console.log('DOWNLOADING START');
    // object maybe undefined
    // should start loading each element and proccess the element.
    // first : Load the Artists and save into the SQLlight.
    this.setState({ loading: true, internetErrror: false });
    let Info, Schedule, Artists, Discover, News, General;
    try {
      Info = await fetch(URLs.info)
        .then(response => response.text())
        .then(dataStr => {
          // FIXME: tags in backend response, should be removed
          let jsonStart = dataStr.indexOf('{');
          dataStr = dataStr.substring(jsonStart, dataStr.length);
          let data = JSON.parse(dataStr);
          return data;
        });
      // object.scheduleLastUpdate
      Schedule = await fetch(
        object && object.scheduleLastUpdate
          ? URLs.scheduleURL
          : URLs.scheduleURL
      ).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched schedule data'
      });
      Artists = await fetch(
        object && object.artistsLastUpdate
          ? URLs.getArtists(this.formateDate(new Date()))
          : URLs.getArtists(undefined)
      ).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched artists and line-up'
      });
      Discover = await fetch(URLs.Discover).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched discover details'
      });
      General = await fetch(URLs.General).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched general data'
      });
      Media = await fetch(URLs.Media).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched media data'
      });
      News = await fetch(
        object && object.newsLastUpdate
          ? URLs.getNews(object.newsLastUpdate)
          : URLs.getNews(undefined)
      ).then(response => response.json());
      this.setState({
        currentTaskText: 'Fetched news and articles'
      });
    } catch (err) {
      this.setState({
        currentTaskText: 'Error downloading data from the internet'
      });
      this.InternetCorruption();
      return;
    }
    if (
      General.status !== 200 ||
      Info.status !== 200 ||
      Schedule.status !== 200 ||
      Artists.status !== 200 ||
      Discover.status !== 200 ||
      News.status !== 200
    ) {
      // should show to the user there's an internet curruption has been happened and he should check the internet connection.
      this.InternetCorruption();
    }
    // Should save each one of downloads into RealM DB.
    const self = this;
    this.setState(
      {
        InfoData: Info.data,
        SchedualData: Schedule.data,
        ArtistsData: Artists.data,
        General: General.data,
        Media: Media.data,
        scheduleLastUpdate: Schedule.last_update,
        ArtistsLastUpdate: Artists.last_update,
        Discover: Discover.data,
        News: News.data,
        NewsLastUpdate: News.last_update
      },
      () => {
        console.log(this.state.NewsLastUpdate);
        self.proccess();
      }
    );
  }

  async proccess() {
    console.log('PROCCESS');
    this.setState({
      loading: true,
      internetErrror: false,
      ErrorInfo: undefined
    });
    const SavingInfo = await InfoDB.Set(this.state.InfoData);

    const SavingSchedual = this.state.SchedualData
      ? await SchedualDB.Set(this.state.SchedualData)
      : { success: true };
    const SavingScheduleLastUpdate = await SchedualDB.SetLastUpdate(
      this.state.scheduleLastUpdate
    );
    console.log('dule');

    const SavingArtists = this.state.ArtistsData
      ? await ArtistsDB.Set(this.state.ArtistsData)
      : { success: true };
    const SavingArtistslastUpdate = await ArtistsDB.SetLastUpdate(
      this.state.ArtistsLastUpdate
    );
    console.log('Saved artists');

    const SavingDiscover = this.state.Discover
      ? await DiscoverDB.Set(this.state.Discover)
      : { success: true };
    console.log('Saved discover');

    const SavingGeneral = this.state.General
      ? await EventInfoDB.Set(this.state.General)
      : { success: true };
    console.log('Saved general');

    const SavingMedia = this.state.Media
      ? await MediaDB.Set(this.state.Media)
      : { success: true };
    console.log('Saved media');

    const SavingNews = this.state.News
      ? await NewsDB.Set(this.state.News)
      : { success: true };
    console.log('saved new data');
    const SavingNewslastUpdate = await NewsDB.SetLastUpdate(
      this.state.NewsLastUpdate
    );
    console.log('Saved news');

    if (
      !SavingInfo.success ||
      !SavingSchedual.success ||
      !SavingScheduleLastUpdate.success ||
      !SavingArtists.success ||
      !SavingArtistslastUpdate.success ||
      !SavingDiscover.success ||
      !SavingGeneral.success ||
      !SavingMedia.success ||
      !SavingNews.success ||
      !SavingNewslastUpdate.success
    ) {
      this.SavingCorruption('Info');
    }
    this.navigationController.reset('Home');
  }

  SavingCorruption() {
    this.setState({
      loading: false,
      internetErrror: true,
      ErrorInfo: 'Save',
      message:
        'There seems to be an issue with your internet connection, please check and try again later.'
    });
  }

  InternetCorruption() {
    this.setState({
      loading: false,
      internetErrror: true,
      ErrorInfo: 'Internet',
      message:
        'There seems to be an issue with your internet connection, please check and try again later.'
    });
  }

  componentWillUnmount() {}

  formateDate(jsDate) {
    // d-M-Y-H-i
    let formattedDate =
      jsDate.getDate() + '-' + jsDate.getMonth() + '-' + jsDate.getYear();
    return formattedDate;
  }

  render() {
    return (
      <ImageBackground
        source={Assets.splash}
        resizeMode="stretch"
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#ffec59" />

        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
            position: 'absolute',
            top: 100
          }}
        >
          {this.state.currentTaskText}
        </Text>
        {/* <Image
          resizeMode="contain"
          source={Assets.logoOnly}
          style={styles.footerImage}
        /> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  hintMsg: {
    position: 'absolute',
    bottom: 40,
    fontWeight: 'bold',
    color: '#ccc'
  },
  footerImage: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    width: 200
  }
});
