

import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ScrollView, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import LinearGradient from 'react-native-linear-gradient'
import { useIsFocused, useRoute } from '@react-navigation/native'
import moment from 'moment'
import axios from 'axios'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import BottomTab from '../Components/BottomTab'
import zone from 'moment-timezone';

const data = [
    { isEnabled: true }, { isEnabled: true }, { isEnabled: true }, { isEnabled: true }, { isEnabled: true },
    { isEnabled: true }, { isEnabled: true }, { isEnabled: true }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false }, { isEnabled: false },
    { isEnabled: false }, { isEnabled: false }
]
const ChallengeRecords = ({ navigation }) => {

    const [userName, setUserName] = useState("Ac")
    const [userId, setUserId] = useState("")
    const [date, setDate] = useState(new Date("DD-MM-YYYY"))

    const route = useRoute()
    const recordData = route.params?.recordData
    const ChallengeTime = route.params?.ChallengeTime
    const IsTomorrow = route.params?.IsTomorrow
    const [timeZone, setTimeZone] = useState("")

    console.log("recordDataChallenge==>RRRR", recordData);
    const isFocused = useIsFocused();

    useEffect(() => {
        const currentTimeZone = zone.tz.guess();
        console.log('Current Time Zone YNEW:', currentTimeZone);
        setTimeZone(currentTimeZone)
      }, []);

    const currentDate = new Date();
    let previousDate = recordData != ''
        && recordData.endDate;


    console.log("previousDate==>", previousDate);
    const targetDate = new Date(previousDate);
    const isTodayEqualTarget = (
        currentDate.getFullYear() === targetDate.getFullYear() &&
        currentDate.getMonth() === targetDate.getMonth() &&
        currentDate.getDate() === targetDate.getDate()
    );


    // Filter the array based on status
    const upcomingExercises = recordData != ''
        && recordData.customerDayWiseExercises.filter(
            exercise => exercise.status === 'Complete'
        );

    // Get the count of upcoming exercises
    const upcomingCount = upcomingExercises.length;

    console.log("upcomingCount==>", upcomingCount);
    //   };
   
    let listLength = recordData.customerDayWiseExercises != '' && parseInt(recordData.customerDayWiseExercises.length);

    let isEndVisible = false;
 
    for (let i = 1; i <= listLength; i++) {
      const result = 7 * i - 1;
      if (result == listLength) {
        isEndVisible = true;
      }
    }

    useEffect(() => {
        getUserData()
        CheckUserStatus({ navigation })
        // global.props.hideLoader();
    }, [isFocused])

    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setUserId(UserData._id)
        // listLength = recordData.customerDayWiseExercises.length;
        // console.log("listLength----->New", listLength);
    }


    const _ClaimApiCalling = async () => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.ClaimBadgeChallengeUrl;

        var postData = JSON.stringify({
            challengeId: recordData._id,
            customerId: userId
        });

        console.log("postDataForclaim==>", postData)
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("ClaimBadgeApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    navigation.replace('EarnedBades', { recordData: recordData, responseData: response.data })
                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('Remove Badge Api---error', error);
                // Handle errors
            });

    }


    // Define a separate component for your footer
    const FooterComponent = ({ previousDate }) => {
        return (
            listLength % 7 === 0 || listLength % 6 === 0 || isEndVisible?
            <View style={{ alignItems: "flex-end", marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
                <View style={{ width: mobileW * 16 / 100 }}>
                    <Text style={styles.DateTxt}>End Date</Text>
                    <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(previousDate).format("DD-MM-YYYY")}</Text>
                </View>
            </View>
            :null
        );
    };

    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation}  title={Lang_chg.challengeRecords} secondImage={userName} navigateHome={"Home"}></Header>
            <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: mobileH * 40 / 100, height: Platform.OS == "ios" ? mobileH * 72 / 100 : mobileH * 77 / 100 }}
                >
                    <View
                        style={{ marginTop: mobileH * 5 / 100 }}
                        activeOpacity={0.8} >

                        <LinearGradient
                            colors={['#EB6519', Colors.blackColor,]}
                            style={{ width: mobileW * 90 / 100, height: mobileW * 49.8 / 100, marginTop: mobileW * 3 / 100, alignSelf: 'center', borderRadius: mobileW * 4 / 100, justifyContent: 'center', alignItems: 'center' }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.1, y: 1 }}
                        >
                            <View style={{ width: mobileW * 89 / 100, height: mobileW * 49 / 100, borderRadius: mobileW * 3 / 100, backgroundColor: Colors.blackColor, padding: mobileW * 1 / 100 }}>

                                <View style={styles.textView}>
                                    <TouchableOpacity >
                                        <Text style={styles.strengthText}>{recordData.exercises.exerciseTypes.name}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.eliteText}>{ }</Text>

                                    {/* <Text style={styles.strengthText}>02-09-2023</Text> */}

                                    <TouchableOpacity>
                                        <Text style={styles.eliteText}>{recordData.levels.name}</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <Text style={styles.pullText}>{recordData.exerciseCount} </Text>
                                    {recordData.exerciseUnits != null &&
                                        <Text style={styles.pullText}>{recordData.exerciseUnits.name} </Text>}
                                    <Text style={styles.pullText}>{recordData.exercises.name}</Text>
                                </View>
                                {/* <Text style={styles.pullText}>{recordData.exerciseCount + " " + recordData.exercises.name}</Text> */}
                                <Text style={styles.everyTxt}>{"Every" + recordData.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                <Text style={styles.daysTxt}>{recordData.dayCount + " " + recordData.exerciseDurations.name}</Text>
                                <View style={[styles.cardInnerview]}>
                                   
                                    <View
                                        style={[styles.TabInActive,
                                        { borderColor: Colors.orangeColor, backgroundColor: Colors.backgroundcolor }]}>
                                        <Text
                                            style={{
                                                color: Colors.orangeColor,
                                                fontFamily: Font.FontFonoMedium,
                                                fontSize: mobileW * 4 / 100
                                            }}>{"Day " + recordData.startDay + "/" + recordData.dayCount}</Text>
                                    </View>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: "center", justifyContent: "flex-end" }}
                                        activeOpacity={0.8}>
                                        <Text style={styles.timerTxt}>{zone.tz(moment(moment().format(`YYYY-MM-DDT${ChallengeTime}:00.000+0000`)),timeZone).format("hh:mm a")}</Text>
                                        <Image style={styles.watchIcon} source={localimag.icon_time_white} />
                                    </View>
                                </View>
                            </View>

                        </LinearGradient>

                    </View>

                    <View style={{ width: mobileW * 88 / 100, alignSelf: 'center', marginTop: mobileH * 3 / 100 }}>
                       
                        <View style={{ flexDirection: "row", width: mobileW * 88 / 100, justifyContent: "space-between" }}>
                            <View>
                                <Text style={styles.DateTxt}>Start</Text>
                                <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(recordData.startDate).format("DD-MM-YYYY")}</Text>
                            </View>

                            <View>
                                <Text style={styles.DateTxt}>Current Date</Text>
                                <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(new Date()).format("DD-MM-YYYY")}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={recordData.customerDayWiseExercises}
                            numColumns={7}
                            ListFooterComponent={<FooterComponent lastItemText={previousDate} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ justifyContent: "center", paddingBottom: mobileH * 10 / 100 }}
                            renderItem={({ item, index }) =>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{
                                        backgroundColor: '#0000090', borderRadius: mobileW * 5.5 / 100, height: mobileW * 11 / 100,
                                        width: mobileW * 11 / 100, borderWidth: mobileW * 0.1 / 100,
                                        borderColor: Colors.lightAccent, marginRight: mobileW * 1.8 / 100,
                                        marginTop: mobileW * 2 / 100, alignItems: 'center', justifyContent: 'center',
                                    }}>

                                        {
                                            item.status == "Upcomming" ?
                                                null : item.videoUrl == "" && item.status == "Complete"  && item.videoEnum == "withOutVideo"?
                                                    // <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("VideoPlayer", { recordData: recordData, Index: index })} >
                                                    <TouchableOpacity activeOpacity={0.8}  >
                                                        <View
                                                            style={{
                                                                backgroundColor: Colors.lightAccent,
                                                                borderRadius: mobileW * 4.4 / 100,
                                                                height: mobileW * 8.8 / 100, width: mobileW * 8.8 / 100,
                                                                borderWidth: mobileW * 0.5 / 100,
                                                                borderColor: Colors.lightAccent, alignItems: "center",
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Text style={[styles.DateDayTxt]}>{item.exerciseCount}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity activeOpacity={0.8} onPress={() =>{item.videoEnum == "process" ? alert("Please Wait Video is Uploading") : navigation.navigate("VideoPlayer", { recordData: recordData, Index: index })}} >

                                                        <View
                                                            style={{
                                                                backgroundColor: Colors.orangeColor,
                                                                borderRadius: mobileW * 4.4 / 100,
                                                                height: mobileW * 8.8 / 100, width: mobileW * 8.8 / 100,
                                                                borderWidth: mobileW * 0.5 / 100,
                                                                borderColor: Colors.orangeColor, alignItems: "center",
                                                                justifyContent: 'center',
                                                            }}>
                                                            <Text style={[styles.DateDayTxt, { color: Colors.whiteColor }]}>{item.exerciseCount}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                        }


                                    </View>
                                    {listLength % 7 === 0 || listLength % 6 === 0 || isEndVisible? null :
                                    recordData.customerDayWiseExercises.length == item.exerciseCount &&
                                        <View style={{ marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
                                            <Text style={styles.DateTxt}>End Date</Text>
                                            <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(previousDate).format("DD-MM-YYYY")}</Text>
                                        </View>
                                    }


                                </View>
                            } />


                    </View>

                </ScrollView>


                {IsTomorrow == 1 ?
                    <View style={styles.completeButton}>
                        <SmallButton onPressClick={() => {
                            navigation.goBack()
                        }}
                            navigation={navigation}
                            title={"Back to list"}>

                        </SmallButton>
                    </View>
                    :
                    <>
                        <Image style={styles.roundImage} source={localimag.round_shape} />

                        {isTodayEqualTarget ?

                            <View style={styles.completeButton}>
                                <SmallButton onPressClick={() => {
                                    _ClaimApiCalling()
                                }}
                                    navigation={navigation}
                                    title={Lang_chg.claimYourBadge}>

                                </SmallButton>
                            </View>
                            :
                            <View style={styles.completeButton}>
                                <SmallButton onPressClick={() => {
                                    // navigation.navigate('StartChallenge', { isNextChallenge: true })
                                    navigation.navigate('DailyexerciseList')
                                }}
                                    navigation={navigation}
                                    title={Lang_chg.nextChallenge}></SmallButton>
                            </View>
                        }
                    </>
                }

            </View>
            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>

        </View>
    )
}
export default ChallengeRecords;
const styles = StyleSheet.create({
    completeButton: {
        position: "absolute",
        bottom: 43,
        alignSelf: "center"
    },
    dropdowmView:
    {
        width: mobileW * 18 / 100,
        alignItems: 'center'
    },
    timerTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 4 / 100,
        right: mobileW * 6 / 100,
    },
    DateTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 2.6 / 100,
    },
    DateDayTxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3 / 100,
    },
    modalBoxview: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginTop: mobileW * 1 / 100,
        marginBottom: mobileW * 1 / 100,
    },
    TabInActive: {
        width: mobileW * 33 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: mobileW * 9.5 / 100,
        borderRadius: mobileW * 3 / 100,
        borderWidth: mobileW * 0.3 / 100,
        left: mobileW * 3 / 100
    },
    boxManage: {
        width: mobileW * 75 / 100,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginTop: mobileW * 3 / 100,
        right: mobileW * 2 / 100
    },
    confirnTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 4 / 100,
        textAlign: 'center',


    },
    boxView: {
        width: mobileW * 17 / 100,
        height: mobileW * 12 / 100,
        borderColor: Colors.orangeColor,
        borderWidth: mobileW * 0.3 / 100,
        borderRadius: mobileW * 1.5 / 100,
        justifyContent: 'center',
        marginBottom: mobileW * 1 / 100,
        marginTop: mobileW * 1 / 100
    },
    dropdowmImage: {
        width: mobileW * 3 / 100,
        height: mobileW * 3 / 100,
        resizeMode: "contain",


    },
    modalBackgroundcolor: {
        backgroundColor: "#ffffff9f",
        opacity: 20,
        flex: 1,
        elevation: 10,
        overflow: 'hidden',
        shadowColor: Colors.blackColor,
        shadowRadius: 10,
        shadowOpacity: 1,
        justifyContent: "center"

    },
    crossImage: {
        width: mobileW * 4.5 / 100,
        height: mobileW * 4.5 / 100,
        tintColor: Colors.whiteColor,

    },
    modalButton: {
        width: mobileW * 60 / 100,
        height: mobileW * 10 / 100,
        alignSelf: 'center',
        backgroundColor: Colors.orangeColor,
        borderRadius: mobileW * 2.5 / 100,
        justifyContent: 'center',
        marginTop: mobileW * 5 / 100


    },
    removeText: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.5 / 100,
        textAlign: "center",
        marginTop: mobileW * 4 / 100,

    },
    startTimetxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 4 / 100,
        textAlign: 'center',
        marginTop: mobileW * -1.2 / 100

    },
    roundImage: {
        width: mobileW * 110 / 100,
        height: mobileW * 20 / 100,
        position: "absolute",
        bottom: -3,
        alignSelf: 'center'


    },
    daysTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: Platform.OS == "ios" ? mobileW * 3 / 100 : mobileW * 2 / 100
    },
    cardInnerview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Platform.OS == "ios" ? mobileW * 9 / 100 : mobileW * 4 / 100,
    },

    modalCard: {
        //  justifyContent: "center",
        width: mobileW * 77 / 100,
        borderWidth: mobileW * 0.2 / 100,
        height: mobileW * 65 / 100,
        borderRadius: mobileW * 3 / 100,
        padding: mobileW * 3 / 100,
        backgroundColor: Colors.blackColor,
        marginTop: mobileW * 5 / 100,
        alignSelf: 'center',

    },
    cardView: {
        justifyContent: "center",
        width: mobileW * 90 / 100,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.mediumDarkGrey,
        height: mobileW * 45 / 100,
        borderRadius: mobileW * 3.4 / 100,
        padding: mobileW * 3 / 100,
        backgroundColor: Colors.blackColor,
        marginTop: mobileW * 5 / 100,
        alignSelf: 'center',

    },
    challengesText: {
        textAlign: "center",
        fontFamily: Font.FontRegularFono,
        color: Colors.orangeColor,
        fontSize: mobileW * 4 / 100,
        marginTop: mobileW * 35 / 100
    },
    watchIcon: {
        width: mobileW * 6.7 / 100,
        height: mobileW * 6.7 / 100,
        right: mobileW * 4 / 100

    },
    CommonButton: {
        marginTop: mobileW * 6 / 100
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: mobileW * 2 / 100,

    },
    eliteText: {
        color: Colors.orangeColor,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 2.5 / 100,

    },
    strengthText: {
        color: Colors.mediumGreyColor,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 2.5 / 100,
    },
    pullText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: mobileW * 2 / 100,
    },
    everyTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.8 / 100,
        marginTop: mobileW * 2 / 100
    },
    timerText: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 4 / 100,
        textAlign: "center",
        alignSelf: 'center'

    },
    dayTimetxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.8 / 100,
        alignSelf: "center",
        justifyContent: 'center'

    },
})