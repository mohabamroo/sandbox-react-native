import React from 'react';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ListView,
  ImageBackground
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Layout from '../constants/Layout';

import * as __GStyles from '../styles';

import { InfoDB } from '../Config/DB/index';
import { NavigationController } from '../navigation/index';
import Assets from '../constants/Assets';
import Footer from '../components/Footer';
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
        '#ffec59'
      ],
      mapNaming: {
        rules: { label: 'Festival rules', order: 1 },
        bus_routes: { label: 'SHUTTLE BUSES & ROUTES', order: 2 },
        faqs: { label: 'FAQs', order: 3 },
        policies: { label: 'policies', order: 4 },
        safety: { label: 'Safety & medical info', order: 5 },
        partners: { label: 'partners, Sponsors & credit', order: 6 }
      }
    };
  }
  async componentDidMount() {
    // loading the information page content
    let info = await InfoDB.Get();
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
      wholeInfo: info
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
        <Footer />
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
