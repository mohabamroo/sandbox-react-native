import React from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View, Text, ListView, ImageBackground } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as __GStyles from '../styles';
import Accordion from 'react-native-collapsible/Accordion';
import Assets from '../constants/Assets';

export default class Safety extends React.Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  constructor(props){
    super(props);
    this.state = {
      content: this.props.navigation.state.params.in || [],
      colors: [
				'#7bc19e',
				'#60a383',
				'rgb(36,154,167)',
				'#ffeb59',
				'#f9bb79',
				'#e9655d',
				'#f8b7bb',
				'#f069a7',
				'#fde9d6'
			],
      activeSection: [0]
    }
  }
  async componentDidMount(){

  }
  renderRowNews(row, L, index){

  }
  _renderSectionTitle(content, index){
    return (
      <View />
  )
  }
  _renderHeader(section, sectionNumber){
    return (
      <View style={[styles.sectionTitle, {backgroundColor: this.state.colors[sectionNumber]}]}>
        <Text style={styles.headerText}>{section.section_title}</Text>
      </View>
    )
  }
  _renderContent(content, index){
      return (
        <View style={[styles.contentContainer, {backgroundColor: this.state.colors[index]}]}>
          <Text style={styles.contentText}>{content.safety_info}</Text>
        </View>
    )
  }
  _onChange(activeSection){
    this.setState({activeSection});
  }
  render() {
    return (
      <ImageBackground resizeMode="repeat" source={Assets.bg1} style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView bounces={false} style={styles.container} contentContainerStyle={__GStyles.default.contentContainer}>
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
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    padding: 20,
  },
  contentContainer: {
    padding: 30,
    paddingTop: 0
  },
  contentText: {
    color: '#fff'
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
  }
});
