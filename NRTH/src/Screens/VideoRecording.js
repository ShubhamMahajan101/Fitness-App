import React, { useState, useRef, useEffect } from 'react';
import { RNCamera } from 'react-native-camera';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ImageBackground, Button, TouchableHighlight, Platform } from 'react-native'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants';
import moment from 'moment';
import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios'
import RNFetchBlob from 'rn-fetch-blob';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckUserStatus } from '../Components/ApiCallForLogot';
import KeepAwake from 'react-native-keep-awake';


const VideoRecording = ({ navigation }) => {
    const cameraRef = useRef(null);
    const [isStopwatchStart, setIsStopwatchStart] = useState(true);
    const [showStopWatch, setshowStopWatch] = useState(true);
    const [CompleteStatus, setCompleteStatus] = useState(0);
    const [Time, setTime] = useState('');
    const [timer, setTimer] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [showHideCounter, setShowHideCounter] = useState(true);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [isPause, setIsPause] = useState(false);

    const [count, setCount] = useState(3);
    const [videoUrl, setVideoUrl] = useState("NA");

    const route = useRoute()
    const challengeItem = route.params?.challengeItem
    const ChallengeTime = route.params?.ChallengeTime

    const [value, setValue] = useState('1');
    const [value1, setValue1] = useState('1');
    const [isFocus, setIsFocus] = useState(false);
    const [isFocus1, setIsFocus1] = useState(false);
    const [countPullups, setCountPullups] = useState(60);
    const [preferencesModal, setPreferencesModal] = useState(false)
    const [ToStopVideo, setToStopVideo] = useState(3600)

    const isFocused = useIsFocused();

    const Timer_dropdownData = [
        { name: 'Secs', _id: '1' },
        { name: 'Mins', _id: '2' },


    ];
    const Camera_dropdownData = [
        { name: 'Front', _id: '1' },
        { name: 'Rear', _id: '2' },

    ];

    const incrementCount = () => {
        setCountPullups(countPullups > 59 ? 0 : countPullups + 1);
    };
    const decrementCount = () => {
        setCountPullups(countPullups == 0 ? 0 : countPullups - 1);
    };
    global.props.hideLoader();
    useEffect(() => {
        CheckUserStatus({ navigation })
       
        const timer = setInterval(() => {
            if (count > 1) {
                setCount(count - 1);

            } else {
                setShowHideCounter(false)
                clearInterval(timer);
                setIsRecording(true)
                startRecording()
            }
        }, 2000);

        return () => {
            clearInterval(timer);
        };
    }, [count]);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };

    }, [isRecording]);



    const startTimer = () => {
        // setIsRunning(true);
        setIsRecording(true);
    };

    const pauseTimer = () => {
        setIsRecording(false);

        // setIsRunning(false);
    };


    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setIsRecording(true);
                const options = {
                    quality: RNCamera.Constants.VideoQuality['480p'],
                };
                const data = await cameraRef.current.recordAsync(options);
                if (data) {
                    setVideoUrl(data.uri);
                }
            } catch (error) {
            }
        }
    };

    const stopRecording = async () => {
        if (cameraRef.current) {
            try {
                setIsRecording(false);
                cameraRef.current.stopRecording();
            } catch (error) {
                
            }
        }
    };


    const pauseRecording = () => {
        if (cameraRef.current) {
          cameraRef.current.pausePreview();
        //   setIsPaused(true);
        }
      };

      const resumeRecording = () => {
        if (cameraRef.current) {
          cameraRef.current.resumePreview();
        //   setIsPaused(false);
        }
      };

    const formatTime = (seconds) => {
        let minutes
        if (seconds > 599) {
            minutes = Math.floor(seconds / 60);
        } else {
            minutes = '0' + Math.floor(seconds / 60);
        }
        const remainingSeconds = seconds % 60;
        if (ToStopVideo == timer) {
            setTimer(ToStopVideo)
            stopRecording()
            setCompleteStatus(1)
            setTimeout(() => {
                setCompleteStatus(2)
            }, 3000);
            setIsRecording(false);
            setshowStopWatch(false)
            setToStopVideo(`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`)
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        } else {
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
    };
   

    const formatStartDay = (day) => {
        const upcomingExercises = day != ''
            && day.customerDayWiseExercises.filter(
                exercise => exercise.status === 'Complete'
            );
        const upcomingCount = upcomingExercises.length;
        return upcomingCount;
    };

    useEffect(() => {
        // Enable keep awake when the component mounts
        KeepAwake.activate();
    
        // Disable keep awake when the component unmounts
        return () => KeepAwake.deactivate();
      }, []);


    const _AddToGalleryWithoutVideoUrl = async () => {
        let date = moment().format("YYYY-MM-DD");

        global.props.showLoader();
        // setRefreshing(true);

        let apiUrl = appBaseUrl.AddToGalleryWithoutVideoUrl;

        var postData = JSON.stringify({
            challengeId: challengeItem._id,
            todayDate: date,
            completeTime:formatTime(timer),
            isVideo : 1

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
                    _AddToGalleryApiCalling()
                    navigation.replace('ChallengeRecords', { recordData: response.data.startTodayChallengeByChallengeId, ChallengeTime: response.data.startTodayChallengeByChallengeId.setAlertTime ? response.data.startTodayChallengeByChallengeId.alertClockTime : response.data.startTodayChallengeByChallengeId.alertInternationalTime, })
                    KeepAwake.deactivate();
                } else {
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                // Handle errors
            });
    }


    const _AddToGalleryApiCalling = async () => {
        let date = moment().format("YYYY-MM-DD");
        var data = new FormData();
        data.append('challengeId', challengeItem._id)
        // if (Platform.OS == "ios") {
        if (videoUrl !== 'NA' && videoUrl != '') {
            data.append('file', {
                uri: videoUrl,
                type: 'video/mp4',
                name: 'challengeVideo.mp4',
            });
        }
      
        data.append('todayDate', date)
        data.append('completeTime', formatTime(timer))
        
        // global.props.showLoader();
        global.props.hideLoader();
        let apiUrl = appBaseUrl.AddToGalleryUrl;
        let headers = {
            "Accept": 'application/json',
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache,no-store,must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0,
            'Cookie': 'HttpOnly'
        }
        
        // Make a POST request using Axios
        axios.post(apiUrl, data, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("AddToGalleryVideoResponse--->333", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                } else {
                    alert(response.data.ErrorMessage)
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                Alert.alert(
                    'Error',
                    'Network Connectivity Issue Detected', [{
                        text: 'Cancel',
                        style: 'Yes',
                    }, {
                        text: 'Retry',
                        onPress: () => _AddToGalleryApiCalling()
                    }], {
                    cancelable: false
                }
        );
                // Handle errors
            });
    }

    const CountValue = () => {
        var TotalTiming = countPullups * 60
        if (value == 2) {
            TotalTiming = countPullups * 60
        } else {
            TotalTiming = countPullups
        }
        setToStopVideo(TotalTiming)
        setPreferencesModal(false)
    }


    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={preferencesModal}
                onRequestClose={() => {
                    setPreferencesModal(!preferencesModal);
                }}>

                <View style={{ backgroundColor: "#ffffff9f", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.modalView}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setPreferencesModal(!preferencesModal)}>
                            <Image style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, tintColor: Colors.whiteColor }}
                                source={localimag.crossb}></Image>
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 70 / 100, alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: mobileW * 4.5 / 100, color: Colors.orangeColor, fontFamily: Font.aeonikRegular }}>Countdown timer</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: mobileW * 5 / 100 }}>
                                <View style={{ width: mobileW * 16 / 100, alignItems: 'center', marginHorizontal: mobileW * 2 / 100 }}>
                                    <TouchableOpacity style={styles.touch} onPress={() => incrementCount()}>
                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                            source={localimag.icon_up}></Image>
                                    </TouchableOpacity>
                                    <View style={styles.countPullupsView}>
                                        <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 5 / 100, fontFamily: Font.DrunkBold }}>{countPullups}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.touch} onPress={() => decrementCount()}>
                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                            source={localimag.icon_down}></Image>
                                    </TouchableOpacity>
                                </View>
                                <Dropdown
                                    style={[styles.countPullupsView, { width: mobileW * 35 / 100, paddingLeft: mobileW * 3 / 100, marginHorizontal: mobileW * 2 / 100 }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    activeColor={Colors.blackColor}
                                    containerStyle={styles.inputSearchStyle}
                                    itemTextStyle={{ color: Colors.whiteColor, fontFamily: Font.DrunkBold }}
                                    iconStyle={styles.iconStyle}
                                    data={Timer_dropdownData}
                                    Mode={"outlined"}
                                    maxHeight={300}
                                    value={value}
                                    placeholder="Select"
                                    labelField="name"
                                    valueField="_id"
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setValue(item._id);
                                        setIsFocus(false);
                                    }}
                                />
                            </View>

                            <Text style={{ fontSize: mobileW * 4.5 / 100, color: Colors.orangeColor, marginTop: mobileW * 5 / 100, fontFamily: Font.aeonikRegular }}>Default camera</Text>

                            <Dropdown
                                style={[styles.countPullupsView, { width: mobileW * 35 / 100, marginTop: mobileW * 3 / 100, paddingLeft: mobileW * 3 / 100, }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor={Colors.blackColor}
                                containerStyle={styles.inputSearchStyle}
                                itemTextStyle={{ color: Colors.whiteColor, fontFamily: Font.DrunkBold }}
                                iconStyle={styles.iconStyle}
                                data={Camera_dropdownData}
                                Mode={"outlined"}
                                maxHeight={300}
                                value={value1}
                                placeholder="Select"
                                labelField="name"
                                valueField="_id"
                                onFocus={() => setIsFocus1(true)}
                                onBlur={() => setIsFocus1(false)}
                                onChange={item => {
                                    setValue1(item._id);
                                    setIsFocus1(false);
                                    setIsFrontCamera(item._id=="1"?true:false)

                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                CountValue()
                            }} activeOpacity={0.8} style={{ width: mobileW * 70 / 100, height: mobileW * 12 / 100, marginTop: mobileW * 10 / 100, marginBottom: mobileW * 5 / 100, borderRadius: mobileW * 3 / 100, backgroundColor: Colors.orangeColor, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.whiteColor, fontFamily: Font.FontRegularFono }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <RNCamera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={ isFrontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                captureAudio={true} />
            {/* --- CArd View --- */}
            <ImageBackground resizeMode='cover'
                source={localimag.icon_video_up}
                style={{
                    width: mobileW, height: mobileW * 80 / 100, position: 'absolute'
                }} />

            {showHideCounter ?
                <View style={{
                    height: "98%", width: mobileW, position: 'absolute', alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={styles.ReadyTxt}>Ready, Set,</Text>
                    <Text style={styles.Intxt}>in</Text>
                    <View style={{ marginTop: mobileW * -8 / 100 }}>
                        {count == 3 ? <Image resizeMode='contain'
                            style={styles.CounterIcon}
                            source={localimag.icon_3}></Image> : null}
                        {count == 2 ? <Image resizeMode='contain'
                            style={styles.CounterIcon}
                            source={localimag.icon_2}></Image> : null}
                        {count == 1 ? <Image resizeMode='contain'
                            style={styles.CounterIcon}
                            source={localimag.icon_1}></Image> : null}
                    </View>

                    <View style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}>
                        <View style={styles.CounterHeadView}>
                            <Image
                                resizeMode='contain'
                                style={styles.watchIcon} ></Image>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.counterTxt}>{count}s </Text>
                                <Image resizeMode='contain'
                                    style={styles.watchIcon}
                                    source={localimag.icon_watch}></Image>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsFrontCamera(!isFrontCamera)}
                            >
                                <Image resizeMode='contain'
                                    style={styles.cameraIcon}
                                    source={localimag.Camera_icon}></Image>
                            </TouchableOpacity>
                        </View>
                        <Image resizeMode='contain'
                            style={styles.whiteLogo}
                            source={localimag.logo_white}></Image>
                    </View>
                </View>
                :
                <View style={{ height: mobileH, width: mobileW, position: 'absolute' }}>
                
                    <View activeOpacity={0.8} style={styles.cardView}>
                        <View style={styles.textView}>
                            <TouchableOpacity>
                                <Text style={styles.strengthText}>{challengeItem.exercises.exerciseTypes.name}</Text>
                            </TouchableOpacity>
                            <Text style={styles.eliteText}>{ }</Text>

                            <TouchableOpacity>
                                <Text style={styles.eliteText}>{challengeItem.levels.name}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Text style={styles.pullText}>{challengeItem.exerciseCount + " " + challengeItem.exercises.name}</Text> */}
                        <View style={{ flexDirection: 'row', alignSelf: "center" }}>
                            <Text style={styles.pullText}>{challengeItem.exerciseCount} </Text>
                            {challengeItem.exerciseUnits != null &&
                                <Text style={styles.pullText}>{challengeItem.exerciseUnits.name} </Text>}
                            <Text style={styles.pullText}>{challengeItem.exercises.name}</Text>
                        </View>
                        <Text style={styles.everyTxt}>{"Every" + challengeItem.exerciseDurations.name.toLowerCase() + " for"}</Text>
                        <Text style={styles.daysTxt}> {challengeItem.dayCount + " " + challengeItem.exerciseDurations.name}</Text>
                    </View>

                    <View
                        style={[styles.TabInActive,
                        {
                            borderColor: Colors.orangeColor,
                        }]}>
                        <Text
                            style={{
                                color: Colors.orangeColor,
                                fontFamily: Font.FontFonoMedium,
                                fontSize: mobileW * 4 / 100
                            }}>{"Day " + challengeItem.startDay + "/" + challengeItem.dayCount}</Text>
                    </View>
                    {/* </>
                    } */}
                  
                    <View style={{ marginTop: mobileH * 18 / 100 }}>
                        {CompleteStatus == 0 &&
                            <View style={{ marginTop: mobileH * 15 / 100 }}>
                                {!isStopwatchStart ?
                                   <Text style={styles.startTxt}>Paused</Text>  :
                                    // <Text style={styles.startTxt}>In progress</Text>
                                  
                                    <Text style={styles.startTxt}>Recording on</Text>
                                }
                            </View>}
                        {showStopWatch ?
                            <View style={{}}>
                                {/* <Text style={styles.TimeText}>{isRecording ? formatTime(timer) : ToStopVideo}</Text> */}
                                <Text style={styles.TimeText}>{isRecording ? formatTime(timer) : formatTime(timer)}</Text>
                                <View style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'center', flexDirection: 'row'
                                }}>

                                    <TouchableOpacity onPress={() => setPreferencesModal(true)}>

                                        <View style={{ alignItems: 'center', width: mobileW * 30 / 100 }}>
                                            <Text style={styles.preferenceTxt}>{Lang_chg.preferences}</Text>
                                            <Image resizeMode='contain'
                                                style={styles.SideIcons}
                                                source={localimag.icon_filter}></Image>
                                        </View>
                                    </TouchableOpacity>

                                    {/* console.log(ToStopVideo,"value1value1", timer) */}
                                    <TouchableHighlight
                                        style={[styles.onOffTimer]}
                                        onPress={() => {
                                            setIsRecording(!isRecording);
                                            setIsStopwatchStart(!isStopwatchStart);
                                            stopRecording()
                                           
                                            setshowStopWatch(false);
                                            setCompleteStatus(1)
                                            setTimeout(() => {
                                                setCompleteStatus(2)
                                            }, 3000);
                                            // }
                                        }}>
                                        <View style={styles.onOffInView}>
                                            {!isStopwatchStart ?
                                                <Image
                                                    resizeMode='contain'
                                                    source={localimag.icon_ellipse}
                                                    style={styles.LogoImage}></Image>
                                                :
                                                <Image
                                                    resizeMode='contain'
                                                    source={localimag.icon_ellipse}
                                                    style={styles.LogoImage}></Image>
                                            }
                                        </View>
                                    </TouchableHighlight>

                                    <TouchableOpacity
                                        style={[styles.onOffTimer]}
                                        onPress={() => {
                                            setIsRecording(!isRecording);
                                            setIsStopwatchStart(!isStopwatchStart);
                                        
                                        }}>
                                        <View style={styles.onOffInView}>
                                            {!isStopwatchStart ?
                                                <Image
                                                    resizeMode='contain'
                                                    source={localimag.icon_play}
                                                    style={[styles.LogoImage1, { marginLeft: mobileW * 1 / 100 }]}>

                                                </Image>
                                                :
                                                <Image
                                                    resizeMode='contain'
                                                    source={localimag.icon_pause}
                                                    style={[styles.LogoImage1, { marginLeft: mobileW * 0 / 100 }]}>

                                                </Image>
                                            }
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress={() => {navigation.goBack(),  KeepAwake.deactivate()}}>
                                        <View style={{ alignItems: 'center', width: mobileW * 30 / 100 }}>
                                            <Text style={styles.preferenceTxt}>{Lang_chg.cancelRecoding}</Text>
                                            <Image resizeMode='contain'
                                                style={[styles.SideIcons, { tintColor: Colors.lightAccent }]}
                                                source={localimag.icon_close}></Image>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View> :
                            <View style={{}}>
                                <Text style={styles.completeText}>COMPLETED!</Text>

                                <Image
                                    resizeMode='contain'
                                    style={styles.watchIcon1} source={localimag.icon_Check} />

                                {CompleteStatus == 2 &&
                                    <View >
                                        <Text style={[styles.TimeText, { marginTop: mobileH * 3 / 100 }]}
                                        >{formatTime(timer)}</Text>
                                        <View style={{ marginTop: mobileH * 5 / 100 }}>
                                            <CommonButton
                                                onPressClick={() => {
                                                    _AddToGalleryWithoutVideoUrl()
                                                }}
                                                navigation={navigation}
                                                ScreenName={'ChallengeRecords'}
                                                title={Lang_chg.addToGallery}></CommonButton>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                </View>}
        </View >
    );
};
const styles = StyleSheet.create({
    daysTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: mobileW * 2 / 100
    },
    cardView: {
        justifyContent: "center",
        width: mobileW * 82 / 100,
        borderWidth: mobileW * 0.3 / 100,
        borderColor: Colors.lightAccent,
        paddingVertical: mobileW * 3 / 100,
        paddingHorizontal: mobileW * 2 / 100,
        borderRadius: mobileW * 3 / 100,
        // padding: mobileW * 3 / 100,
        paddingBottom: mobileH * 4 / 100,
        backgroundColor: '#00000000',
        marginTop: mobileH * 8 / 100,
        alignSelf: 'center',
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: mobileW * 2 / 100,
        // marginTop: mobileW * -1 / 100
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
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: mobileW * 2 / 100,
    },
    completeText: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: mobileH * 3 / 100
    },
    TimeText: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 11 / 100,
        //   marginTop: mobileH * 2 / 100
    },
    minutestxt: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5.5 / 100,
    },
    everyTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.8 / 100,
        marginTop: mobileW * 3 / 100
    },
    preferenceTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3 / 100,
        marginTop: mobileW * 3 / 100
    },
    startTxt: {
        color: Colors.whiteColor,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100,
        marginBottom: "3%"
    },
    timerText: {
        color: Colors.whiteColor,
        fontFamily: Font.FontBoldFono,
        fontSize: mobileW * 6 / 100,
        textAlign: "center",
        alignSelf: 'center'
    },
    TabInActive: {
        width: mobileW * 35 / 100,
        marginTop: mobileH * 3 / 100,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: mobileW * 10 / 100,
        borderRadius: mobileW * 3 / 100,
        borderWidth: mobileW * 0.3 / 100,
        backgroundColor: Colors.backgroundcolor
    },
    watchIcon1: {
        width: mobileW * 8.5 / 100,
        height: mobileW * 8.5 / 100,
        alignSelf: 'center',
        marginTop: mobileH * 1 / 100
    },
    buttonText: {
        backgroundColor: Colors.whiteColor
    },
    LogoImage: {
        height: mobileW * 14.5 / 100,
        width: mobileW * 14.5 / 100,
        alignSelf: 'center',
        tintColor: 'red'
    },

    LogoImage1: {
        height: mobileW * 8 / 100,
        width: mobileW * 8 / 100,
        alignSelf: 'center',
        tintColor: 'red'
    },


    onOffTimer: {
        width: mobileW * 17 / 100,
        height: mobileW * 17 / 100,
        backgroundColor: Colors.whiteColor,
        borderRadius: mobileW * 8.5 / 100,
        alignSelf: 'center',
        marginTop: mobileH * 5 / 100,
        alignItems: "center",
        justifyContent: 'center'
    },
    onOffInView: {
        width: mobileW * 18 / 100,
        height: mobileW * 18 / 100,
        backgroundColor: '#00000000',
        borderRadius: mobileW * 9 / 100,
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.2 / 100,
        borderColor: Colors.whiteColor,
        justifyContent: "center"
    },
    ReadyTxt: {
        fontSize: mobileW * 5 / 100,
        fontFamily: Font.DrunkBold,
        color: Colors.lightAccent
    },
    Intxt: {
        fontSize: mobileW * 3 / 100,
        fontFamily: Font.FontBoldFono,
        color: Colors.lightAccent
    },
    CounterIcon: {
        width: mobileW * 40 / 100,
        height: mobileW * 40 / 100
    },
    CounterHeadView: {
        width: mobileW,
        paddingHorizontal: mobileW * 8 / 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    watchIcon: {
        width: mobileW * 4 / 100,
        height: mobileW * 4 / 100,
        marginHorizontal: mobileW * 0.5 / 100
    },
    counterTxt: {
        color: Colors.whiteColor,
        fontSize: mobileW * 3 / 100,
        fontFamily: Font.FontBoldFono
    },
    cameraIcon: {
        width: mobileW * 6 / 100,
        height: mobileW * 6 / 100,
        marginHorizontal: mobileW * 0.5 / 100
    },
    whiteLogo: {
        width: mobileW * 20 / 100,
        height: mobileW * 10 / 100,
        marginTop: mobileW * 15 / 100
    },
    SideIcons: {
        width: mobileW * 5 / 100,
        height: mobileW * 5 / 100,
        marginTop: mobileW * 3 / 100
    },








    modalView: {
        width: mobileW * 90 / 100,
        // height:mobileW*60/100, 
        backgroundColor: Colors.backgroundcolor,
        borderRadius: mobileW * 4 / 100,
        padding: mobileW * 5 / 100
    },
    touch: {
        width: mobileW * 5 / 100, justifyContent: "center", alignItems: "center",
        paddingVertical: mobileW * 0.5 / 100
    },
    countPullupsView: {
        width: mobileW * 18 / 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: mobileW * 1 / 100,
        marginBottom: mobileW * 1 / 100,
        borderRadius: mobileW * 1.5 / 100,
        height: mobileW * 14 / 100,
        backgroundColor: Colors.blackColor,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.orangeColor
    },
    placeholderStyle: {
        fontSize: mobileW * 4 / 100,
        fontFamily: Font.DrunkBold,
        marginHorizontal: mobileW * 1 / 100,
        color: Colors.lightAccent,
    },
    selectedTextStyle: {
        fontSize: mobileW * 4 / 100,
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
    },
    iconStyle: {
        width: mobileW * 10 / 100,
        resizeMode: 'contain',
        height: mobileW * 10 / 100,
        tintColor: Colors.whiteColor
    },
    inputSearchStyle: {
        backgroundColor: Colors.blackColor,
        borderColor: Colors.orangeColor,
        borderWidth: mobileW * 0.2 / 100
    },

});

export default VideoRecording;