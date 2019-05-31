/**
 * This file should contain all the generic styles for the application including the application assets styles, Views, and scrollViews
 */

import { StyleSheet } from 'react-native';
import * as layout from './constants/Layout';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  },
  contentContainer: {
    paddingBottom: 100
  },
  // The headerAContainer is for the main header which is the dots pattern.
  headerAContainer: {
    width: '100%',
    height: 40,
    backgroundColor: 'white'
  },
  imageBGPatternCurved: {
    width: '100%',
    height: '110%'
  },
  subHeaderContainer: {
    width: '100%',
    height: 55,
    paddingTop: 12,
    backgroundColor: 'transparent'
    // transform: [
    //     {rotate: layout.default.rotationHeader}
    // ]
  },
  subHeaderContent: {
    height: '100%',
    width: '100%',
    marginTop: -5
  },
  subHeaderContentView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
    transform: [{ skewY: '-1deg' }]
  },
  pageTitleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(217, 110, 98)'
  },
  LabelsPaddings: {
    padding: 3,
    paddingLeft: 6,
    paddingRight: 6
  },
  headerText: {
    fontWeight: 'bold',
    padding: 0
  },
  backButton: {
    flex: 1,
    position: 'absolute',
    top: 40,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  }
});
