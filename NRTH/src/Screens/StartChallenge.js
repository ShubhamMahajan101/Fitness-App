import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Platform, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import moment from 'moment'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import LinearGradient from 'react-native-linear-gradient'
import CalendarPicker from 'react-native-calendar-picker';
import { useRoute } from '@react-navigation/native'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
// import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'
import BottomTab from '../Components/BottomTab'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import zone from 'moment-timezone';

export default function StartChallenge({ navigation }) {
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState(false)
  const route = useRoute()
  const isNextChallenge = route.params?.isNextChallenge
  const challengeItem = route.params?.challengeItem
  const ChallengeTime = route.params?.ChallengeTime
  const [timeZone, setTimeZone] = useState("")
  const [userName, setUserName] = useState("Ac")
  const generateArrayOfObjects = (length, defaultObject) => {
    return Array.from({ length }, (_, index) => ({ ...defaultObject, id: index }));
  };

  const defaultObject = { key1: 'value1', key2: 'value2' };
  const placeholderArray = generateArrayOfObjects(challengeItem.dayCount, defaultObject);

  const currentDate = new Date();
  let previousDate = challengeItem != ''
    && challengeItem.endDate;

  let listLength = challengeItem.customerDayWiseExercises != '' && parseInt(challengeItem.customerDayWiseExercises.length);

  let isEndVisible = false;
 
  let isEndVisibleEmpty = false;

  for (let i = 1; i <= listLength; i++) {
    const result = 7 * i - 1;
    if (result == listLength) {
      isEndVisible = true;
    }
  }

  for (let i = 1; i <= placeholderArray.length; i++) {
    const result = 7 * i - 1;
    if (result == placeholderArray.length) {
      isEndVisibleEmpty = true;
    }
  }


  useEffect(() => {
    const currentTimeZone = zone.tz.guess();
    setTimeZone(currentTimeZone)
  }, []);

  useEffect(() => {
    getUserData()
    CheckUserStatus({ navigation })
  }, [])

  const getUserData = async () => {
    let UserData = await localStorage.getItemObject("UserData")
    const formattedName = config.getFormateName(UserData.name);

    setUserName(formattedName)
    // listLength = challengeItem.customerDayWiseExercises.length;
    // console.log("listLength----->New-----", listLength);

  }

  const _StartChallengeCallingApi = async (isVideoRecording) => {
    let date = moment().format("YYYY-MM-DD");

    global.props.showLoader();
    let apiUrl = appBaseUrl.StartChallengeUrl;
    const currentTimeZone = zone.tz.guess();
    var postData = JSON.stringify({
      challengeId: challengeItem._id,
      todayDate: date,
      timeZone: currentTimeZone
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
          isVideoRecording ?
            navigation.replace('VideoRecording', { challengeItem: challengeItem, ChallengeTime: ChallengeTime }) :
            navigation.replace('SplashCounter', { challengeItem: challengeItem, ChallengeTime: ChallengeTime });
        
        } else {
          Alert.alert("Start Challenge", response.data.ErrorMessage);
          global.props.hideLoader();
        }
      })
      .catch(error => {
        global.props.hideLoader();
       
        // Handle errors
      });

  }

  const onDateChange = (date, type) => {
    let newDate = moment(date).format('DD-MM-YYYY')
    setSelectedStartDate(newDate);
  };
  

  const formatStartDay = (day) => {
   
    return upcomingCount;
  };

  // Define a separate component for your footer
  const FooterComponent = ({ }) => {
    return (
      listLength % 7 == 0 || listLength % 6 == 0 || isEndVisible?
        <View style={{ alignItems: "flex-end", marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
          <View style={{ width: mobileW * 16 / 100 }}>
            <Text style={styles.DateTxt}>End Date</Text>
            <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(previousDate).format("DD-MM-YYYY")}</Text>
          </View>
        </View>
        : null
    );
  };
  const FooterComponentForEmptyArray = ({ }) => {
    return (
      placeholderArray.length % 7 === 0 || placeholderArray.length % 6 === 0 || isEndVisibleEmpty?
        <View style={{ alignItems: "flex-end", marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
          <View style={{ width: mobileW * 16 / 100 }}>
            <Text style={styles.DateTxt}>End Date</Text>
            <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment().add(placeholderArray.length - 1, 'days').format("DD-MM-YYYY")}</Text>
          </View>
        </View>
        : null
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
      <Header navigation={navigation} title={Lang_chg.startChallenge} firstImage={localimag.icon_back} secondImage={userName} navigateHome={"Home"}></Header>

      <ScrollView style={{ marginBottom: mobileH * 3 / 100 }}>
        <View>
          {isNextChallenge ?
            <Text style={styles.areYoureadyText}>{Lang_chg.nextChallengeCapitalTxt}</Text>
            :
            <Text style={styles.areYoureadyText}>{Lang_chg.areYouReady}</Text>
          }
          <LinearGradient
            colors={['#EB6519', '#666666',]}
            style={styles.gradientCss}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 0.7 }}
          >
            <View style={styles.cardView}>
              <View style={styles.cardHeaderView}>
                <Text style={{
                  color: Colors.mediumGreyColor, fontFamily: Font.DrunkBold,
                  fontSize: mobileW * 2.5 / 100
                }}>{challengeItem.exercises.exerciseTypes.name}</Text>

                <Text style={styles.eliteText}>{ }</Text>

                <Text style={styles.eliteText}>{challengeItem.levels.name}</Text>

              </View>
              <View style={{ alignItems: 'center' }}>
               
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{
                    color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                    fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                  }}>{challengeItem.exerciseCount} </Text>
                  {challengeItem.exerciseUnits != null &&
                    <Text style={{
                      color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                      fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                    }}>{challengeItem.exerciseUnits.name} </Text>}
                  <Text style={{
                    color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                    fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                  }}>{challengeItem.exercises.name}</Text>
                </View>
                <Text style={styles.everydayForText}>{"Every" + challengeItem.exerciseDurations.name.toLowerCase() + " for"}</Text>
                <Text style={{
                  marginTop: Platform.OS == "ios" ? mobileW * 2 / 100 : 0,
                  color: Colors.lightAccent, fontFamily: Font.DrunkBold,
                  fontSize: mobileW * 6 / 100
                }}>
                  {challengeItem.dayCount + " " + challengeItem.exerciseDurations.name}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: mobileW * 4 / 100, marginHorizontal: mobileW * 3 / 100 }}>
                <View style={styles.selecteDateView}>
                  <Text style={{
                    color: Colors.orangeColor, fontSize: mobileW * 3.5 / 100,
                    fontFamily: Font.FontRegularFono
                  }}>{challengeItem.startDay + "/" + challengeItem.dayCount}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                  {/* <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontRegularFono, marginHorizontal: mobileW * 2 / 100, color: Colors.lightAccent }}>{ChallengeTime}</Text> */}
                  <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontRegularFono, marginHorizontal: mobileW * 2 / 100, color: Colors.lightAccent }}>{ChallengeTime != '' ? (zone.tz(moment(moment().format(`YYYY-MM-DDT${ChallengeTime}:00.000+0000`)), timeZone).format("hh:mm a")) : ''}</Text>

                  <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100, }}
                    source={localimag.icon_time_white}></Image>
                </View>

              </View>
            </View>

          </LinearGradient>

        
          <View style={{ width: mobileW * 88 / 100, alignSelf: 'center', marginTop: mobileH * 3 / 100 }}>
            <View style={{ flexDirection: "row", width: mobileW * 88 / 100, justifyContent: "space-between" }}>
              <View>
                <Text style={styles.DateTxt}>Start Date</Text>
                <Text style={[styles.DateTxt, {
                  alignSelf: "center", marginTop: mobileH * 0.3 / 100
                }]}>{challengeItem.startDate == null ? moment(new Date()).format("DD-MM-YYYY") : moment(challengeItem.startDate).format("DD-MM-YYYY")}</Text>
              </View>

              <View>
                <Text style={styles.DateTxt}>Current Date</Text>
                <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(new Date()).format("DD-MM-YYYY")}</Text>
              </View>
            </View>
            {challengeItem.customerDayWiseExercises != '' ?
              <FlatList
                data={challengeItem.customerDayWiseExercises}
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
                        item.status == "Upcomming" || item.status == "Start" ?
                          null : item.videoUrl == "" && item.status == "Complete" ?
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
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("VideoPlayer", { recordData: challengeItem, Index: index })} >
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
                    {listLength % 7 === 0 || listLength % 6 === 0 ||isEndVisible? null :
                      challengeItem.customerDayWiseExercises.length == item.exerciseCount &&
                      <View style={{ marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
                        <Text style={styles.DateTxt}>End Date</Text>
                        <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(previousDate).format("DD-MM-YYYY")}</Text>
                      </View>
                    }
                  </View>
                } />
              :
              <FlatList
                data={placeholderArray}
                numColumns={7}
                // horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={<FooterComponentForEmptyArray lastItemText={previousDate} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ justifyContent: "center", paddingBottom: mobileH * 10 / 100 }}
                renderItem={({ item, index }) => (
                  <View style={{ alignItems: "center", alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                      backgroundColor: '#0000090', borderRadius: mobileW * 5.5 / 100, height: mobileW * 11 / 100,
                      width: mobileW * 11 / 100, borderWidth: mobileW * 0.1 / 100,
                      borderColor: Colors.lightAccent, marginRight: mobileW * 1.8 / 100,
                      marginTop: mobileW * 2 / 100, alignItems: 'center', justifyContent: 'center',
                    }}>
                    </View>
                    {placeholderArray.length % 7 === 0 || placeholderArray.length % 6 === 0 || isEndVisibleEmpty ? null :
                      placeholderArray.length == index + 1 &&
                      <View style={{ marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
                        <Text style={styles.DateTxt}>End Date</Text>
                        <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment().add(placeholderArray.length - 1, 'days').format("DD-MM-YYYY")}</Text>
                      </View>
                    }
                  </View>
                )}
              />
            }
          </View>
        </View>
      </ScrollView>

      {challengeItem.todaycustomerDayWiseExercises.status == "Complete" ? console.log("CompleteDoNotClick") :

        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
          <CommonButton
            onPressClick={() => {
              _StartChallengeCallingApi(true)
            }}
            navigation={navigation} ScreenName={'VideoRecording'} title={Lang_chg.startNow} />
          {/* <CommonButton  title={Lang_chg.startNow} ></CommonButton> */}

          {isNextChallenge ?
            <TouchableOpacity
              onPress={() => navigation.navigate('DailyexerciseList')}
              activeOpacity={0.6}
              style={{
                alignSelf: "center", justifyContent: "center",
                height: mobileW * 12 / 100, width: mobileW * 75 / 100,
                alignItems: "center", borderRadius: mobileW * 3.5 / 100,
                backgroundColor: Colors.mediumDarkGrey, marginTop: mobileW * 3 / 100,

              }}>
              <Text
                style={{
                  fontFamily: Font.FontRegularFono,
                  fontSize: mobileW * 4.2 / 100,
                  color: Colors.lightAccent
                }}>{"Pause"}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={{ marginBottom: mobileW * 9 / 100 }}
              activeOpacity={0.8}
              onPress={() => _StartChallengeCallingApi(false)}>
              <Text style={{ fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 5 / 100, color: Colors.lightAccent, fontFamily: Font.FontRegularFono }}>{Lang_chg.startWithoutVideo}</Text>
            </TouchableOpacity>
          }
        </View>

      }
      <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>


    </View>

  )
}



const styles = StyleSheet.create({
  calender_view: {
    // backgroundColor: Colors.whiteColor,
    alignSelf: "center",
    marginTop: mobileW * 3 / 100,
    // marginLeft: mobileW * 5 / 100,
  },
  areYoureadyText: {
    color: Colors.lightAccent,
    alignSelf: 'center',
    marginTop: mobileW * 5 / 100,
    fontFamily: Font.DrunkBold,
    fontSize: mobileW * 5 / 100
  },
  gradientCss: {
    width: mobileW * 88.4 / 100,
    padding: mobileW * 0.2 / 100,
    marginTop: mobileW * 5 / 100,
    alignSelf: 'center',
    borderRadius: mobileW * 4 / 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardView: {
    width: mobileW * 88 / 100,
    paddingBottom: mobileW * 3 / 100,
    borderRadius: mobileW * 4 / 100,
    backgroundColor: Colors.blackColor
  },
  cardHeaderView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: mobileW * 3.5 / 100,
    paddingVertical: mobileW * 3 / 100,

  },
  eliteText: {
    color: Colors.orangeColor,
    fontFamily: Font.DrunkBold,
    fontSize: mobileW * 2.5 / 100,

  },
  cardHeaderImage: {
    width: mobileW * 11 / 100,
    height: mobileW * 11 / 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  everydayForText: {
    color: Colors.lightAccent,
    fontFamily: Font.FontRegularFono,
    // marginTop: mobileW * 1 / 100, 
    // marginBottom: mobileW * 1 / 100, 
    fontSize: mobileW * 3.5 / 100
  },
  selecteDateView: {
    padding: mobileW * 1.5 / 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: mobileW * 30 / 100,
    borderRadius: mobileW * 2 / 100,
    borderWidth: mobileW * 0.2 / 100,
    borderColor: Colors.orangeColor
  },
  Privious_icon: {
    width: mobileW * 5 / 100,
    height: mobileW * 5 / 100,
    tintColor: Colors.lightAccent
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
})