/**
 * This file should contain all the generic styles for the application including the application assets styles, Views, and scrollViews
 */

import {StyleSheet} from 'react-native';
import * as layout from './constants/Layout';

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        overflow: 'hidden',
    },
    contentContainer:{
        paddingBottom: 100,
    },
    // The headerAContainer is for the main header which is the dots pattern.
    headerAContainer: {
        width: '100%', 
        height: layout.default.headerAHeight, 
        backgroundColor: "white"
    },
    imageBGPatternCurved: {
        width: '100%',
        height: '110%',
    },
    subHeaderContainer: {
        width: '100%',
        height: 60,
        paddingTop: 10,
        backgroundColor: "transparent",
        // transform: [
        //     {rotate: layout.default.rotationHeader}
        // ]
    },
    subHeaderContent: {
        height: '100%',
        width: '100%',
        marginTop: -5,
    },
    subHeaderContentView: {
        flex: 1, 
        width: '100%', 
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: "hidden",
        paddingRight: '5%'
    },
    pageTitleBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(217, 110, 98)'
    },
    LabelsPaddings: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5
    },
    headerText: {
        fontWeight: 'bold',
    },
    backButton: {
        flex: 1,
        position: 'absolute',
        top: layout.default.headerAHeight,
        left: 10,
        justifyContent: 'center',
        alignItems: 'center'
        
    }
})