import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  RefreshControl
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Assets from '../constants/Assets';
import * as __GStyles from '../styles';
import { BalanceDB } from '../Config/DB';
import Layout from '../constants/Layout';
import Footer from '../components/Footer';

const URLs = require('../Config/ExternalURL');
export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      qrCode: this.props.navigation.state.params.user.qr_serial,
      balanceObj: {}
    };

    this._onRefresh = this._onRefresh.bind(this);
  }

  async componentDidMount() {
    let balanceObj = await BalanceDB.Get();
    this.setState({ balanceObj });
  }

  renderOrderRow(order, idx) {
    return (
      <View style={styles.orderRow} key={idx}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>{'ORDER: ' + idx}</Text>
          <Text style={styles.totalPrice}>
            -{+Math.ceil(order.total / 100)} EGP
          </Text>
        </View>
        {order.items.map((item, itemIdx) => {
          return (
            <View style={styles.itemRow} key={itemIdx}>
              <Text>({item.quantity})</Text>
              <Text> . {item.name}</Text>
              <Text> - Unit Price {Math.ceil(item.price / 100)} EGP</Text>
              {/* <Text style={{ flex: 1 }}>{Math.ceil(item.subtotal / 100)}</Text> */}
            </View>
          );
        })}
      </View>
    );
  }
  _onRefresh() {
    let qrCode = this.state.qrCode;
    qrCode = 111;
    fetch(URLs.getBalance(qrCode))
      .then(response => {
        console.log('TCL: Balance -> _onRefresh -> response', response);
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(apiResponse => {
        console.log('TCL: Balance -> _onRefresh -> apiResponse', apiResponse);
        this.setState({ balanceObj: apiResponse, refreshing: false });
        BalanceDB.Set(apiResponse);
      })
      .catch(err => {
        // FIXME: what to do on internet corruption
        this.setState({ refreshing: false });

        console.log('TCL: Balance Screen -> componentDidMount -> err', err);
      });
  }

  render() {
    let { user } = this.state;
    let { user: balanceUser, orders } = this.state.balanceObj;
    if (!orders)
      orders = [
        {
          id: 13,
          items: [
            {
              name: 'Heineken',
              quantity: 3,
              price: 9500,
              subtotal: 28500
            },
            {
              name: 'Stella',
              quantity: 2,
              price: 1000,
              subtotal: 1200
            }
          ],
          total: 34000
        },
        {
          id: 16,
          items: [
            {
              name: 'Vodka',
              quantity: 1,
              price: 1200,
              subtotal: 1200
            }
          ],
          total: 3000
        }
      ];
    console.log(orders);
    return (
      <ImageBackground
        resizeMode="repeat"
        source={Assets.bg1}
        style={__GStyles.default.container}
      >
        <HeaderComponent navigation={this.props.navigation} />
        <View style={{ width: '100%', height: 160 }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 160,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f8b7bb'
            }}
          >
            <Image
              source={{
                uri: 'https://nacelle.nbhood.com/' + user.client_photo
              }}
              style={{
                width: Layout.window.width / 3,
                height: Layout.window.width / 3,
                backgroundColor: '#fde9d6'
              }}
            />
            <View
              style={[
                styles.triangle,
                styles.triangleDown,
                styles.nameArea,
                { borderBottomColor: '#f8b7bb' }
              ]}
            />
            <View style={styles.textArea}>
              <Text style={styles.name}>{user.client_name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.balance}>Your balance is:</Text>
                <Text style={styles.number}>
                  {balanceUser ? balanceUser.balance : 0} EGP
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ImageBackground
          resizeMode="stretch"
          source={Assets.homeProfile}
          style={{ height: 60, backgroundColor: 'transparent', marginTop: -10 }}
        >
          <View
            style={{
              backgroundColor: '#FDE9D6',
              padding: 3,
              left: 20,
              top: 10,
              height: 25,
              alignItems: 'center',
              position: 'absolute'
            }}
          >
            <Text style={(styles.listTitle, { color: '#f069a7' })}>
              Your Order History
            </Text>
          </View>
        </ImageBackground>
        <ScrollView
          style={styles.ordersList}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {orders.map((order, idx) => this.renderOrderRow(order, idx))}
          <View style={styles.footerMargin} />
        </ScrollView>
        <Footer />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
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
  textArea: {
    position: 'absolute',
    top: 40,
    left: Layout.window.width / 3 - 10
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    width: Layout.window.width / 3,
    color: '#ffec59'
  },
  balance: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffec59',
    marginRight: 5
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffec59'
  },
  orderRow: {
    backgroundColor: 'white',
    marginTop: 20
  },
  itemRow: {
    flex: 1,
    padding: 2,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: 'white'
  },
  ordersList: {
    padding: 10,
    marginTop: -10,
    paddingTop: 50,
    paddingLeft: 10,
    backgroundColor: 'white'
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 10,
    color: 'white'
  },
  totalPrice: {
    textAlign: 'right',
    fontWeight: 'bold'
  },
  orderTitle: {
    fontWeight: 'bold',
    paddingLeft: 20,
    fontSize: 16
  },
  orderHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  footerMargin: {
    height: Layout.window.height / 3
  }
});
