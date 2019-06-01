import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  rotationHeader: "1deg",
  fixRotationHeader: "-1deg",
  headerAHeight: 70,
  backTextSize: 10,
  labelTextSize: 14,
  underlayColor: 'rgba(0,0,0,.2)',
};
