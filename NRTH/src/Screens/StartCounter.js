import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ImageBackground, Button, TouchableHighlight, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import moment from 'moment'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import KeepAwake from 'react-native-keep-awake';

const StartCounter = ({ navigation }) => {

  const [addcard, setaddcard] = useState()
  const [text, settext] = useState()
  const [complete, setComplete] = useState(false)
  const [minutes_Counter, setminutes_Counter] = useState('01')
  const [seconds_Counter, setseconds_Counter] = useState('59')
  const [startDisable, setstartDisable] = useState(false)
  const [isStopwatchStart, setIsStopwatchStart] = useState(true);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [showStopWatch, setshowStopWatch] = useState(true);
  const [CompleteStatus, setCompleteStatus] = useState(0);
  const [Time, setTime] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [userName, setUserName] = useState("Ac")
  const route = useRoute()
  const challengeItem = route.params?.challengeItem
  const ChallengeTime = route.params?.ChallengeTime


  useEffect(() => {
    CheckUserStatus({ navigation })
    getUserData()
  }, [])

  const getUserData = async () => {
    let UserData = await localStorage.getItemObject("UserData")
    const formattedName = config.getFormateName(UserData.name);
    console.log("UserDataName==>", formattedName)
    setUserName(formattedName)
  }

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


  const stopRecording = async () => {
    setIsRecording(false);
    setTimer(0);
  };


  const _AddToGalleryWithoutVideoUrl = async () => {
    let date = moment().format("YYYY-MM-DD");
    global.props.showLoader();
    // setRefreshing(true);

    let apiUrl = appBaseUrl.AddToGalleryWithoutVideoUrl;

    var postData = JSON.stringify({
        challengeId: challengeItem._id,
        todayDate: date,
        completeTime:formatTime(timer),
        isVideo : 0

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
                navigation.replace('ChallengeRecords', { recordData: response.data.startTodayChallengeByChallengeId, ChallengeTime: response.data.startTodayChallengeByChallengeId.setAlertTime ? response.data.startTodayChallengeByChallengeId.alertClockTime : response.data.startTodayChallengeByChallengeId.alertInternationalTime, })
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
    data.append('todayDate', date)
    data.append('completeTime', formatTime(timer))
    data.append('file', '')


    global.props.showLoader();
    let apiUrl = appBaseUrl.AddToGalleryUrl;
    let headers = {
      "Accept": 'application/json',
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-cache,no-store,must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,
      'Cookie': 'HttpOnly'
    }
    console.log('AddToGalleryApiUrl------>>', data);

    // Make a POST request using Axios
    axios.post(apiUrl, data, { headers })
      .then(async (response) => {
        // Handle the successful response
        console.log("AddToGalleryResponse--->222", response.data);
        if (response.data.ErrorCode == "200") {
          global.props.hideLoader();
          navigation.replace('ChallengeRecords', { recordData: response.data.startTodayChallengeByChallengeId, ChallengeTime: ChallengeTime })
          KeepAwake.deactivate();
        
        } else {
          alert(response.data.ErrorMessage)
          global.props.hideLoader();
        }
      })
      .catch(error => {
        global.props.hideLoader();
        // Handle errors
      });
  }

  const formatTime = (seconds) => {
    let minutes
    if (seconds > 599) {
      minutes = Math.floor(seconds / 60);
    } else {
      minutes = '0' + Math.floor(seconds / 60);
    }
    const remainingSeconds = seconds % 60;
    console.log(minutes);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  useEffect(() => {
    // Enable keep awake when the component mounts
    KeepAwake.activate();

    // Disable keep awake when the component unmounts
    return () => KeepAwake.deactivate();
  }, []);

  const formatStartDay = (day) => {
    const upcomingExercises = day != ''
      && day.customerDayWiseExercises.filter(
        exercise => exercise.status === 'Complete'
      );
    const upcomingCount = upcomingExercises.length;
    return upcomingCount;
  };

  return (
    <View style={{ flex: 1, }}>
      <ImageBackground style={{ height: mobileH, width: mobileW }}
        imageStyle={{ height: mobileH, width: mobileW }}
        source={localimag.backgroud_gradient}>
        {/* --- CArd View --- */}
        <View activeOpacity={0.8} style={styles.cardView}>
          <View style={styles.textView}>
            <TouchableOpacity >
              <Text style={styles.strengthText}>{challengeItem.exercises.exerciseTypes.name}</Text>
            </TouchableOpacity>
            <Text style={styles.eliteText}>{ }</Text>

            <TouchableOpacity>
              <Text style={styles.eliteText}>{challengeItem.levels.name}</Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.pullText}>{challengeItem.exerciseCount+" "+challengeItem.exercises.name}</Text> */}
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={styles.pullText}>{challengeItem.exerciseCount} </Text>
            {challengeItem.exerciseUnits != null &&
              <Text style={styles.pullText}>{challengeItem.exerciseUnits.name} </Text>}
            <Text style={styles.pullText}>{challengeItem.exercises.name}</Text>
          </View>
          <Text style={styles.everyTxt}>{"Every" + challengeItem.exerciseDurations.name.toLowerCase() + " for"}</Text>
          <Text style={[styles.daysTxt, { marginTop: Platform.OS == "ios" ? mobileW * 4 / 100 : mobileW * 3 / 100, }]}>
            {challengeItem.dayCount + " " + challengeItem.exerciseDurations.name}</Text>
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
        {/* --- Stop Watch Section Start */}
        <View style={{}}>
          {CompleteStatus == 0 &&
            <View style={{ marginTop: mobileH * 18 / 100 }}>
              {!isStopwatchStart ?
                <Text style={styles.startTxt}>Paused</Text> :
                // <Text style={styles.startTxt}>In progress</Text>
                <Text style={styles.startTxt}>Starting in</Text>

                }
            </View>}
          {showStopWatch ?
            <View  >
              <Text style={[styles.TimeText, { marginTop: Platform.OS == "ios" ? mobileH * 1 / 100 : 0 }]}>{formatTime(timer)}</Text>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>

                <TouchableOpacity
                  activeOpacity={0.8}
                  // style={styles.onOffTimer}
                  onPress={() => {
                    setIsRecording(false);
                    setIsStopwatchStart(!isStopwatchStart);
                    // if (isStopwatchStart) {
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
                      <Image resizeMode='contain' source={localimag.icon_ellipse} style={styles.LogoImage}></Image>
                    }
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{marginLeft:mobileW*4/100}}
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
              </View>

            </View> :
            <View style={{}}>
              <Text style={styles.completeText}>COMPLETED!</Text>

              <Image
                resizeMode='contain'
                style={styles.watchIcon} source={localimag.icon_Check} />

              {CompleteStatus == 2 &&
                <View >
                  <Text style={[styles.TimeText, { marginTop: mobileH * 5 / 100 }]}>{formatTime(timer)}</Text>
                  {/* <Text style={[styles.minutestxt, { marginTop: Platform.OS == "android" ? mobileW * -3 / 100 : 0, }]}>{Lang_chg.minutes}</Text> */}
                  <View style={{ marginTop: mobileH * 5 / 100 }}>
                    <CommonButton
                      onPressClick={() => {
                        _AddToGalleryWithoutVideoUrl()

                      }}
                      navigation={navigation} ScreenName={'ChallengeRecords'} title={Lang_chg.addToGallery}></CommonButton>
                  </View>
                </View>
              }
            </View>
          }
        </View>
      </ImageBackground>
    </View>
  )
}
export default StartCounter;
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
    borderColor: Colors.mediumDarkGrey,
    paddingVertical: mobileW * 3 / 100,
    paddingHorizontal: mobileW * 2 / 100,
    borderRadius: mobileW * 3 / 100,
    // padding: mobileW * 3 / 100,
    paddingBottom: mobileH * 4 / 100,
    backgroundColor: '#00000000',
    marginTop: mobileH * 15 / 100,
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
    marginTop: mobileH * 7 / 100
  },
  TimeText: {
    color: Colors.whiteColor,
    fontFamily: Font.DrunkBold,
    textAlign: 'center',
    fontSize: mobileW * 11 / 100,
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
  startTxt: {
    color: Colors.whiteColor,
    fontFamily: Font.FontRegularFono,
    textAlign: 'center',
    fontSize: mobileW * 3.5 / 100,
    marginTop: mobileW * 3 / 100,
    marginBottom: "4%"
  },
  timerText: {
    color: Colors.whiteColor,
    fontFamily: Font.FontBoldFono,
    fontSize: mobileW * 6 / 100,
    textAlign: "center",
    alignSelf: 'center'
  },
  LogoImage1: {
    height: mobileW * 8 / 100,
    width: mobileW * 8 / 100,
    alignSelf: 'center',
    tintColor: 'red'
},
  TabInActive: {
    width: mobileW * 35 / 100,
    marginTop: mobileH * 3 / 100,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: mobileW * 10 / 100,
    borderRadius: mobileW * 3 / 100,
    borderWidth: mobileW * 0.3 / 100
  },
  watchIcon: {
    width: mobileW * 8.5 / 100,
    height: mobileW * 8.5 / 100,
    alignSelf: 'center',
    marginTop: mobileH * 1 / 100
  },
  buttonText: {
    backgroundColor: Colors.whiteColor
  },
  LogoImage: {
    height: mobileW * 17.5 / 100,
    width: mobileW * 17.5 / 100,
    alignSelf: 'center',
    borderColor: Colors.backgroundcolor,
    borderRadius: 100,
    borderWidth: mobileW * 1.5 / 100
  },
  onOffTimer: {
    width: mobileW * 19 / 100,
    height: mobileW * 19 / 100,
    backgroundColor: Colors.whiteColor,
    borderRadius: mobileW * 9.5 / 100,
    alignSelf: 'center',
    marginTop: mobileH * 5 / 100,
    alignItems: "center",
    justifyContent: 'center'
  },
  onOffInView: {
    width: mobileW * 18 / 100,
    height: mobileW * 18 / 100,
    backgroundColor: Colors.whiteColor,
    borderRadius: mobileW * 9 / 100,
    alignItems: 'center',
    alignSelf: "center",
    justifyContent: "center",
    marginTop: mobileW * 10 / 100,
  }
});

const options = {
  container: {
    // backgroundColor: '#FF0000',
    borderRadius: 5,
    // width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: Colors.whiteColor,
    fontFamily: Font.DrunkBold,
    textAlign: 'center',
    fontSize: mobileW * 11 / 100,
  },
  LogoImage1: {
    height: mobileW * 8 / 100,
    width: mobileW * 8 / 100,
    alignSelf: 'center',
    tintColor: 'red'
  },

};