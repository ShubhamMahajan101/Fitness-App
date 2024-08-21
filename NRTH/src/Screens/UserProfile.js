import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, FlatList, Alert, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { config } from '../Provider/configProvider'
import { Colors, Font } from '../Provider/Colorsfont'
import { localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { ScrollView } from 'react-native-gesture-handler'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import axios from 'axios'
import moment from 'moment'
import { CheckUserStatus } from '../Components/ApiCallForLogot'

export default function UserProfile({ navigation }) {
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [secureText, setSecureText] = useState(false);
    const [secureTextRepeat, setSecureTextRepeat] = useState(false);
    const [tab, setTab] = useState("strength")
    const [formateUserName, setFormateUserName] = useState("Ac")
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [profile_image, setprofile_image] = useState('NA');
    const [liveList, setLiveList] = useState([])
    const [trophyList, setTrophyList] = useState([])
    // const [cardioLiveList, setCardioLiveList] = useState([])
    // const [cardioTrophyList, setCardioTrophyList] = useState([])

    const isFocused = useIsFocused();
    global.props.hideLoader();

    useEffect(() => {
        setTab('strength')
        CheckUserStatus({ navigation })
        _GetBadgeApiCalling("65b78fa601b49aa9207c060f")
    }, [isFocused])



    const _GetBadgeApiCalling = async (exerciseTypeId) => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);

        setFormateUserName(formattedName)
        setUserName(UserData.name)
        setUserEmail(UserData.email)
        setprofile_image(UserData.profileImageUrl)

        global.props.showLoader();
        let apiUrl = appBaseUrl.GetProfileBadgeUrl;

        var postData = JSON.stringify({
            customerId: UserData._id,
            exerciseTypeId: exerciseTypeId,
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
                    setLiveList(response.data.getAllChallengeByCustomerId)
                    setTrophyList(response.data.trophy)

                } else {
                    Alert.alert("Badge Profile", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();

                // Handle errors
            });
    }

    const _GetBadgeDetailsApiCalling = async (ChallengeId) => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.GetBadgeDetailsUrl;

        var postData = JSON.stringify({
            challengeId: ChallengeId,
            tomorrow: 0,
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

                // Handle errors
            });
    }




    const _Logout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure, You want to logout?', [{
                text: 'No',
                style: 'Yes',
            }, {
                text: 'Yes',
                onPress: () => {
                    localStorage.clear(),
                        navigation.replace('Login')
                }
            }], {
            cancelable: false
        }
        );
    }
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
        // BackHandler.exitApp()
        navigation.navigate("DailyexerciseList")
        return true;
    }



    return (
        <View style={styles.container}>

            <ImageBackground style={{ height: mobileH, width: mobileW }}
                imageStyle={{ height: mobileH, width: mobileW }}
                source={localimag.backgroud_gradient}>

                <Header
                    navigation={navigation}
                    title={Lang_chg.profile[config.language]}
                    firstImage={localimag.icon_back}
                    secondImage=''
                    navigateHome={"Home"} />
                <ScrollView contentContainerStyle={{ paddingBottom: mobileH * 10 / 100 }}>
                    <View>
                        {/* --- Profile Section --- */}
                        <View style={styles.headView}>
                            <View
                                style={styles.ProfileBaseView} >
                                <Image
                                    resizeMode='contain'
                                    style={styles.BlankImageView}
                                ></Image>

                                {profile_image != '' ?
                                    <Image
                                        resizeMode='cover'
                                        source={{ uri: profile_image }}
                                        style={styles.ProfilePicView}></Image>
                                    :
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={styles.ProfilePicView} >
                                        <Text style={styles.profileTxtView}>{formateUserName}</Text>
                                    </TouchableOpacity>

                                }
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('UserEditProfile')}
                                    // onPress={() => navigation.navigate('PaymentHistoryList')}

                                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text
                                        style={[styles.EmailAddtxt]
                                        }>{Lang_chg.editProfile[config.language]}  </Text>

                                    <Image
                                        resizeMode='contain'
                                        style={{ width: mobileW * 4 / 100, height: mobileW * 4 / 100, }}
                                        source={localimag.icon_setting}></Image>
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={[styles.NameStyle]
                                }>{userName}</Text>

                            <Text
                                style={[styles.Emailtxt]
                                }>{userEmail}</Text>
                        </View>

                        {/* --- My badges txt ---  */}
                        <Text
                            style={[styles.myBadgestxt]
                            }>{Lang_chg.MyBadges[config.language]}</Text>

                        <View style={styles.tabBar}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { _GetBadgeApiCalling("65b78fa601b49aa9207c060f"), setTab('strength') }}
                                style={[styles.TabActive,
                                {
                                    borderColor: tab == 'strength' ? Colors.orangeColor : Colors.blackColor,
                                    backgroundColor: tab == 'strength' ? Colors.greyThemeColor : Colors.blackColor
                                }]}>
                                <Text
                                    style={{
                                        color: tab == 'strength' ? Colors.orangeColor : Colors.mediumGreyColor,
                                        fontFamily: Font.DrunkBold,
                                        fontSize: mobileW * 3 / 100
                                    }}>{Lang_chg.strength}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { _GetBadgeApiCalling("65b78fb101b49aa9207c0612"), setTab('cardio') }}
                                style={[styles.TabInActive,
                                {
                                    borderColor: tab == 'cardio' ? Colors.orangeColor : Colors.blackColor,
                                    backgroundColor: tab == 'cardio' ? Colors.greyThemeColor : Colors.blackColor
                                }]}>
                                <Text
                                    style={{
                                        color: tab == 'cardio' ? Colors.orangeColor : Colors.mediumGreyColor,
                                        fontFamily: Font.DrunkBold,
                                        fontSize: mobileW * 3 / 100
                                    }}>{Lang_chg.cardio}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- My badges txt ---  */}
                        <Text
                            style={[styles.liveChallengestxt]
                            }>{Lang_chg.liveChallenges[config.language]}</Text>
                        {
                            liveList <= 0 ?
                                <Text style={[styles.pullText, { paddingVertical: mobileW * 18 / 100 }]}>No Challenge Found</Text>
                                :
                                <FlatList
                                    data={liveList}
                                    horizontal={true}
                                    contentContainerStyle={{ left: mobileW * 5 / 100 }}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <>
                                            <TouchableOpacity
                                                onPress={() => _GetBadgeDetailsApiCalling(item._id)}
                                                // onPress={() => navigation.navigate("DailyexerciseList")}
                                                style={{ marginLeft: mobileW * 3 / 100 }}
                                                activeOpacity={0.8}>
                                                <ImageBackground
                                                    resizeMode='contain'
                                                    style={[styles.watchIcon, { justifyContent: "center", alignItems: "center" }]} source={localimag.icon_ractangle} >
                                                    <Text
                                                        style={[styles.myBadgestxt, { color: Colors.lightAccent }]
                                                        }>{item.startDay + "/" + item.dayCount}
                                                    </Text>
                                                </ImageBackground>

                                            </TouchableOpacity>
                                        </>} />
                        }
                        {/* --- My badges txt ---  */}
                        <Text
                            style={[styles.liveChallengestxt]
                            }>{Lang_chg.trophyCabinet[config.language]}</Text>

                        {
                            trophyList <= 0 ?
                                <Text style={[styles.pullText, { paddingVertical: mobileW * 18 / 100 }]}>No Trophy Found</Text>
                                :
                                <FlatList
                                    data={trophyList}
                                    horizontal={true}
                                    contentContainerStyle={{ left: mobileW * 1 / 100, right: mobileW * 3 / 100 }}
                                    showsVerticalScrollIndicator={false}
                                    // showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: "row", alignItems: "center", marginLeft: mobileW * 4 / 100
                                                }}
                                            >
                                                {/* {item.levels.name == "Beginner" && */}

                                                {item.levels.name.toLowerCase() == "beginner" &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("EarnedBadgesDetails", { recordData: item })}>


                                                        <ImageBackground resizeMode='contain'
                                                            imageStyle={{
                                                                width: mobileW * 50 / 100, height: mobileW * 25 / 100,
                                                                borderRadius: mobileW * 3 / 100,
                                                            }}
                                                            style={{

                                                                marginTop: mobileH * 3 / 100,
                                                                elevation: 5, width: mobileW * 50 / 100, height: mobileW * 25 / 100,
                                                                borderRadius: mobileW * 5 / 100,
                                                            }}
                                                            source={localimag.Icon_beginner_badge}>
                                                            <View >
                                                                <View style={{
                                                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                                                    marginTop: Platform.OS == "ios" ? mobileW * 4 / 100 : mobileW * 3 / 100
                                                                }}>
                                                                    <Text style={{
                                                                        fontSize: mobileW * 2 / 100,
                                                                        fontFamily: Font.DrunkBold, color: Colors.lightAccent,
                                                                        marginLeft: mobileW * 5 / 100
                                                                    }}>{item.levels.name.toUpperCase()}</Text>
                                                                    <View style={{ flexDirection: 'row', marginRight: mobileW * 3 / 100 }}>

                                                                        <Text style={{
                                                                            fontSize: mobileW * 1 / 100, fontFamily: Font.FontRegularFono,
                                                                            color: Colors.lightAccent, marginHorizontal: mobileW * 2 / 100
                                                                        }}>{item.userbadges.createdAt != null && moment(item.userbadges.createdAt).format("DD-MM-YYYY")}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{ flexDirection: "row", justifyContent: 'space-between', }}>
                                                                    <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 3 / 100 : 0, width: mobileW * 24 / 100, height: mobileW * 10 / 100, }}>
                                                                        <Text style={{
                                                                            fontSize: mobileW * 4 / 100, fontFamily: Font.DrunkBold,
                                                                            textAlign: 'center', color: Colors.backgroundcolor
                                                                        }}>{item.exerciseCount}</Text>
                                                                        <View style={{
                                                                            width: mobileW * 10 / 100, height: mobileW * 3.5 / 100,
                                                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * 0.5 / 100, justifyContent: 'center', alignItems: 'center',
                                                                            borderTopLeftRadius: mobileW * 1 / 100, borderTopRightRadius: mobileW * 1 / 100,
                                                                            backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                                                        }}>
                                                                            <Text style={{
                                                                                fontSize: mobileW * 1 / 100,
                                                                                color: Colors.lightAccent,
                                                                                fontFamily: Font.DrunkBold
                                                                            }}> {item.exercises.name.toUpperCase()}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 3 / 100 : mobileW * 0 / 100, width: mobileW * 24 / 100, height: mobileW * 10 / 100, }}>
                                                                        <Text style={{
                                                                            fontSize: mobileW * 4 / 100, textAlign: 'center',
                                                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                                                        }}>{item.dayCount}</Text>
                                                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : mobileW * 0.5 / 100, }}>
                                                                            <View style={{
                                                                                width: mobileW * 8 / 100, marginLeft: mobileW * 1 / 100,
                                                                                height: mobileW * 3.5 / 100, justifyContent: 'center', alignItems: 'center',
                                                                                borderTopLeftRadius: mobileW * 1 / 100, borderTopRightRadius: mobileW * 1 / 100,
                                                                                backgroundColor: Colors.backgroundcolor,
                                                                            }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 1 / 100, color: Colors.lightAccent,
                                                                                    fontFamily: Font.FontRegularFono
                                                                                }}>{"Every" + item.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                                                            </View>
                                                                            <View style={{
                                                                                width: mobileW * 6 / 100,
                                                                                height: mobileW * 4 / 100, marginLeft: mobileW * 5.8 / 100,
                                                                                justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 1 / 100,
                                                                                borderTopRightRadius: mobileW * 1 / 100, backgroundColor: Colors.backgroundcolor,
                                                                                alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                                                            }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 1 / 100, color: Colors.lightAccent,
                                                                                    marginTop: mobileW * -1 / 100, fontFamily: Font.DrunkBold
                                                                                }}>{item.exerciseDurations.name.toUpperCase()}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <Text style={{ fontSize: mobileW * 2 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? 0 : mobileW * 0.5 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                                                                <Text style={{ fontSize: mobileW * 1 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? 0 : 0, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>C O M P L E T E D</Text>

                                                            </View>
                                                        </ImageBackground>
                                                    </TouchableOpacity>

                                                }


                                                {item.levels.name.toLowerCase() == "elite" &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("EarnedBadgesDetails", { recordData: item })}>
                                                        <ImageBackground resizeMode='contain' imageStyle={{
                                                            width: mobileW * 30 / 100, height: mobileW * 30 / 100,
                                                            borderRadius: mobileW * 5 / 100,
                                                        }} style={{
                                                            width: mobileW * 30 / 100, height: mobileW * 30 / 100,
                                                            borderRadius: mobileW * 3 / 100,
                                                            marginTop: mobileH * 3 / 100,
                                                        }}
                                                            source={localimag.icon_elite_badge}>
                                                            <View>
                                                                <Text style={{
                                                                    fontSize: mobileW * 2 / 100, textAlign: "center", marginTop: mobileW * 6 / 100,
                                                                    fontFamily: Font.DrunkBold, color: Colors.lightAccent,
                                                                }}>{item.levels.name.toUpperCase()}</Text>
                                                                <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 3 / 100 : 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <View style={{
                                                                        width: mobileW * 14.5 / 100, height: mobileW * 5.5 / 100,
                                                                        marginTop: mobileW * 1 / 100,
                                                                    }}>
                                                                        <Text style={{
                                                                            fontSize: mobileW * 3 / 100, textAlign: 'right',
                                                                            marginRight: mobileW * 1 / 100, fontFamily: Font.DrunkBold,
                                                                            color: Colors.backgroundcolor, marginTop: mobileW * -1 / 100
                                                                        }}>{item.exerciseCount}</Text>
                                                                        <View style={{
                                                                            width: mobileW * 10 / 100, height: mobileW * 3 / 100,
                                                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * -0.5 / 100, justifyContent: 'center', alignItems: 'center',
                                                                            borderTopLeftRadius: mobileW * 1 / 100, borderTopRightRadius: mobileW * 1 / 100, backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 0.5 / 100
                                                                        }}>
                                                                            <Text style={{
                                                                                fontSize: mobileW * 1 / 100, color: Colors.lightAccent, marginTop: mobileW * -1 / 100,
                                                                                fontFamily: Font.DrunkBold
                                                                            }}>
                                                                                {item.exercises.name.toUpperCase()}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ width: mobileW * 14.5 / 100, height: mobileW * 5.5 / 100, marginTop: mobileW * 1 / 100 }}>
                                                                        <Text style={{
                                                                            fontSize: mobileW * 3 / 100, textAlign: 'left', marginLeft: mobileW * 1 / 100, marginTop: mobileW * -1 / 100,
                                                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                                                        }}>{item.dayCount}</Text>
                                                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : -0.5, }}>
                                                                            <View style={{ marginLeft: mobileW * 0.2 / 100, justifyContent: 'center', alignItems: 'center', }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 1 / 100, color: Colors.backgroundcolor, marginTop: mobileW * -1 / 100,
                                                                                    fontFamily: Font.FontRegularFono
                                                                                }}>
                                                                                    {"Every" + item.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                                                            </View>
                                                                            <View style={{
                                                                                width: mobileW * 4 / 100, height: mobileW * 2.5 / 100, marginLeft: mobileW * 0.5 / 100,
                                                                                justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 0.5 / 100,
                                                                                borderTopRightRadius: mobileW * 0.5 / 100, backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                                                            }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 0.9 / 100, color: Colors.lightAccent, marginTop: mobileW * -0.5 / 100,
                                                                                    fontFamily: Font.DrunkBold
                                                                                }}>{item.exerciseDurations.name.toUpperCase()}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <Text style={{ fontSize: mobileW * 1.8 / 100, textAlign: "center", marginTop: mobileW * 1 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                                                            </View>
                                                        </ImageBackground>
                                                    </TouchableOpacity>

                                                }

                                                {item.levels.name.toLowerCase() == "savage" &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("EarnedBadgesDetails", { recordData: item })}>
                                                        <ImageBackground resizeMode='contain' imageStyle={{
                                                            width: mobileW * 30 / 100, height: mobileW * 30 / 100,
                                                            borderRadius: mobileW * 3 / 100,
                                                        }} style={{
                                                            marginTop: mobileH * 3 / 100,
                                                            width: mobileW * 30 / 100, height: mobileW * 30 / 100, borderRadius: mobileW * 2 / 100,
                                                        }}
                                                            source={localimag.icon_savage_badge}>
                                                            <View>

                                                                <Text style={{
                                                                    fontSize: mobileW * 2 / 100, textAlign: "center", fontFamily: Font.DrunkBold, marginTop: mobileW * 1 / 100,
                                                                    color: Colors.lightAccent,
                                                                    marginTop: mobileW * 6 / 100,
                                                                }}>{item.levels.name.toUpperCase()}</Text>

                                                                <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 3 / 100 : 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <View style={{ width: mobileW * 14.5 / 100, height: mobileW * 5.5 / 100, marginTop: mobileW * 1 / 100 }}>
                                                                        <Text style={{
                                                                            marginTop: mobileW * -1 / 100,
                                                                            fontSize: mobileW * 3 / 100, textAlign: 'right', marginRight: mobileW * 1 / 100,
                                                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                                                        }}>{item.exerciseCount}</Text>
                                                                        <View style={{
                                                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * -0.5 / 100,
                                                                            width: mobileW * 8.5 / 100, height: mobileW * 2.5 / 100,
                                                                            justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 1 / 100,
                                                                            borderTopRightRadius: mobileW * 1 / 100, backgroundColor: Colors.backgroundcolor,
                                                                            alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                                                        }}>
                                                                            <Text style={{
                                                                                fontSize: mobileW * 1 / 100, color: Colors.lightAccent, marginTop: mobileW * -0.5 / 100,
                                                                                fontFamily: Font.DrunkBold
                                                                            }}>{item.exercises.name.toUpperCase()}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ width: mobileW * 14.5 / 100, height: mobileW * 3 / 100, marginTop: mobileW * 1 / 100 }}>
                                                                        <Text style={{
                                                                            marginTop: mobileW * -1 / 100,
                                                                            fontSize: mobileW * 3 / 100, textAlign: 'left', marginLeft: mobileW * 1 / 100,
                                                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                                                        }}>{item.dayCount}</Text>
                                                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : 0, }}>
                                                                            <View style={{ marginLeft: mobileW * 0.2 / 100, justifyContent: 'center', alignItems: 'center', }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 1 / 100, color: Colors.backgroundcolor, marginTop: mobileW * -0.5 / 100,
                                                                                    fontFamily: Font.FontRegularFono
                                                                                }}>{"Every" + item.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                                                            </View>
                                                                            <View style={{
                                                                                width: mobileW * 4 / 100, height: mobileW * 2.5 / 100,
                                                                                marginLeft: mobileW * 0.5 / 100, justifyContent: 'center', alignItems: 'center',
                                                                                borderTopLeftRadius: mobileW * 1 / 100, borderTopRightRadius: mobileW * 1 / 100,
                                                                                backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                                                            }}>
                                                                                <Text style={{
                                                                                    fontSize: mobileW * 0.9 / 100, color: Colors.lightAccent, marginTop: mobileW * -0.5 / 100,
                                                                                    fontFamily: Font.DrunkBold
                                                                                }}>{item.exerciseDurations.name.toUpperCase()}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <Text style={{ fontSize: mobileW * 1.8 / 100, textAlign: "center", marginTop: mobileW * 1 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                                                                <Text style={{ fontSize: mobileW * 0.8 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? mobileW * 1 / 100 : mobileW * 0 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>C O M P L E T E D</Text>
                                                                <Text style={{ fontSize: mobileW * 1 / 100, textAlign: "center", marginTop: mobileW * 2 / 100, fontFamily: Font.FontRegularFono, color: Colors.lightAccent, }}>{item.userbadges.createdAt != null && moment(item.userbadges.createdAt).format("DD-MM-YYYY")}</Text>


                                                            </View>
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </>} />

                        }
                    </View>
                    <View
                        style={styles.BottomView}>
                        <CommonButton
                            onPressClick={() => {
                                _Logout()
                            }}
                            ScreenName={'Login'}
                            navigation={navigation}
                            title={Lang_chg.logOut[config.language]}></CommonButton>
                    </View>
                </ScrollView>

            </ImageBackground>


        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
    },
    headView: {
        width: mobileW,
        backgroundColor: Colors.blackColor,
        paddingBottom: mobileH * 3 / 100
    },
    EmailAddtxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3 / 100,
        color: Colors.whiteColor
    },
    NameStyle: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 4 / 100,
        color: Colors.whiteColor
    },
    Emailtxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        textAlign: 'center',
        fontSize: mobileW * 3.2 / 100,
        marginTop: mobileH * 1 / 100,
        color: Colors.whiteColor
    },
    ProfileBaseView: {
        width: mobileW,
        backgroundColor: Colors.blackColor,
        paddingVertical: mobileH * 2 / 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: mobileH * 1 / 100
    },
    BlankImageView: {
        width: mobileW * 26 / 100,
        height: mobileW * 6 / 100
    },
    ProfilePicView: {
        backgroundColor: Colors.IconBG,
        width: mobileW * 25 / 100,
        height: mobileW * 25 / 100,
        borderRadius: mobileW * 12.5 / 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileTxtView: {
        color: Colors.whiteColor,
        fontSize: mobileW * 7 / 100,
        fontFamily: Font.FontRegularFono
    },
    myBadgestxt: {
        fontSize: mobileH * 2.2 / 100,
        paddingVertical: mobileH * 2 / 100,
        color: Colors.orangeColor,
        fontFamily: Font.DrunkBold,
        textAlign: 'center'
    },
    tabBar: {
        width: mobileW * 85 / 100,
        height: mobileW * 12 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: mobileW * 3 / 100,
        flexDirection: 'row',
        backgroundColor: Colors.blackColor,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.mediumDarkGrey,
        marginTop: mobileW * 1 / 100,
        alignSelf: 'center'
    },
    TabActive: {
        width: mobileW * 42.5 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: mobileW * 11.6 / 100,
        borderRadius: mobileW * 3 / 100,
        borderWidth: mobileW * 0.3 / 100
    },
    TabInActive: {
        width: mobileW * 42.5 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: mobileW * 11.6 / 100,
        borderRadius: mobileW * 3 / 100,
        borderWidth: mobileW * 0.3 / 100
    },
    liveChallengestxt: {
        fontSize: mobileH * 1.6 / 100,
        paddingVertical: mobileH * 2.5 / 100,
        color: Colors.whiteColor,
        left: mobileW * 8 / 100,
        fontFamily: Font.DrunkBold,
    },
    watchIcon: {
        width: mobileW * 30 / 100,
        height: mobileW * 30 / 100,
        alignSelf: "flex-end",
        right: mobileW * 4 / 100

    },
    pullText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100
    },
    BottomView: {
        height: mobileH * 12 / 100,
        marginTop: mobileH * 2 / 100,

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blackColor,
        elevation: 0.5,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
    }
})

