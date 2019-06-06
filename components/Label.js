import React from 'react';
import {
    View,
    Text
} from 'react-native';

import * as GStyles from '../styles';
import * as layout from '../constants/Layout';

export class Label extends React.Component{
    render(){
        let {title, text} = this.props;
        title.text = title.text.toUpperCase();
        text = text ?  text.toUpperCase() : text;
        const fontSize = title.fontSize ? title.fontSize : layout.default.labelTextSize;
        return (
            <View style={[GStyles.default.pageTitleBox, GStyles.default.LabelsPaddings, {backgroundColor: title.bgColor}]}>
                <Text style={[GStyles.default.headerText, {color: title.fontColor || '#000', fontSize: fontSize}]}>
                    {text ? text : title.text}
                </Text>
            </View>
        )
    }
}