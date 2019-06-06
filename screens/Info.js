import React from 'react';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ListView,
  ImageBackground,
  RefreshControl
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Layout from '../constants/Layout';

import * as __GStyles from '../styles';

import { InfoDB } from '../Config/DB/index';
import { NavigationController } from '../navigation/index';
import Assets from '../constants/Assets';
const URLs = require('../Config/ExternalURL');

export default class Info extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  constructor(props) {
    super(props);
    this.navigationController = new NavigationController(this.props.navigation);
    this.state = {
      infoMainSections: this.ds.cloneWithRows([]),
      rowsColors: [
        '#008691',
        '#f8b7bb',
        '#60a484',
        '#fabb79',
        // '#e9665d',
        'rgb(231,103,	95)'
      ],
      mapNaming: {
        rules: { label: 'Sandbox Rules', order: 1 },
        bus_routes: { label: 'Shuttle Buses & Routes', order: 2 },
        faqs: { label: 'FAQs', order: 3 },
        policies: { label: 'policies', order: 4 },
        safety: { label: 'Safety & Medical Info', order: 6 },
        partners: { label: 'Partners, Sponsors & Credit', order: 5 }
      }
    };
    this._onRefresh = this._onRefresh.bind(this);
  }
  async componentDidMount() {
    // loading the information page content
    let info = await InfoDB.Get();
    this.setInfoContent(info);
    this.refreshInfo();
  }

  setInfoContent(info) {
    info = info ? info : {};
    delete info['policies'];
    const ordered = {};
    let self = this;
    Object.keys(info)
      .sort(function(x, y) {
        return self.state.mapNaming[x].order - self.state.mapNaming[y].order;
      })
      .forEach(function(key) {
        ordered[key] = info[key];
      });
    let infoMainSections = new Array();
    for (let i in ordered) {
      infoMainSections.push(i);
    }
    this.setState({
      infoMainSections: this.ds.cloneWithRows(infoMainSections),
      wholeInfo: info,
      refreshing: false
    });
  }

  refreshInfo() {
    this.setState({ refreshing: true });
    fetch(URLs.info)
      .then(response => {
        return response.json();
      })
      .then(apiResponse => {
        if (apiResponse.status == 200) {
          this.setInfoContent(apiResponse.data);
          InfoDB.Set(apiResponse.data);
        } else {
          this.setState({ refreshing: false });
        }
      })
      .catch(err => {
        this.setState({ refreshing: false });
        // FIXME: what to do on internet corruption
        console.log('TCL: Info Screen -> componentDidMount -> err', err);
      });
  }

  renderRowNews(row, L, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          this.checkInfoAndGo(row);
        }}
      >
        <View
          style={[
            styles.row,
            index == this.state.infoMainSections.getRowCount() - 1
              ? styles.footerMargin
              : {},
            { backgroundColor: this.state.rowsColors[index] }
          ]}
        >
          <Image
            resizeMode="contain"
            source={Assets[row] || Assets.tmpIcon}
            style={styles.icon}
          />
          <Text style={styles.text}>
            {String(
              this.state.mapNaming[row] ? this.state.mapNaming[row].label : row
            ).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  checkInfoAndGo(row) {
    if (this.state.wholeInfo[row]) {
      this.navigationController.direct(row, {
        header: this.state.mapNaming[row].label,
        in: this.state.wholeInfo[row]
      });
    } else {
      console.log('Missing info section: Info -> checkInfoAndGo -> row', row);
    }
  }

  _onRefresh() {
    this.refreshInfo();
  }

  render() {
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg5}
        style={__GStyles.default.container}
      >
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView
          bounces={false}
          style={styles.container}
          contentContainerStyle={__GStyles.default.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
          <ListView
            bounces={false}
            dataSource={this.state.infoMainSections}
            renderRow={this.renderRowNews.bind(this)}
            enableEmptySections={true}
          />
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: 20,
    paddingBottom: 20
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: '5%'
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    maxWidth: 200
  },
  footerMargin: {
    marginBottom: Layout.window.height / 4.5
  }
});
