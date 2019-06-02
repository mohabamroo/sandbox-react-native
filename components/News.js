/**
 * The boxes component in the Home page.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ListView,
  Image
} from 'react-native';
import Assets from '../constants/Assets';
import { Label } from './Label';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Quadrilateral from './Quadrilateral';

import { NewsDB } from '../Config/DB/index';
const URLs = require('../Config/ExternalURL');

export class News extends React.Component {
  ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
  });
  constructor(props) {
    super(props);
    this.state = {
      mlist: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      dataSource: this.ds.cloneWithRows([])
    };
  }

  async componentDidMount() {
    let news = await NewsDB.Get();
    this.setNews(news);
    this.refreshNews();
  }

  setNews(news) {
    let dsData = this.ds.cloneWithRows(news);
    this.setState({
      dataSource: dsData,
      newsCount: dsData.getRowCount()
    });
  }

  refreshNews() {
    fetch(URLs.getNews(this.state.userID))
      .then(response => response.json())
      .then(apiResponse => {
        if (apiResponse.Status == 200) {
          this.setNews(apiResponse.data);
          NewsDB.Set(apiResponse.data);
        }
      })
      .catch(err => {
        // FIXME: what to do on internet corruption
        console.log('TCL: News Screen -> componentDidMount -> err', err);
      });
  }

  section() {
    return;
  }

  renderRowNews(row, index) {
    // FIXME: ill-formatted date from backend
    let dataArr = row.news_date.split('/');
    let reFormattedDate = dataArr[1] + '/' + dataArr[0] + '/' + dataArr[2];
    let _Date_ = new Date(reFormattedDate);
    return (
      <View style={styles.newsBox}>
        <View style={styles.dateLabel}>
          <Text style={styles.dateLabelText}>{`${_Date_.getDate()} ${
            this.state.mlist[_Date_.getMonth()]
          }`}</Text>
        </View>
        <Image source={{ uri: row.news_image }} style={styles.newsImage} />
        <View>
          <View style={styles.quaStyleContainer}>
            <Quadrilateral color={Colors.newsFooterBG} />
          </View>
          <View style={styles.newsFooter}>
            <Text style={styles.newsFooterText}>{row.news_title}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/**News header section */}
        <ImageBackground
          source={Assets.circ1}
          resizeMode="repeat"
          style={styles.sectionHeaderContainer}
        >
          <View
            style={{
              width: '100%',
              height: '90%',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginLeft: '5%'
            }}
          >
            <Label
              title={{
                bgColor: '#0899A8',
                fontColor: '#fff',
                text: 'Our News'
              }}
            />
          </View>
        </ImageBackground>
        <View style={{ flex: 1 }}>
          <ListView
            enableEmptySections={this.section}
            dataSource={this.state.dataSource}
            renderRow={this.renderRowNews.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  sectionHeaderContainer: {
    width: '100%',
    height: 50
  },
  newsBox: {
    width: '100%',
    backgroundColor: 'gray',
    flex: 1,
    position: 'relative'
  },
  newsImage: {
    width: '100%',
    height: Layout.window.width
  },
  dateLabel: {
    position: 'absolute',
    right: 0,
    top: 40,
    zIndex: 99,
    padding: 5,
    backgroundColor: Colors.newsLabelBG
  },
  dateLabelText: {
    color: Colors.newsLabelFontColor
  },
  newsFooter: {
    width: '100%',
    padding: 20,
    paddingTop: 10,
    backgroundColor: Colors.newsFooterBG
  },
  newsFooterText: {
    color: Colors.newsFooterText
  },
  quaStyleContainer: {
    marginTop: -20
  }
});
