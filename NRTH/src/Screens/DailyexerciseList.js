

import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ImageBackground, Platform, Alert, BackHandler, RefreshControl, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW, msgProvider } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import LinearGradient from 'react-native-linear-gradient'
import { ScrollView } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useIsFocused, useRoute } from '@react-navigation/native'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native';
import BottomTab from '../Components/BottomTab'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import moment from 'moment'
import DeviceInfo from 'react-native-device-info';
import zone from 'moment-timezone';

// const SCREEN_WIDTH = Dimensions.get('window').width;


const DailyexerciseList = ({ navigation }) => {
    const route = useRoute()
    const isNextChallenge = route.params?.isNextChallenge
    const [permisionmodal, setpermisionmodal] = useState(false)
    const [swipemodal, setswipemodal] = useState(false)
    const [data, setData] = useState([])
    const [timermodal, settimermodal] = useState(false)
    const [count, setCount] = useState('0')
    const [secondCount, setsecondCount] = useState('0')
    const [amdata, setamdata] = useState('am')
    const [visibleContent, setVisibleContent] = useState(true)
    const [rowVisible, setRowVisible] = useState(false)
    const [userName, setUserName] = useState("Ac")
    const [user_id, setuser_id] = useState(0)
    const [itemData, setItem] = useState("")
    const [itemDeleteIndex, setItemDeleteIndex] = useState(0)
    const [allCompleteChallenge, setAllCompleteChallenge] = useState(0)
    const [tomorrow, setTomorrow] = useState(0)
    const [timeZone, setTimeZone] = useState("")
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    const swipeListViewRef = useRef(null);

    useEffect(() => {
        console.log('swipeListViewRef:', swipeListViewRef);
    }, [swipeListViewRef]);

    useEffect(() => {
        CheckUserStatus({ navigation })
    }, [])


    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setuser_id(UserData._id)
    }

    // itemData.setAlertTime ? itemData.alertClockTime : itemData.alertInternationalTime
    const convertTo12HourFormat = (timeString) => { 
    
    var Date =  zone.tz(moment(moment().format(`YYYY-MM-DDT${timeString}:00.000+0000`)),timeZone).format("hh:mm a")
    console.log("Date===============",Date)
    // const [hours, minutes, seconds] = Date.split(":");
    const [hours, minutes, period] = Date.split(/:|(?=[apAP][Mm])/);

    

    hours == '' ? setCount('00') : hours < 10 ? setCount('0' + parseInt(hours.substring(1))) : parseInt(setCount(hours))
    minutes == null ? setsecondCount('00') : minutes < 10 ? setsecondCount('0' + parseInt(minutes.substring(1))) : parseInt(setsecondCount(minutes))

    setamdata(period)
        
        // return `${hours}:${minutes}:${seconds} ${period}`;
    };

    const setFormateTime = (item) => {


        if((item.setAlertTime==true && item.alertClockTime=="") || (item.setAlertTime==false && item.alertInternationalTime==""))
        {
            setCount('00')
            setsecondCount('00')
            //setamdata(period)

        }else{
            var Date =  item.setAlertTime ?  zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertClockTime}:00.000+0000`)),timeZone).format("hh:mm a"): zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertInternationalTime}:00.000+0000`)),timeZone).format("hh:mm A")
            // var Date = item.setAlertTime ? (item.alertClockTime !=''? zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertClockTime}:00.000+0000`)),timeZone).format("hh:mm a") : '') : (item.alertInternationalTime != ''?  zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertInternationalTime}:00.000+0000`)),timeZone).format("hh:mm a"):'')
            console.log('item.alertClockTime',item.alertClockTime);
            if (item.setAlertTime) {
                const [hours, minutes, period] =  Date.split(/:|(?=[apAP][Mm])/);
    
                console.log("hours ", hours + " minutes " + minutes + " period " + period)
    
                hours == '' ? setCount('00') : hours < 10 ? setCount('0' + parseInt(hours.substring(1))) : parseInt(setCount(hours))
                minutes == null ? setsecondCount('00') : minutes < 10 ? setsecondCount('0' + parseInt(minutes.substring(1))) : parseInt(setsecondCount(minutes))
    
                setamdata(period)
    
    
            } 
            
            else {
                convertTo12HourFormat(item.alertInternationalTime)
            }

        }
       
    }

    useEffect(() => {
        _GetListApiCalling()
       

    }, [])

   

    useEffect(() => {
        _GetListApiCalling()
       

        setTimeout(() => {
            setRefreshing(false);
        }, 5000);

    }, [isFocused])

    useFocusEffect(
        React.useCallback(() => {
            const handleBackPress = () => {
                backAction()
                // Handle the back button press on this screen
                return true; // Return true to prevent default behavior (e.g., navigate back)
            };

            BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            };
        }, [])
    );

    const backAction = () => {
        BackHandler.exitApp()
       
        return true;
    }


    const _GetPackageIsExpairApiCalling = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setuser_id(UserData._id)

        getUserData()
        console.log("user_id==>111", UserData._id)

        // global.props.showLoader();

        let apiUrl = appBaseUrl.GetPackageIsExpairedUrl;

        var postData = JSON.stringify({
            customerId: UserData._id,

        });
        console.log("GetPackageIsExpierPostDataMICK==>", postData);
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

                    console.log("GetPackageIsExpierMICK---222>", response.data);

                    // Alert.alert(
                    //     'Package Expired!',
                    //     'Your Subscription Is Expired \n Please Subscriped New Plan', [{
                    //         text: 'No',
                    //         style: 'Yes',
                    //     }, {
                    //         text: 'Yes',
                    //         onPress: () => navigation.navigate("SubscriptionPlanList")
                    //     }], {
                    //     cancelable: false
                    // }
                    // );

                    if (response.data.packageExpier == 1 && response.data.customer.activePlan === "Free") {
                        navigation.navigate("SubscriptionPlanList")
                    } else if (response.data.packageExpier == 1 && response.data.customer.activePlan !== "Free") {
                        Alert.alert(
                            'Package Expired!',
                            'Your Subscription Is Expired \n Please Subscriped New Plan', [{
                                text: 'No',
                                style: 'Yes',
                            }, {
                                text: 'Yes',
                                onPress: () => navigation.navigate("SubscriptionPlanList")
                            }], {
                            cancelable: false
                        }
                        );
                    }else{
                        navigation.navigate('Home')
                    }
                } else {
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('GetPackageIsExpier---333>', error);
                // Handle errors
            });
    }





    const _GetListApiCalling = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setuser_id(UserData._id)
        getUserData();
        console.log("user_id==>222", UserData._id)

        // global.props.showLoader();
        setRefreshing(true);

        let apiUrl = appBaseUrl.DailyExerciseListUrl;

        var postData = JSON.stringify({
            customerId: UserData._id,
            tomorrow: isNextChallenge ? 1 : 0,
            timeZone:zone.tz.guess()            
        });
        console.log("DailyExercisePostData==>", postData);
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly',
            // 'authorization':"Bearer " + UserData.authToken
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("DailyExerciseResponse---222>", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    setRefreshing(false);
                    setAllCompleteChallenge(response.data.allCompleted)
                    setTomorrow(response.data.tomorrow)
                    setData(response.data.getTodayProcessOrRunningChallengeByCustomerId)

                } else {
                    // Alert.alert("Daily Exercise List", response.data.ErrorMessage);
                    global.props.hideLoader();
                    setData([])
                    setRefreshing(false);

                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('Daily Exercise List Api---22', error);
                // Handle errors
            });
    }


    const _CardClickCalling = async (item) => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.DailyExerciseCardClickUrl;

        var postData = JSON.stringify({
            challengeId: item._id,
            timeZone:timeZone
        });

        console.log("CardClickApi--->Request", postData);

        // return false

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("CardClickApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {

                    _GetBadgeDetailsApiCalling(item._id)

                } else {

                    Alert.alert("Daily Exercise List", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('Daily Exercise Api---error', error);
                // Handle errors
            });
    }


    const _GetBadgeDetailsApiCalling = async (ChallengeId) => {
        // global.props.showLoader();
        let apiUrl = appBaseUrl.GetBadgeDetailsUrl;

        var postData = JSON.stringify({
            challengeId: ChallengeId,
            tomorrow: 0,
        });

        console.log("postDataProfile==>", postData)
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("GetBadgeDetailsApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data.getTodayProcessOrRunningChallengeByChallengeId[0]
                    navigation.navigate('StartChallenge', {
                        challengeItem: ResponseData,
                        // ChallengeTime:"05:15 AM"
                        ChallengeTime: ResponseData.setAlertTime ?
                            ResponseData.alertClockTime.toUpperCase()
                            : ResponseData.alertInternationalTime
                    })

                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('BadgeDetailsApi---error', error);
                // Handle errors
            });
    }

    const _SetTimeApiCalling = async () => {

        if (count == 0) {
            msgProvider.toast("Please enter hours greater then zero", 'bottom')
            return false
        }

        if (count > 12) {
            msgProvider.toast('Please enter valid time , HH limit (0-12) and MM limit (0-59).', 'bottom')
            return false
        }

        if (secondCount > 60) {
            msgProvider.toast('Please enter valid time , HH limit (0-12) and MM limit (0-59).', 'bottom')
            return false
        }


        // global.props.showLoader();
        let apiUrl = appBaseUrl.SetTimeChallengeUrl;
        var data = Number(count)
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


       var newSec = data1 == "00" ? "00":formatMinutes(secondCount) 

        console.log(data, '----------------', data1);

        var postData = JSON.stringify({
            // alertClockTime: data + ":" + data1 + " " + amdata,
            alertClockTime: formatHours(count) + ":" + newSec + " " + amdata,
            challengeId: itemData._id,
            timeZone:timeZone
        });
        console.log("SetTimeApi--->data", postData);

        // var postData = JSON.stringify({
        //     alertClockTime: count + ":" + secondCount + " " + amdata,
        //     challengeId: itemData._id,
        // });
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };
        global.props.showLoader();
        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("SetTimeApi--->Response", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    _GetListApiCalling()
                    settimermodal(false)
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
                
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    _GetListApiCalling()
                } else {
                    Alert.alert("Remove Time", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                
                // Handle errors
            });

    }

    const _DeleteApiCalling = async () => {
        // setData([])
        global.props.showLoader();
        let apiUrl = appBaseUrl.DeleteChallenge + itemData._id;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.delete(apiUrl, { headers })
            .then(async (response) => {
                // Handle the successful response
               
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    var ResponseData = response.data
                    setData([])
                    _GetListApiCalling()
                    // Alert.alert("Delete Challenge", "Challenege deleted successfully");
                    msgProvider.toast("Challenege deleted successfully", 'bottom')
                    deleteItem(itemDeleteIndex, itemData._id);
                    // closeRow(itemDeleteIndex, itemData._id);


                } else {
                    Alert.alert("DeleteChallenge", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                
                // Handle errors
            });
    }

    const closeRow = (index, id) => {
        if (index[id]) {
            index[id].closeRow();
        }

    };

    // Function to delete an item from the list 
    const deleteItem = (index, id) => {
       
        const newData = [...data];
        const prevIndex = data
            .findIndex(item => item._id === id);
        newData.splice(prevIndex, 1);
        setData(newData);
        closeRow(index, id);

    };


    // Function to render each list item 
    const leftSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [2, 3],
            outputRange: [1, 1],
            extrapolate: 'clamp',
        });
        return (
            <TouchableOpacity activeOpacity={0.6}>
                <View style={styles.deleteBox}>
                    <Text style={{ transform: [{ scale: scale }] }}>
                        Delete
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const formatHours = (hours) => {
       const formattedHours = ('0' + hours.trim()).slice(-2);
        return formattedHours;
    };

    const formatMinutes = (minutes) => {
        const formattedMin = ('0' + minutes.trim()).slice(-2);
        return formattedMin
    };

    const formatStartDay = (day) => {
        const upcomingExercises = day != ''
            && day.customerDayWiseExercises.filter(
                exercise => exercise.status === 'Complete'
            );
        const upcomingCount = upcomingExercises.length;
        return upcomingCount;
    };

    // Get the count of upcoming exercises
    const handleRefresh = () => {
        _GetListApiCalling();

        // onPress: () => {
        setTimeout(() => {
            setRefreshing(false);
        }, 5000);
        // },

    };
   


    const TosetCountValue = (txt) => {
        setCount(txt)
    }


    const TosetSecondCountValue = (txt) => {
        setsecondCount(txt)
    }


    const incrementValue = () => {
        var countValue = 0
        if(count == ''){
            countValue = 0
        }else{
            countValue = count
        }
        let numericValue = parseInt(countValue, 10);
        // numericValue += 1;
        var numericValue1 = numericValue == 12 ? 12 : numericValue += 1

        if (numericValue1 < 10) {
            setCount(`0${numericValue1.toString()}`);
        } else {
            setCount(numericValue1.toString());
        }
    };

    const decrementValue = () => {
        var countValue = 0
        if(count == ''){
            countValue = 0
        }else{
            countValue = count
        }

        let numericValue = parseInt(countValue, 10);
        // alert(numericValue)
        // numericValue -= 1;
        
        var numericValue1 = numericValue == ''|| numericValue == 0 ? 0 : numericValue - 1

        if (numericValue1 < 10) {
            setCount(`0${numericValue1.toString()}`);
        } else {
            setCount(numericValue1.toString());
        }
    };
    const incrementValueSecondCount = () => {
        var secondCountValue = 0
        if(secondCount == ''){
            secondCountValue = 0
        }else{
            secondCountValue = secondCount
        }
        let numericValue = parseInt(secondCountValue, 10);
        // numericValue += 1;
        var numericValue1 = numericValue == 59 ? 59 : numericValue += 1

        if (numericValue1 < 10) {
            setsecondCount(`0${numericValue1.toString()}`);
        } else {
            setsecondCount(numericValue1.toString());
        }
    };

    const decrementValueSecondCount = () => {
        var secondCountValue = 0
        if(secondCount == ''){
            secondCountValue = 0
        }else{
            secondCountValue = secondCount
        }
        let numericValue = parseInt(secondCountValue, 10);
        // numericValue -= 1;
        var numericValue1 = numericValue == 0 ? 0 : numericValue - 1

        if (numericValue1 < 10) {
            setsecondCount(`0${numericValue1.toString()}`);
        } else {
            setsecondCount(numericValue1.toString());
        }
    };


    useEffect(() => {
        const currentTimeZone = zone.tz.guess();
        console.log('Current Time Zone YNEW:', currentTimeZone);
        setTimeZone(currentTimeZone)
      }, []);
    


    return (
        <View style={{ flex: 1,  }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                {isNextChallenge ?
                    <Header navigation={navigation} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} firstImage={localimag.icon_back}  ></Header>
                    :
                    <Header navigation={navigation} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay}  ></Header>
                }
                <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
                    {/*  */}

                    {/*  modal open */}
                    <Modal
                        animationType="fade"
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
                                <Text style={styles.startTimetxt}>{Lang_chg.editStartingTime}</Text>

                                <View style={styles.boxManage}>

                                    <View style={styles.dropdowmView}>

                                        {/*  increse count 12 hour  */}

                                        <TouchableOpacity style={styles.touch}
                                            onPress={() => incrementValue()}>
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_up}></Image>
                                        </TouchableOpacity>


                                        <View style={styles.boxView}>
                                            <TextInput
                                                maxLength={3}
                                                value={count + ''}
                                                // placeholder={count}
                                                keyboardType='number-pad'
                                                onChangeText={(txt) => { TosetCountValue(txt) }}
                                                style={[styles.timerText, { width: mobileW * 15 / 100 }]}
                                            ></TextInput>
                                            {/* <Text style={styles.timerText}>{formatHours(count)}</Text> */}
                                        </View>

                                        {/*  decrese count 12 hour   */}

                                        <TouchableOpacity style={styles.touch}
                                            onPress={() => decrementValue()}>
                                            {/* onPress={() => setCount(Number(count) > 0 ? Number(count) - 1 : 0)}> */}
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_down}></Image>
                                        </TouchableOpacity>

                                        <Text style={styles.minText}>{"HH"}</Text>

                                    </View>
                                    <View style={{ width: mobileW * 18 / 100, alignItems: 'center' }}>

                                        {/* increse second count   */}

                                        <TouchableOpacity
                                            style={styles.touch}
                                            onPress={() => incrementValueSecondCount()}>
                                            {/* onPress={() => setsecondCount(Number(secondCount) >= 0 ? Number(secondCount) + 1 : 0)}> */}
                                            <Image resizeMode='contain' style={styles.dropdowmImage}
                                                source={localimag.icon_up}></Image>
                                        </TouchableOpacity>

                                        <View style={styles.boxView}>
                                            <TextInput
                                                maxLength={3}
                                                keyboardType='number-pad'
                                                value={secondCount + ""}
                                                // placeholder={count}
                                                onChangeText={(txt) => TosetSecondCountValue(txt)}
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

                                        <Text style={styles.minText}>{"MM"}</Text>

                                    </View>

                                    {/*  choose am button */}

                                    <View style={{ width: mobileW * 18 / 100, alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.touch} onPress={() => setamdata(amdata ? "am" : "")}>
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
                    {/*  modal close */}


                    {/*  modal open  permision*/}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={permisionmodal}
                        onRequestClose={() => {
                            setpermisionmodal(!permisionmodal);
                        }}>
                        <View style={styles.modalBackgroundcolor}>
                            <View style={styles.modalCard}>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => setpermisionmodal(false)}>
                                    <Image style={styles.crossImage} source={localimag.icon_close} />
                                </TouchableOpacity>
                                <Text style={styles.startTimetxt}>{Lang_chg.areYouSureYouWantToDeleteChallenge}</Text>

                                <Text style={styles.achieveText}>{Lang_chg.youCanAchieveYourBadgeInJust}</Text>
                                <View style={styles.daysButton}>
                                    <Text style={styles.dayTimetxt}>{itemData.dayCount - itemData.startDay + " days"}</Text>
                                </View>



                                {/*  confirm button */}

                                <TouchableOpacity onPress={() => {
                                    // swipeListViewRef.closeOnRowBeginSwipe(),
                                    _DeleteApiCalling(), setpermisionmodal(false)
                                }} style={styles.modalButton}>
                                    <Text style={styles.wantTxt}>{Lang_chg.yesIWantToDelete}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setpermisionmodal(false) }}>
                                    <Text style={styles.removeText}>{Lang_chg.doNotDelete}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {allCompleteChallenge != 0 &&
                        <TouchableOpacity onPress={() => navigation.navigate('DailyworkoutCompleted')}>
                            <Text style={[styles.eliteText, {
                                color: Colors.lightAccent,
                                position: "absolute", right: 10, top: 10
                            }]}>Challenge Badge</Text>
                        </TouchableOpacity>
                    }

                    {isNextChallenge ?
                        <Text style={styles.areYoureadyText}>{Lang_chg.seeYouTomorrow}</Text>
                        :
                        <Text style={styles.challengesText}>{Lang_chg.yourActiveChallenges}</Text>
                    }
                    {/* badges card open */}

                    {visibleContent && !isNextChallenge ?

                        <View style={styles.badgescard}>
                            <Text style={styles.badgesText}>{Lang_chg.clickOnTheBadgeToStart}</Text>
                            <TouchableOpacity onPress={() => setVisibleContent(false)}>
                                <Image style={styles.crossImageBades} source={localimag.icon_close} />
                            </TouchableOpacity>
                        </View>

                        :

                        null
                    }

                    {/* badges card close */}

                    {/*  SwipeListView open */}
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={['#0087ff']} // Set the color of the refresh indicator
                                />
                            }
                            contentContainerStyle={{ paddingBottom: mobileH * 5 / 100 }}
                        >
                            {
                                data <= 0 ?
                                    <Text style={[styles.pullText, { paddingVertical: mobileW * 18 / 100 }]}>No Challenge Found</Text>
                                    :
                                    <SwipeListView
                                        data={data}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity
                                                
                                                onPress={() => {
                                                    tomorrow == 1 ? 
                                                    navigation.navigate("ChallengeRecords",
                                                        {
                                                            recordData: item, ChallengeTime: item.setAlertTime ? item.alertClockTime : item.alertInternationalTime, IsTomorrow: tomorrow
                                                        }) :  _GetBadgeDetailsApiCalling(item._id)
                                                }}
                                                activeOpacity={1}>

                                                <LinearGradient
                                                    colors={['#EB6519', Colors.blackColor,]}
                                                    // style={[styles.linerGradiantview,{borderRadius:rowVisible?0: mobileW * 4.5 / 100}]}
                                                    style={[styles.linerGradiantview]}
                                                    start={{ x: 0, y: 0.7 }}
                                                    end={{ x: 0.9, y: 1 }}>

                                                    {/* <View style={[styles.swiperDataview,{borderRadius:rowVisible?0: mobileW * 4.5 / 100}]}> */}
                                                    <View style={[styles.swiperDataview]}>

                                                        <View style={styles.textView}>
                                                            <TouchableOpacity >
                                                                <Text style={styles.strengthText}>{item.exercises.exerciseTypes.name}</Text>
                                                            </TouchableOpacity>
                                                            <Text style={styles.eliteText}>{ }</Text>

                                                            {/* <Text style={styles.dateText}>{item.date}</Text> */}
                                                            {/* {item.levels != ''&& */}
                                                            {/* {item.levels.name != null && */}
                                                                <TouchableOpacity>
                                                                    <Text style={styles.eliteText}>{item.levels.name}</Text>
                                                                </TouchableOpacity>
                                                            {/* } */}
                                                            {/* } */}

                                                        </View>
                                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={styles.pullText}>{item.exerciseCount} </Text>
                                                                {item.exerciseUnits != null &&
                                                                    <Text style={styles.pullText}>{item.exerciseUnits.name} </Text>}
                                                                <Text style={styles.pullText}>{item.exercises.name}</Text>
                                                            </View>
                                                            <Text style={styles.everyTxt}>{"Every" + item.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                                            <Text style={styles.daysTxt}>{item.dayCount + " " + item.exerciseDurations.name}</Text>
                                                        </View>
                                                        <View style={styles.cardInnerview}>
                                                            <View style={styles.dayButton}>
                                                                <Text style={styles.dayTimetxt}>{"Day " + item.startDay + "/" + item.dayCount}</Text>
                                                            </View>
                                                            <View style={styles.timeView}>
                                                                <Text style={styles.timerTxt}>{item.setAlertTime ? (item.alertClockTime !=''? zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertClockTime}:00.000+0000`)),timeZone).format("hh:mm a") : '') : (item.alertInternationalTime != ''?  zone.tz(moment(moment().format(`YYYY-MM-DDT${item.alertInternationalTime}:00.000+0000`)),timeZone).format("hh:mm a"):'')}</Text>
                                                                {/* <Text style={styles.timerTxt}>{item.timeSecond}</Text> */}

                                                                <TouchableOpacity activeOpacity={0.8} onPress={() => { setFormateTime(item), setItem(item), settimermodal(true) }}>
                                                                    <Image style={styles.watchIcon} source={localimag.icon_time_white} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </LinearGradient>

                                                {item.todaycustomerDayWiseExercises.status == "Complete" &&
                                                    <View style={[styles.swiperDataview, { top: mobileW * 4 / 100, left: mobileW * 5 / 100, backgroundColor: "#00000060", position: "absolute", justifyContent: "center", alignItems: "center" }]}>
                                                        <Image resizeMode='cover'
                                                            source={localimag.icon_Check}
                                                            style={{ alignSelf: "center", width: mobileW * 7 / 100, height: mobileW * 7 / 100 }} />
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                        }
                                        renderHiddenItem={({ item, index }) =>
                                            <View style={styles.hiddenItem}>

                                                <TouchableOpacity
                                                    style={[styles.hiddenButton, styles.deleteButton]}
                                                    onPress={() => { setItemDeleteIndex(index), setItem(item), setpermisionmodal(true) }}>
                                                    <Image resizeMode="contain" style={styles.deleteIcon} source={localimag.icon_delete} />
                                                    <Text style={styles.buttonText}>{Lang_chg.delete}</Text>
                                                </TouchableOpacity>
                                            </View>}
                                        leftOpenValue={80}
                                        rightOpenValue={-80}
                                        // leftOpenValue={25}
                                        // rightOpenValue={-50}
                                        // previewRowKey={'0'}
                                        // previewOpenValue={-40}
                                        // previewOpenDelay={3000}
                                        closeOnRowBeginSwipe={false}
                                        closeOnRowPress={true}
                                        closeOnScroll={true}
                                        ref={swipeListViewRef}
                                    />

                            }
                        </ScrollView>


                        {/* <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab> */}
                        <View style={{}}>
            <View style={{
                width: mobileW, backgroundColor: Colors.blackColor, alignItems: 'center',
                elevation: 1, shadowOffset: { width: 0, },
                shadowColor: '#000',
                shadowOpacity: 0.1,
            }}>
                <View style={{
                    backgroundColor: Colors.blackColor, paddingVertical: mobileH * 1.5 / 100,
                    flexDirection: 'row', alignItems: 'center', width: mobileW * 80 / 100,
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DailyexerciseList")}
                        activeOpacity={0.7}
                        style={{
                            width: mobileW * 7 / 100, height: mobileW * 7 / 100,
                            alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Image resizeMode='contain' style={{
                            width: mobileW * 6 / 100,
                            height: mobileW * 6 / 100,
                        }}
                            source={localimag.icon_home_w}></Image>
                    </TouchableOpacity>

                    {/* {isAddIcon == "true" ? null : */}
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}>
                            {/* <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.DrunkBold, color: Colors.lightGreyColor }}>N R T H</Text> */}
                            <TouchableOpacity
                                onPress={() =>_GetPackageIsExpairApiCalling() }
                                activeOpacity={0.7}
                                style={{
                                    backgroundColor: Colors.orangeColor,
                                    borderWidth: 1,
                                    position: "absolute",
                                    top: 0,
                                    marginTop: mobileW * -12 / 100,
                                    width: mobileW * 12 / 100, height: mobileW * 12 / 100,
                                    borderRadius: mobileW * 6 / 100, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>

                                <Image resizeMode='contain' style={{ tintColor: Colors.whiteColor, width: mobileW * 6 / 100, height: mobileW * 6 / 100, }}
                                    source={localimag.icon_plus}></Image>

                            </TouchableOpacity>
                        </View>
                    {/* } */}
                        {/* onPress={() => navigation.navigate('LiveChallenges')} */}

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            borderColor: Colors.lightAccent,
                            borderWidth: 1,
                            width: mobileW * 7 / 100, height: mobileW * 7 / 100,
                            borderRadius: mobileW * 4 / 100, alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <Image resizeMode='contain' style={{ tintColor: Colors.whiteColor, width: mobileW * 4 / 100, height: mobileW * 4 / 100, }}
                            source={localimag.icon_Check}></Image>
                    </TouchableOpacity>


                </View>
            </View>
        </View>
                    </View>

                </View>
            </ScrollView>
        </View >
    )

}
export default DailyexerciseList;
const styles = StyleSheet.create({
    badgescard: {
        justifyContent: "center",
        width: mobileW * 90 / 100,
        borderWidth: mobileW * 0.3 / 100,
        borderColor: Colors.mediumDarkGrey,
        height: mobileW * 16.6 / 100,
        borderRadius: mobileW * 3.3 / 100,
        padding: mobileW * 3 / 100,
        backgroundColor: Colors.blackColor,
        marginTop: mobileW * 2.5 / 100,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: mobileW * 3.2 / 100

    },
    dropdowmView:
    {
        width: mobileW * 18 / 100,
        alignItems: 'center'
    },
    hiddenItem: {
        marginTop: mobileW * 3 / 100,
        width: mobileW * 90 / 100,
        height: mobileW * 49.8 / 100,
        borderRadius: mobileW * 3 / 100,
        backgroundColor: Colors.blackColor,
        padding: mobileW * 0.40 / 100,
        alignSelf: 'center',
        borderRadius: mobileW * 3.8 / 100,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    deleteIcon: {
        width: mobileW * 6 / 100,
        height: mobileW * 6 / 100

    },
    linerGradiantview: {
        width: mobileW * 90 / 100,
        height: mobileW * 49.8 / 100,
        marginTop: mobileW * 3 / 100,
        alignSelf: 'center',
        borderRadius: mobileW * 4.5 / 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timerText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 4 / 100,
        textAlign: "center",
        alignSelf: 'center',
        width:mobileW*15/100,
        // backgroundColor:"red"

    },
    minText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 2 / 100,
        textAlign: "center",
        alignSelf: 'center',
        marginTop: mobileW * 2 / 100

    },
    dayButton: {
        backgroundColor: Colors.backgroundcolor,
        width: mobileW * 30 / 100,
        borderColor: Colors.orangeColor,
        borderRadius: mobileW * 2 / 100,
        borderWidth: mobileW * 0.3 / 100,
        height: mobileW * 8 / 100,
        justifyContent: "center",
        left: mobileW * 2.3 / 100,

    },
    daysButton: {
        backgroundColor: Colors.backgroundcolor,
        width: mobileW * 22 / 100,
        borderColor: Colors.orangeColor,
        borderRadius: mobileW * 2.1 / 100,
        borderWidth: mobileW * 0.3 / 100,
        height: mobileW * 7 / 100,
        justifyContent: "center",
        left: mobileW * 2.3 / 100,
        alignSelf: 'center',
        marginTop: mobileW * 3 / 100

    },
    timerTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.8 / 100,
        right: mobileW * 5 / 100,
        alignSelf: 'center'
    },
    swiperDataview: {
        width: mobileW * 89 / 100,
        height: mobileW * 49 / 100,
        borderRadius: mobileW * 4 / 100,
        backgroundColor: Colors.blackColor,
        padding: mobileW * 1 / 100
    },
    achieveText: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3 / 100,
        textAlign: 'center',
        marginTop: mobileW * 6 / 100

    },
    dayTimetxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.8 / 100,
        alignSelf: "center",
        justifyContent: 'center'

    },
    timeView: {
        flexDirection: 'row',
        alignItems: "center"
    },
    badgesText: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        width: mobileW * 62.7 / 100,
        fontSize: mobileW * 2.9 / 100,
        left: mobileW * 2 / 100
    },
    cardInnerview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Platform.OS == "ios" ? mobileW * 9 / 100 : mobileW * 4 / 100,


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
    wantTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.8 / 100,
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

    modalBackgroundcolor: {
        // backgroundColor: "#ffffff9f",
        // backgroundColor: "#00000000",
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        opacity: 20,
        flex: 1,
        elevation: 10,
        overflow: 'hidden',
        shadowColor: Colors.whiteColor,
        shadowRadius: 10,
        shadowOpacity: 1,
        justifyContent: "center",
       
    },
    swipedatamodal: {
    
        backgroundColor: "#ffffff9f",
        opacity: 20,
        elevation: 10,
        overflow: 'hidden',
        shadowColor: Colors.blackColor,
        shadowRadius: 10,
        shadowOpacity: 1,
        justifyContent: "center",
        alignItems: 'center',
        width: mobileW * 100 / 100,
        height: mobileH * 100 / 100,
        //    flexDirection:"row"
    },
    crossImage: {
        width: mobileW * 4 / 100,
        height: mobileW * 4 / 100,
        tintColor: Colors.whiteColor,

    },
    crossImageBades: {
        width: mobileW * 4.3 / 100,
        height: mobileW * 4.3 / 100,
        tintColor: Colors.whiteColor,
        right: mobileW * 2 / 100

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
        fontSize: mobileW * 3.3 / 100,
        textAlign: "center",
        marginTop: mobileW * 4 / 100,

    },
    startTimetxt: {
        color: Colors.orangeColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.5 / 100,
        textAlign: 'center',
        marginTop: mobileW * -1.2 / 100,
        width: mobileW * 55 / 100,
        alignSelf: "center"
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
        height: mobileW * 68 / 100,
        borderRadius: mobileW * 3 / 100,
        padding: mobileW * 3 / 100,
        backgroundColor: Colors.blackColor,
        marginTop: mobileW * 5 / 100,
        alignSelf: 'center',
        borderColor:Colors.lightAccent,
        borderWidth: mobileW * 0.2 / 100,
    },
    areYoureadyText: {
        color: Colors.lightAccent,
        alignSelf: 'center',
        marginTop: mobileW * 10 / 100,
        marginBottom: mobileW * 10 / 100,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 5 / 100
    },
    challengesText: {
        textAlign: "center",
        fontFamily: Font.FontRegularFono,
        color: Colors.orangeColor,
        fontSize: mobileW * 3.5 / 100,
        marginTop: mobileW * 15 / 100
    },
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
        padding: mobileW * 2 / 100,
        marginBottom: mobileW * 1 / 100

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
    dateText: {
        color: Colors.lightGreyColor,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 3.4 / 100,


    },
    pullText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100
    },
    everyTxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.8 / 100,
        marginTop: mobileW * 2 / 100
    },





    container: {
        flex: 1,
        backgroundColor: '#eee', // Light Gray 
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'green',
        margin: 20,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Dark Gray 
        margin: 10,
        textAlign: 'center',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF', // White 
        borderBottomColor: '#E0E0E0', // Lighter Gray 
        borderBottomWidth: 1,
        height: 80,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
    },
    itemText: {
        color: '#333', // Dark Gray 
        fontSize: 16,
        fontWeight: 'bold',
    },
    hiddenContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 80,
        borderRadius: 20,
    },
    hiddenButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: 80,
    },
    closeButton: {
        backgroundColor: 'green', // Blue 
        borderRadius: 20,
    },
    deleteButton: {
        backgroundColor: Colors.orangeColor, // Red 
        borderBottomEndRadius: 18,
        borderTopEndRadius: 18,
        width: mobileW * 18 / 100,
        height: mobileW * 49.8 / 100
    },
    buttonText: {
        color: '#FFF',
        fontSize: mobileW * 3 / 100,
        marginTop: mobileW * 2 / 100,
        fontFamily: Font.FontRegularFono,
    },
})