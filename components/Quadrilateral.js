import React from 'react';
import {
    View,
    ImageBackground,
} from 'react-native';
import Layout from '../constants/Layout';

export default class Quadrilateral extends React.Component{
    render(){
        return (
            <View style={{
                width: '100%',
                height: 0,
                borderLeftColor: this.props.color || 'green',
                borderLeftWidth: Layout.window.width,
                borderTopWidth: 20,
                borderBottomWidth: 0,
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
            }} />
        )
    }
}