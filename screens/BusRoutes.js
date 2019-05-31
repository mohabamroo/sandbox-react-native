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
import * as __GStyles from '../styles';
import Accordion from 'react-native-collapsible/Accordion';
import Footer from '../components/Footer';
import Assets from '../constants/Assets';
export default class BusRoutes extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.navigation.state.params.in || [],
      colors: ['#008691', '#f8b7bb', '#60a484', '#e9665d'],
      activeSection: [0]
    };
  }
  async componentDidMount() {}
  renderRowNews(row, L, index) {}
  _renderSectionTitle(content, index) {
    return <View />;
  }
  _renderHeader(section, sectionNumber) {
    console.log('TCL: BusRoutes -> _renderHeader -> section', section);
    return (
      <View
        style={[
          styles.sectionTitle,
          {
            backgroundColor: section.color ? section.color.toLowerCase() : 'red'
          }
        ]}
      >
        <Text style={styles.headerText}>{'Area ' + sectionNumber}</Text>
      </View>
    );
  }
  returnRules(content) {
    console.log('TCL: BusRoutes -> returnRules -> content', content);
    let returnable = [];
    content.points.forEach((point, idx) => {
      returnable.push(
        <View key={idx} style={styles.pointRow}>
          <View>
            <Text style={styles.pointTitle}>{point.point_name}</Text>
          </View>
          <View style={styles.pointInfoContent}>
            <View style={styles.pointInfo}>
              <Text style={styles.contentText}>Latitude: </Text>
              <Text style={styles.contentText}>{point.point_latitude}</Text>
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.contentText}>Longitude: </Text>
              <Text style={styles.contentText}>{point.point_latitude}</Text>
            </View>
          </View>
        </View>
      );
    });
    return returnable;
  }
  _renderContent(content, index) {
    console.log('TCL: BusRoutes -> _renderContent -> content', content);
    return (
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: this.state.colors[index] }
        ]}
      >
        {this.returnRules(content)}
      </View>
    );
  }
  _onChange(activeSection) {
    this.setState({ activeSection });
  }
  render() {
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg1}
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
          <View>
            <Accordion
              activeSections={this.state.activeSection}
              sections={this.state.content}
              renderSectionTitle={this._renderSectionTitle.bind(this)}
              renderHeader={this._renderHeader.bind(this)}
              renderContent={this._renderContent.bind(this)}
              onChange={this._onChange.bind(this)}
            />
          </View>
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
  sectionTitle: {
    padding: 20
  },
  contentContainer: {
    padding: 30,
    paddingTop: 0
  },
  contentText: {
    color: '#fff',
    marginBottom: 5
  },
  headerText: {
    color: '#fff',
    fontSize: 18
  },
  pointRow: {
    padding: 5
  },
  pointTitle: {
    fontWeight: 'bold'
  },
  pointInfoContent: {
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  pointInfo: {
    flexDirection: 'row',
    flex: 1
  }
});
