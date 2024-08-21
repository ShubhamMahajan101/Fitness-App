import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import { it } from 'node:test'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import BottomTab from '../Components/BottomTab'

const data = [
    {
        id: 1,
        image: localimag.icon_ractangle,
        number: "99/100"
    },
    {
        id: 2,
        image: localimag.icon_ractangle,
        number: "49/50"
    },
    {
        id: 21,
        image: localimag.icon_ractangle,
        number: "8/10"
    },
]


const DailyworkoutCompleted = ({ navigation }) => {

    const [userName, setUserName] = useState("Ac")
    const isFocused = useIsFocused();
    const [liveList, setLiveList] = useState([])


    useEffect(() => {
        _GetTodayBadgeApiCalling()
        CheckUserStatus({navigation})
    }, [isFocused])


    const _GetTodayBadgeApiCalling = async () => {
        let UserData   = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        
        setUserName(formattedName)

        global.props.showLoader();
        let apiUrl = appBaseUrl.GetTodayBadgeUrl;

        var postData = JSON.stringify({
            customerId: UserData._id,
        });

    
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
              
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    //   setVideoList(ResponseData.getVideoUrlsByChallengeId)
                    setLiveList(response.data.getAllChallengeByCustomerId)

                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
              
                // Handle errors
            });
    }


    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation} secondImage={userName}></Header>
            <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
                <Text style={styles.workOuttxt}>{Lang_chg.workoutCompletedForToday}</Text>
                <Text style={styles.daysAchieveTxt}>{Lang_chg.daysToachieve}</Text>

                <ScrollView
                    contentContainerStyle={{  paddingBottom: mobileH * 15 / 100 }}
                >


                {/*  flat list open */}
                {
                    liveList <= 0 ?
                        <Text style={[styles.pullText, { paddingVertical: mobileW * 18 / 100 }]}>No Challenge Found</Text>
                        :
                        <FlatList
                            data={liveList}
                            numColumns={2}
                            renderItem={({ item, index }) =>
                                <View style={styles.flatListView}>
                                    <ImageBackground imageStyle={styles.blurImage}
                                        resizeMode="contain" style={styles.blurImage} source={localimag.icon_ractangle}>
                                        <Text style={styles.number}>{item.startDay + "/" + item.dayCount}</Text>
                                    </ImageBackground>
                                </View>
                            } />

                }
                {/*  flat list close */}

                <Text style={styles.yourAthletetxt}>{Lang_chg.yourAthleteBadgesAreOne}</Text>
                {/* button */}
                <TouchableOpacity onPress={() => navigation.replace("DailyexerciseList", { isNextChallenge: true })} style={styles.readyButton}>
                    <Text style={styles.readyTxt}>{Lang_chg.readyFor}</Text>
                </TouchableOpacity>
                {/* button */}
                </ScrollView>

            </View>

            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>

        </View>
    )
}
export default DailyworkoutCompleted;
const styles = StyleSheet.create({
    workOuttxt: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 4.9 / 100,
        textAlign: "center",
        width: mobileW * 48 / 100,
        marginTop: mobileW * 8 / 100,
        alignSelf: 'center',
        lineHeight: mobileW * 7 / 100

    },
    readyButton: {
        backgroundColor: Colors.orangeColor,
        width: mobileW * 87 / 100,
        height: mobileW * 10.58 / 100,
        borderRadius: mobileW * 3 / 100,
        marginBottom: mobileW * 5 / 100,
        alignSelf: 'center',
        justifyContent: "center",
        bottom: 8

    },
    yourAthletetxt: {
        color: Colors.orangeColor,
        textAlign: "center",
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 4.4 / 100,
        width: mobileW * 55 / 100,
        alignSelf: 'center',
        marginBottom: mobileW * 11 / 100,
        lineHeight: mobileW * 6 / 100
    },
    number: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 5.7 / 100,
    },
    daysAchieveTxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.4 / 100,
        textAlign: "center",
        marginTop: mobileW * 9 / 100
    },
    readyTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.5 / 100,
        textAlign: "center",
        alignSelf: 'center'
    },
    blurImage: {
        width: mobileW * 36 / 100,
        height: mobileW * 36 / 100,
        margin: mobileW * 1 / 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatListView: {
        left: mobileW * 11 / 100,
        marginTop: mobileW * 3 / 100,
    },
    pullText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100
    },

})