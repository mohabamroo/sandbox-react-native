import React from 'react';
import { ScrollView, StyleSheet, View, Text} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

import * as __GStyles from '../styles';


export default class Discover extends React.Component {
  render() {
    return (
      <View style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView style={styles.container}>
          {/* Go ahead and delete ExpoLinksView and replace it with your
            * content, we just wanted to provide you with some helpful links */}
          <Text>Discover</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
