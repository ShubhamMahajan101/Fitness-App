

import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Platform, Alert, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW, msgProvider } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import BottomTab from '../Components/BottomTab'

// const data = [
//     {
//         id: 1,
//         image: localimag.icon_time_white,
//         strength: 'Strength',
//         elite: 'ELITE',
//         Pushup: '50 PULL UPS',
//         days: '100 days',
//         Everyday: 'Everyday for',
//         isEnabled: false
//     },
//     {
//         id: 2,
//         image: localimag.icon_time_white,
//         strength: 'Strength',
//         elite: 'ELITE',
//         Pushup: '50 PULL UPS',
//         days: '100 days',
//         Everyday: 'Everyday for',
//         isEnabled: false
//     },
//     {
//         id: 3,
//         image: localimag.icon_time_white,
//         strength: 'Strength',
//         elite: 'ELITE',
//         Pushup: '50 PULL UPS',
//         days: '100 days',
//         Everyday: 'Everyday for',
//         isEnabled: false
//     },
//     {
//         id: 4,
//         image: localimag.icon_time_white,
//         strength: 'Strength',
//         elite: 'ELITE',
//         Pushup: '50 PULL UPS',
//         days: '100 days',
//         Everyday: 'Everyday for',
//         isEnabled: false
//     },
//     {
//         id: 5,
//         image: localimag.icon_time_white,
//         strength: 'Strength',
//         elite: 'ELITE',
//         Pushup: '50 PULL UPS',
//         days: '100 days',
//         Everyday: 'Everyday for',
//         isEnabled: false
//     },
// ]








const ExerciseList = ({ navigation }) => {
    const [addcard, setaddcard] = useState()
    const [text, settext] = useState()
    const [timermodal, settimermodal] = useState(false)
    const [count, setCount] = useState('0')
    const [secondCount, setsecondCount] = useState('0')
    const [amdata, setamdata] = useState('am')
    const [user_id, setuser_id] = useState(0)
    const [data, setData] = useState([])
    const [userName, setUserName] = useState("Ac")
    const [itemData, setItem] = useState("")

    const isFocused = useIsFocused();
    useEffect(() => {

        global.props.hideLoader();
        CheckUserStatus({ navigation })
        _GetListApiCalling()
    }, [isFocused])


    const _GetListApiCalling = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setuser_id(UserData._id)

        global.props.hideLoader();
        let apiUrl = appBaseUrl.GetExerciseListUrl;

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
                console.log("ExerciseResponse---222>", response.data);
                global.props.hideLoader();
                if (response.data.ErrorCode == "200") {
                    setData(response.data.getCreatedChallengeByCustomerId)
                } else {
                    // Alert.alert("Exercise List", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('completestatusApi---22', error);
                // Handle errors
            });
    }


    const _CompleteStatusSentApiCalling = async () => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.CompleteStatusSendUrl;

        var postData = JSON.stringify({
            customerId: user_id,
        });
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("CompleteStatusApi--->222", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    navigation.navigate('DailyexerciseList')

                } else {

                    Alert.alert("Exercise List", response.data.ErrorMessage);
                    global.props.hideLoader();
                    navigation.navigate('DailyexerciseList')
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('completestatusApi---22', error);
                // Handle errors
            });

    }



    const _SetTimeApiCalling = async () => {
        // global.props.showLoader();

        if (count == 0) {
            msgProvider.toast("Please enter hours greater then zero", 'bottom')
            return false
        }

        if (count > 12) {
            msgProvider.toast('Please enter valid time', 'bottom')
            return false
        }

        if (secondCount > 60) {
            msgProvider.toast('Please enter valid time', 'bottom')
            return false
        }

        let apiUrl = appBaseUrl.SetTimeChallengeUrl;

        var data = count
        var data1 = secondCount

        if (data == '') {
            data = '00'
        }

        if (data < 9) {
            formatHours(count)
        }

        if (data1 == '') {
            data1 = '00'
        }

        if (data1 < 9) {
            formatMinutes(secondCount)
        }

        console.log(data, '----------------', data1);

        var postData = JSON.stringify({
            alertClockTime: data + ":" + data1 + " " + amdata,
            // alertClockTime: formatHours(count) + ":" + formatMinutes(secondCount) + " " + amdata,
            challengeId: itemData._id,
        });

        console.log(formatHours(count) + ":" + formatMinutes(secondCount));


        console.log("alertClockTimeForTime", postData);
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("SetTimeApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    settimermodal(false)
                    _GetListApiCalling()


                } else {
                    Alert.alert("Set Time", response.data.ErrorMessage);
                    global.props.hideLoader();
                    settimermodal(false)
                }
            })
            .catch(error => {
                global.props.hideLoader();
                settimermodal(false)
                console.log('Set Time Api---error', error);
                // Handle errors
            });
    }



    const _RemoveApiCalling = async () => {
        // global.props.showLoader();
        let apiUrl = appBaseUrl.RemoveTimeChallengeUrl;

        var postData = JSON.stringify({
            challengeId: itemData._id,
        });
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("RemoveTimeApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {
                    // global.props.hideLoader();
                    var ResponseData = response.data

                    _GetListApiCalling()
                    setCount(0)
                    setsecondCount(0)

                } else {

                    Alert.alert("Remove Time", response.data.ErrorMessage);
                    // global.props.hideLoader();
                }
            })
            .catch(error => {
                // global.props.hideLoader();
                console.log('Remove Time Api---error', error);
                // Handle errors
            });

    }

    const convertTo12HourFormat = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(":");
        let period = 'am';

        if (parseInt(hours) >= 12) {
            period = 'pm';
            if (parseInt(hours) > 12) {
                hours = (parseInt(hours) - 12).toString();
            }
        }
        // setCount(hours)
        // setsecondCount(minutes)
        // setamdata(period)

        hours == '' ? setCount(0) : hours < 10 ? setCount('0' + parseInt(hours.substring(1))) : parseInt(setCount(hours))
        minutes == null ? setsecondCount(0) : minutes < 10 ? setsecondCount('0' + parseInt(minutes.substring(1))) : parseInt(setsecondCount(minutes))

        setamdata(period)
        // return `${hours}:${minutes}:${seconds} ${period}`;
    };

    const setFormateTime = (item) => {
        item.setAlertTime ? item.alertClockTime.toUpperCase() : item.alertInternationalTime
        if (item.setAlertTime) {
            const [hours, minutes, period] = item.alertClockTime.split(/:|(?=[apAP][Mm])/);

            // console.log("hours ", hours + " minutes " + minutes + " period " + period)

            hours == '' ? setCount(0) : hours < 10 ? setCount('0' + parseInt(hours.substring(1))) : parseInt(setCount(hours))
            minutes == null ? setsecondCount(0) : minutes < 10 ? setsecondCount('0' + parseInt(minutes.substring(1))) : parseInt(setsecondCount(minutes))

            setamdata(period)


        } else {
            convertTo12HourFormat(item.alertInternationalTime)
        }
    }



    const formatHours = (hours) => {
        return `${hours < 10 ? 0 : ''}${hours}`;
    };

    const formatMinutes = (minutes) => {
        return `${minutes < 10 ? 0 : ''}${minutes}`;
    };

    // To set data Count 
    // const TosetCountValue = (txt) => {
    //     if (Number(txt) == '00') {
    //         setCount('')
    //     } else {
    //         setCount(Number(txt) < 10 ? '0' + Number(txt) : Number(txt))
    //     }
    // }

    // const TosetSecondCountValue = (txt) => {
    //     if (Number(txt) == '00') {
    //         setsecondCount('')
    //     } else {
    //         setsecondCount(Number(txt) < 10 ? '0' + Number(txt) : Number(txt))
    //     }
    // }

    // To set data Count 
    const TosetCountValue = (txt) => {
        if (Number(txt) == '00') {
            setCount('')
        } else {
            setCount(Number(txt) < 10 ? '0' + Number(txt) : Number(txt))
        }
    }

    const TosetSecondCountValue = (txt) => {
        if (Number(txt) == '00') {
            setsecondCount('')
        } else {
            setsecondCount(Number(txt) < 10 ? '0' + Number(txt) : Number(txt))
        }
    }

    const incrementValue = () => {
        let numericValue = parseInt(count, 10);
        numericValue += 1;
        if (numericValue < 10) {
            setCount(`0${numericValue.toString()}`);
        } else {
            setCount(numericValue.toString());
        }
    };

    const decrementValue = () => {
        let numericValue = parseInt(count, 10);
        numericValue -= 1;
        if (numericValue < 10) {
            setCount(`0${numericValue.toString()}`);
        } else {
            setCount(numericValue.toString());
        }
    };
    const incrementValueSecondCount = () => {
        let numericValue = parseInt(secondCount, 10);
        numericValue += 1;
        if (numericValue < 10) {
            setsecondCount(`0${numericValue.toString()}`);
        } else {
            setsecondCount(numericValue.toString());
        }
    };

    const decrementValueSecondCount = () => {
        let numericValue = parseInt(secondCount, 10);
        numericValue -= 1;
        if (numericValue < 10) {
            setsecondCount(`0${numericValue.toString()}`);
        } else {
            setsecondCount(numericValue.toString());
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <Header navigation={navigation} title={Lang_chg.exerciseList} secondImage={userName}></Header>
                <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
                    {/*  modal open */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={timermodal}
                        onRequestClose={() => {
                            settimermodal(!timermodal);
                        }}>
                        <ScrollView contentContainerStyle={styles.modalBackgroundcolor}>
                            <View style={styles.modalCard}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => settimermodal(false)}>
                                    <Image style={styles.crossImage} source={localimag.icon_close} />
                                </TouchableOpacity>
                                <Text style={styles.startTimetxt}>{Lang_chg.setStartingTime}</Text>

                                <View style={styles.boxManage}>
                                    <View style={styles.dropdowmView}>

                                        {/*  increse count 12 hour  */}

                                        <TouchableOpacity style={styles.touch}
                                            onPress={() => incrementValue()}>
                                            {/* onPress={() => setCount(Number(count) >= 0 ? Number(count) + 1 : 0)}> */}
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_up}></Image>
                                        </TouchableOpacity>
                                        <View style={styles.boxView}>
                                            <TextInput
                                                maxLength={3}
                                                value={count == '0' ? '0' + count : count + ''}
                                                // placeholder={count}
                                                keyboardType='number-pad'
                                                onChangeText={(txt) => { TosetCountValue(txt) }}
                                                style={styles.timerText}
                                            ></TextInput>
                                            {/* <Text style={styles.timerText}>{formatHours(count)}</Text> */}
                                        </View>

                                        {/*  decrese count 12 hour   */}

                                        <TouchableOpacity style={styles.touch}
                                            // onPress={() => setCount(Number(count) > 0 ? Number(count) - 1 : 0)}>
                                            onPress={() => decrementValue()}>
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_down}></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: mobileW * 18 / 100, alignItems: 'center' }}>

                                        {/* increse second count   */}

                                        <TouchableOpacity style={styles.touch}
                                            onPress={() => incrementValueSecondCount()}>
                                            {/* onPress={() => setsecondCount(Number(secondCount) >= 0 ? Number(secondCount) + 1 : 0)}> */}
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_up}></Image>
                                        </TouchableOpacity>
                                        <View style={styles.boxView}>
                                            <TextInput
                                                maxLength={3}
                                                keyboardType='number-pad'
                                                value={secondCount == '0' ? '0' + secondCount : secondCount + ''}
                                                // value={secondCount + ''}
                                                // placeholder={count}
                                                onChangeText={(txt) => { TosetSecondCountValue(txt) }}
                                                style={styles.timerText}
                                            ></TextInput>
                                            {/* <Text style={styles.timerText}>{formatMinutes(secondCount)}</Text> */}
                                        </View>

                                        {/* decrese second count */}

                                        <TouchableOpacity style={styles.touch}
                                            onPress={() => decrementValueSecondCount()}>
                                            {/* onPress={() => setsecondCount(Number(secondCount) > 0 ? Number(secondCount) - 1 : 0)}> */}
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_down}></Image>
                                        </TouchableOpacity>
                                    </View>

                                    {/*  choose am button */}

                                    <View style={{ width: mobileW * 18 / 100, alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.touch} onPress={() => setamdata(amdata ? "am" : "pm")}>
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_up}></Image>
                                        </TouchableOpacity>
                                        <View style={styles.boxView}>
                                            <Text style={styles.timerText}>{amdata}</Text>
                                        </View>

                                        {/*  choose pm button */}


                                        <TouchableOpacity style={styles.touch} onPress={() => setamdata(amdata ? "pm" : "am")}>
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_down}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                {/*  confirm button */}

                                <TouchableOpacity onPress={() => { _SetTimeApiCalling() }} style={styles.modalButton}>
                                    <Text style={styles.confirnTxt}>{Lang_chg.confirm}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { _RemoveApiCalling(), settimermodal(false) }}>
                                    <Text style={styles.removeText}>{Lang_chg.removeStartingTime}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Modal>
                    <Text style={styles.challengesText}>{Lang_chg.yourChallenges}</Text>

                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: mobileH * 15 / 100 }}>

                            {/*  modal close */}

                            {/*  flatlist open */}

                            {
                                data <= 0 && data == '' ?
                                    <Text style={[styles.pullText, { paddingVertical: mobileW * 18 / 100 }]}>No Challenge Found</Text>
                                    :
                                    <FlatList
                                        data={data}
                                        renderItem={({ item, index }) =>
                                            <View style={styles.cardView}>
                                                <View style={styles.textView}>
                                                    <TouchableOpacity >
                                                        <Text style={styles.strengthText}>{item.exercises.exerciseTypes.name}</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.eliteText}>{ }</Text>
                                                    <TouchableOpacity>
                                                        <Text style={styles.eliteText}>{item.levels.name}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    {/* <Text style={styles.pullText}>{item.exerciseCount + " " + item.exercises.name}</Text> */}
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.pullText}>{item.exerciseCount} </Text>
                                                        {item.exerciseUnits != null &&
                                                            <Text style={styles.pullText}>{item.exerciseUnits.name} </Text>}
                                                        <Text style={styles.pullText}>{item.exercises.name}</Text>
                                                    </View>
                                                    <Text style={styles.everyTxt}>{"Every" + item.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                                    <Text style={styles.daysTxt}>{item.dayCount + " " + item.exerciseDurations.name}</Text>
                                                </View>
                                                {/* <TouchableOpacity style={styles.watchIcon} activeOpacity={0.8}
                                        onPress={() => { setItem(item), settimermodal(true) }}>
                                        <Image style={styles.watchIcon} source={localimag.icon_time_white} />
                                    </TouchableOpacity> */}
                                                {/* <View style={styles.timeView}>
                                        <Text style={styles.timerTxt}>{item.setAlertTime ? item.alertInternationalTime : item.alertClockTime}</Text>
                                      
                                    </View>  */}

                                                <View style={styles.timeView}>
                                                    <Text style={styles.timerTxt}>{item.setAlertTime ? item.alertClockTime.toUpperCase() : item.alertInternationalTime}</Text>

                                                    <TouchableOpacity activeOpacity={0.8} onPress={() => { setFormateTime(item), setItem(item), settimermodal(true) }}>
                                                        <Image style={styles.watchIcon} source={localimag.icon_time_white} />
                                                    </TouchableOpacity>
                                                </View>

                                            </View>

                                        }
                                    />
                            }

                            {/* flat list close */}

                            <View style={styles.CommonButton} >
                                <CommonButton
                                    onPressClick={() => {
                                        navigation.navigate('Home')
                                    }}
                                    navigation={navigation} ScreenName={'AddChallenges'} title={Lang_chg.addAnotherChallenge}></CommonButton>
                            </View>

                        </ScrollView>

                    </View>

                    <Image style={styles.roundImage} source={localimag.round_shape} />
                    <View style={styles.completeButton}>
                        <SmallButton onPressClick={() => {
                            _CompleteStatusSentApiCalling()
                        }} navigation={navigation} screenName={'DailyexerciseList'} ></SmallButton>
                    </View>


                </View>
            </ScrollView>

            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>

        </View>
    )
}
export default ExerciseList;
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

    modalBoxview: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginTop: mobileW * 1 / 100,
        marginBottom: mobileW * 1 / 100,



    },
    boxManage: {
        width: mobileW * 75 / 100,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginTop: mobileW * 3 / 100,
        right: mobileW * 2 / 100
    },
    confirnTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 4 / 100,
        textAlign: 'center',


    },
    timerTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.8 / 100,
        right: mobileW * 5 / 100,
        alignSelf: 'center'
    },
    timeView: {
        flexDirection: 'row',
        alignItems: "center",
        position: "absolute",
        bottom: 10,
        right: 5
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
    touch: {
        width: mobileW * 5 / 100, justifyContent: "center", alignItems: "center",
        paddingVertical: mobileW * 0.5 / 100,
        // backgroundColor:"red"
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
        color: Colors.lightAccent,
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
        width: mobileW * 90 / 100,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.mediumDarkGrey,
        height: mobileW * 45 / 100,
        borderRadius: mobileW * 3.4 / 100,
        padding: mobileW * 2 / 100,
        backgroundColor: Colors.blackColor,
        marginTop: mobileW * 5 / 100,
        alignSelf: 'center',
    },
    challengesText: {
        textAlign: "center",
        fontFamily: Font.FontRegularFono,
        color: Colors.orangeColor,
        fontSize: mobileW * 4 / 100,
        marginTop: mobileW * 5 / 100
    },
    // watchIcon: {
    //     width: mobileW * 6.7 / 100,
    //     height: mobileW * 6.7 / 100,
    //     position: "absolute",
    //     bottom: mobileW * 2 / 100,
    //     right: mobileW * 2 / 100,
    //     alignItems: "center",
    //     alignSelf: "center",


    // },
    watchIcon: {
        width: mobileW * 6.5 / 100,
        height: mobileW * 6.5 / 100,
        alignSelf: "flex-end",
        right: mobileW * 3 / 100,


    },
    CommonButton: {
        marginTop: mobileW * 6 / 100
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: mobileW * 2.2 / 100,
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
        marginTop: mobileW * 2 / 100
    },
    everyTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.8 / 100,
        marginTop: mobileW * 2 / 100
    },
    timerText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 4 / 100,
        textAlign: "center",
        alignSelf: 'center',

    }


})