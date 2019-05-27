/**
 * The boxes component in the Home page.
 */

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ListView, Image} from 'react-native';
import Assets from '../constants/Assets';
import { Label } from './Label';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Quadrilateral from './Quadrilateral';

import { NewsDB } from '../Config/DB/index';

export class News extends React.Component{
    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            mlist: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            dataSource: ds.cloneWithRows([
                {
                    image: "https://cdn.baeblemusic.com/images/bblog/3-21-2017/ed_sheeranblog-580.jpg",
                    date: Date.now(),
                    text: "Welcome in the festival, have a good time. you are welcom because the first news"
                },
                {
                    image: "https://cdn.baeblemusic.com/images/bblog/3-21-2017/ed_sheeranblog-580.jpg",
                    date: Date.now(),
                    text: "Welcome in the festival, have a good time"
                }
            ]),
        };
    }
    async componentDidMount(){
        let news = await NewsDB.Get();
        console.log("The news: ", news);
    }
    renderRowNews(row, index){
        let _Date_ = new Date(row.date);
        return (
            <View style={styles.newsBox}>
                <View style={styles.dateLabel}>
                    <Text style={styles.dateLabelText}>{`${_Date_.getDay()} ${this.state.mlist[_Date_.getMonth()]}`}</Text>
                </View>
                <Image source={{uri: row.image}} style={styles.newsImage} />
                <View >
                    <View style={styles.quaStyleContainer}>
                        <Quadrilateral color={Colors.newsFooterBG} />
                    </View>
                    <View style={styles.newsFooter}>
                        <Text style={styles.newsFooterText}>{row.text}</Text>
                    </View>
                </View>
               
            </View>
        )
    }
    render(){
        return (
            <View style={styles.container}>
                {/**News header section */}
                <ImageBackground source={Assets.circ1} resizeMode="repeat" style={styles.sectionHeaderContainer} >
                    <View style={{
                        width: '100%', 
                        height: '90%',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: '5%'
                    }}>
                        <Label title={{
                            bgColor: 'green',
                            fontColor: "#fff",
                            text: "Our News"
                        }}></Label>
                    </View>
                </ImageBackground>
                <View style={{flex: 1}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRowNews.bind(this)}
                    ></ListView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    },
    sectionHeaderContainer: {
        width: '100%',
        height: 50
    },
    newsBox: {
        width: '100%',
        backgroundColor: 'gray',
        flex: 1,
        position: 'relative'
    },
    newsImage: {
        width: '100%',
        height: Layout.window.width,
    },
    dateLabel: {
        position: 'absolute',
        right: 0,
        top: 40,
        zIndex: 99,
        padding: 5,
        backgroundColor: Colors.newsLabelBG
    },
    dateLabelText: {
        color: Colors.newsLabelFontColor
    },
    newsFooter: {
        width: '100%',
        padding: 20,
        paddingTop: 10,
        backgroundColor: Colors.newsFooterBG
    },
    newsFooterText: {
        color: Colors.newsFooterText
    },
    quaStyleContainer: {
        marginTop: -20,
    }
})