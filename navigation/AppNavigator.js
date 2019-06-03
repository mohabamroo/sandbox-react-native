import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Loading from '../screens/Loading';
import HomeScreen from '../screens/HomeScreen';
import LineUp from '../screens/LineUp';
import Schedule from '../screens/Schedule';
import Balance from '../screens/Balance';
import Media from '../screens/Media';
import Discover from '../screens/Discover';
import Info from '../screens/Info';
import Safety from '../screens/Safety';
import Rules from '../screens/Rules';
import Policies from '../screens/Policies';

import FQAs from '../screens/FQAs';
import Partners from '../screens/Partners';
import Profile from '../screens/Profile';
import ProfileScreen from '../screens/Profile';
import BusRoutes from '../screens/BusRoutes';
import Activation1 from '../screens/Activation1';
import ConfirmActivation from '../screens/ConfirmActivation';
import DataActivation from '../screens/DataActivation';
import CameraPage from '../screens/CameraComp';
export default createAppContainer(
  createStackNavigator(
    {
      Loading: {
        screen: Loading,
        params: {},
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Home: {
        screen: HomeScreen,
        params: {
          title: {
            text: 'The Home Screen',
            fontColor: 'yellow',
            bgColor: 'green'
          },
          mainHeader: {
            bg: 'bg1'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      LineUp: {
        screen: LineUp,
        params: {
          title: {
            text: 'Line Up',
            fontColor: '#7bc19e',
            bgColor: 'rgb(254, 236, 116)',
            bgBack: '#7bc19e',
            colorBack: '#ffe958'
          },
          mainHeader: {
            bg: 'bg4'
          },
          subHeader: {
            bg: 'circ4'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Schedule: {
        screen: Schedule,
        params: {
          title: {
            text: 'Schedule',
            fontColor: '#FEEC59',
            bgColor: '#90B878',
            bgBack: '#189AA8',
            colorBack: '#FEED59'
          },
          mainHeader: {
            bg: 'bg2'
          },
          subHeader: {
            bg: 'circ7'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Balance: {
        screen: Balance,
        params: {
          title: {
            text: 'Balance',
            fontColor: '#FFEC59',
            bgColor: '#FBBC78',
            colorBack: '#FFEC59',
            bgBack: '#189AA8'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ5'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Media: {
        screen: Media,
        params: {
          title: {
            text: 'Media',
            fontColor: 'yellow',
            bgColor: 'rgb(242,132,181)',
            colorBack: '#ffec59',
            bgBack: '#189aa9'
          },
          mainHeader: {
            bg: 'bg2b'
          },
          subHeader: {
            bg: 'circb'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Discover: {
        screen: Discover,
        params: {
          title: {
            text: 'Discover',
            fontColor: '#ffec59',
            bgColor: 'rgb(237,126,114)',
            bgBack: '#189aa9',
            colorBack: '#ffe958'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ2'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Info: {
        screen: Info,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: 'rgb(142,201,174)',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg5'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      safety: {
        screen: Safety,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      rules: {
        screen: Rules,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      policies: {
        screen: Policies,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      faqs: {
        screen: FQAs,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      partners: {
        screen: Partners,
        params: {
          title: {
            text: 'Info',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      bus_routes: {
        screen: BusRoutes,
        params: {
          title: {
            text: 'Bus Routes',
            fontColor: '#ffec59',
            bgColor: '#7bc19e',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg1'
          },
          subHeader: {
            bg: 'circ3'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Profile: {
        screen: ProfileScreen,
        params: {
          title: {
            text: 'Your pass',
            fontColor: '#7bc19e',
            bgColor: '#ffe958',
            bgBack: '#7bc19e',
            colorBack: '#ffe958'
          },
          mainHeader: {
            bg: 'bg4'
          },
          subHeader: {
            bg: 'circ4'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      Activation1: {
        screen: Activation1,
        params: {
          title: {
            text: 'Activation',
            fontColor: 'yellow',
            bgColor: '#e9665d',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg2b'
          },
          subHeader: {
            bg: 'circ2'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      ConfirmActivation: {
        screen: ConfirmActivation,
        params: {
          title: {
            text: 'Activation',
            fontColor: 'yellow',
            bgColor: '#e9665d',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg2'
          },
          subHeader: {
            bg: 'circ2'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      DataActivation: {
        screen: DataActivation,
        params: {
          title: {
            text: 'Activation',
            fontColor: 'yellow',
            bgColor: '#e9665d',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg2'
          },
          subHeader: {
            bg: 'circ2'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      },
      CamPage: {
        screen: CameraPage,
        params: {
          title: {
            text: 'Camera',
            fontColor: 'yellow',
            bgColor: '#e9665d',
            bgBack: '#189aa9',
            colorBack: '#ffec59'
          },
          mainHeader: {
            bg: 'bg2'
          },
          subHeader: {
            bg: 'circ2'
          }
        },
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null
        })
      }
    },
    {
      initialRouteName: 'Loading',
      mode: 'card',
      navigationOptions: {
        animationEnabled: true
      }
    }
  )
);
