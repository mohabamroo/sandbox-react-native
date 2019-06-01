import React from 'react';
import {
  ScrollView,
  Image,
  ListView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AppState,
  ImageBackground,
  TouchableHighlight
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import ArtistPopup from './ArtistPopup';
import Footer from '../components/Footer';
import { FavoritesDB } from '../Config/DB';

import * as __GStyles from '../styles';
import { ArtistsDB } from '../Config/DB';
import Assets from '../constants/Assets';
import Layout from '../constants/Layout';
import ArtistRow from '../components/ArtistRow';

export default class LinksScreen extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  constructor(props) {
    super(props);
    this.state = {
      active: 'all',
      colors: ['#fabb79', '#008691', '#e9665d', '#60a484'],
      colors2: ['#60a484', '#f069a7', '#fabb79', '#ffe958'],
      artists: this.ds.cloneWithRows([])
    };
  }
  async componentDidMount() {
    let artists = await ArtistsDB.Get();
    artists = artists.map(x => {
      return { ...x, visible: true };
    });
    let dsData = this.ds.cloneWithRows(artists);
    this.setState({
      artists: this.ds.cloneWithRows(artists),
      initialArtists: artists,
      appState: AppState.currentState
    });
    this.fetchFavorites();
  }

  componentWillUnmount() {}

  renderArtist(row, L, index) {
    let color = this.state.colors[index % Number(this.state.colors.length)];
    let color2 = this.state.colors2[index % Number(this.state.colors2.length)];
    return (
      <ArtistRow
        index={index}
        artist={row}
        color={color}
        color2={color2}
        lastRow={index == this.state.currentCount - 1}
        click={() =>
          this.setState({
            show_popup: true,
            current_artist: row,
            current_artist_idx: index,
            color1: color,
            color2
          })
        }
      />
    );
  }
  section() {
    return;
  }

  _handleAppStateChange = newState => {
    this.setState(newState);
    let currentActive = newState.active;
    let newArr = this.state.initialArtists.filter(row => {
      let stage = row['artist_session']['session_stage'];
      stage = stage ? stage.replace('stage', '').toLowerCase() : stage;
      let visible =
        currentActive == 'all' || (stage && stage.includes(currentActive));
      return visible;
    });
    this.setState({
      artists: this.ds.cloneWithRows(newArr)
    });
  };

  fetchFavorites() {
    let initialArtists = this.state.initialArtists;
    // artists: dsData,
    FavoritesDB.Get().then(artists => {
      artists.forEach(likedArtist => {
        if (likedArtist && likedArtist.artist_id) {
          initialArtists.forEach((artist, index) => {
            if (artist.artist_id == likedArtist.artist_id) {
              console.log(
                'TCL: LinksScreen -> fetchFavorites -> likedArtist.artist_id',
                likedArtist.artist_id
              );
              initialArtists[index]['liked'] = true;
            }
          });
        }
      });

      let dsData = this.ds.cloneWithRows(initialArtists);
      this.setState({ artists: dsData });
    });
  }

  render() {
    return (
      <View style={__GStyles.default.container}>
        <HeaderComponent navigation={this.props.navigation} />
        <ImageBackground
          resizeMode="repeat"
          source={Assets.bg4}
          style={[styles.container, { width: '100%' }]}
        >
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => {
                this._handleAppStateChange({ active: 'all' });
              }}
              style={{ flex: 0.5 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'all' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: this.state.active == 'all' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'all' ? '>' : ''} All
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._handleAppStateChange({ active: 'main' });
              }}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'main' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: this.state.active == 'main' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'main' ? '>' : ''} Main Stage
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._handleAppStateChange({
                  active: 'sandbox'
                });
              }}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'sandbox' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'sandbox' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'sandbox' ? '>' : ''} Sandbox Stage
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._handleAppStateChange({
                  active: 'morning'
                });
              }}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      this.state.active == 'morning' ? '#ffec59' : 'transparent'
                  }
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 12,
                      color:
                        this.state.active == 'morning' ? '#f3996e' : '#eeb8bc'
                    }
                  ]}
                >
                  {this.state.active == 'morning' ? '>' : ''} Morning Stage
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView bounces={false} style={{ flex: 1 }}>
            <ListView
              bounces={false}
              dataSource={this.state.artists}
              renderRow={this.renderArtist.bind(this)}
              enableEmptySections={this.section}
            />
          </ScrollView>
        </ImageBackground>
        {this.state.current_artist && (
          <ArtistPopup
            isVisible={this.state.show_popup}
            artist={this.state.current_artist}
            color1={this.state.color1}
            color2={this.state.color2}
            notifyParent={() => this.fetchFavorites()}
            onClose={() => this.setState({ show_popup: false })}
          />
        )}
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  tabsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fde9d6'
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  artistRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: Layout.window.width / 3,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: Layout.window.width / 3,
    height: Layout.window.width / 3,
    backgroundColor: '#fde9d6'
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
  footerArea: {
    position: 'absolute',
    right: 0,
    zIndex: 9
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 2 * (Layout.window.width / 2.5),
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end'
  },
  triangleCornerBottomRight: {
    transform: [{ rotate: '180deg' }]
  },
  artistName: {
    position: 'absolute',
    top: 20,
    left: Layout.window.width / 3 - 20,
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#fff'
  },
  sessionInfo: {
    color: '#fff',
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 20,
    zIndex: 10
  },
  sessionDay: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  sessionTime: {
    color: '#fff'
  }
});
