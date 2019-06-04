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
        <Text style={styles.orderTitle}>{'ORDER: ' + idx}</Text>
        {order.items.map((item, itemIdx) => {
          return (
            <View style={styles.itemRow} key={itemIdx}>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Text style={{ flex: 1 }}>{item.quantity}</Text>
              <Text style={{ flex: 1 }}>{item.price}</Text>
              <Text style={{ flex: 1 }}>{Math.ceil(item.subtotal / 100)}</Text>
            </View>
          );
        })}
        <Text style={styles.totalPrice}>
          {'Total: ' + Math.ceil(order.total / 100) + 'EGP'}
        </Text>
      </View>
    );
  }
  _onRefresh() {
    fetch(URLs.getBalance(this.state.qrCode))
      .then(response => {
        console.log("TCL: Balance -> _onRefresh -> response", response)
        if (response.status == 200) {
          return response.json();
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
        <View style={{ width: '100%', height: 150, backgroundColor: 'white' }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: Layout.window.width / 3,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f8b7bb'
            }}
          >
            <Image
              source={{
                uri:
                  'https://sandboxfestival.com/wp-content/uploads/2018/04/SB18-Map-1500x1500-2-no-labels.jpg'
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

        <ScrollView
          style={styles.ordersList}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Text style={styles.listTitle}>Orders List</Text>
          {orders.map((order, idx) => this.renderOrderRow(order, idx))}
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
    borderBottomWidth: 1,
    marginBottom: 10
  },
  itemRow: {
    flex: 1,
    padding: 2,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ordersList: {
    padding: 10,
    paddingLeft: 10,
    backgroundColor: 'white'
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 10
  },
  totalPrice: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5
  },
  orderTitle: {
    paddingLeft: 10
  }
});
