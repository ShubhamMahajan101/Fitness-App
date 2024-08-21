import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileW } from '../Provider/utilslib/Utils'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import BottomTab from '../Components/BottomTab'
import { CheckUserStatus } from '../Components/ApiCallForLogot'


export default function Home({ navigation }) {
    const [selectcard, setSelectCard] = useState('')
    const [beginnerlist, setBeginners] = useState([])
    const [elitelist, setElite] = useState([])
    const [savagelist, setSavege] = useState([])
    const [userName, setUserName] = useState("Ac")
    const isFocused = useIsFocused();


    useEffect(() => {
        getUserData()
        _LevelApiCalling()
        CheckUserStatus({ navigation })
        global.props.showLoader();

        setTimeout(() => {
            global.props.hideLoader();
        }, 1500);
        setSelectCard('beginners')
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

    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
    }


    const _LevelApiCalling = async () => {
        // global.props.showLoader();
        let apiUrl = appBaseUrl.HomeLevelUrl;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.get(apiUrl, { headers })
            .then(async (response) => {
                console.log('homeResponse--->>>', response.data);

                // Handle the successful response
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    setBeginners(response.data.getAllLevelWithExercises[0])
                    setElite(response.data.getAllLevelWithExercises[1])
                    setSavege(response.data.getAllLevelWithExercises[2])

                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('homeLevelError---', error);
                // Handle errors
            });
    }



    return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
            <Header navigation={navigation} title={Lang_chg.challengeConfigurator} secondImage={userName}></Header>
            
            <View style={{ flex: 1, width: mobileW * 80 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                {beginnerlist != '' &&
                    <>
                        <Text style={{ marginBottom: mobileW * 2 / 100, color: Colors.orangeColor, fontFamily: Font.FontRegularFono, fontSize: mobileW * 4 / 100 }}>{Lang_chg.selectLeveltxt}</Text>

                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => {
                                setSelectCard("beginners"),
                                    setTimeout(() => {
                                        navigation.navigate('AddChallenges', { isSelectLevel: 'beginner' })
                                    }, 100);
                            }}
                            style={[styles.cardView, { backgroundColor: selectcard == 'beginners' ? Colors.orangeColor : Colors.blackColor }]}>

                            <Text style={[styles.cardTitle,]}>{beginnerlist.name.toUpperCase()}</Text>
                            {beginnerlist.levelExerciseTypes != '' &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS == "ios" ? mobileW * 10 / 100 : mobileW * 5 / 100 }}>


                                    <Text style={{
                                        color: selectcard == 'beginners' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {beginnerlist.levelExerciseTypes[1].exerciseTypes.name}</Text>
                                    <Text style={{
                                        color: Colors.lightAccent, fontFamily: Font.FontBold,
                                        fontSize: mobileW * 4 / 100
                                    }}>
                                        {beginnerlist.levelExerciseTypes[1].minExerciseCount + "-"
                                            + beginnerlist.levelExerciseTypes[1].maxExerciseCount + " reps/"
                                            + beginnerlist.levelExerciseTypes[1].exerciseDurations.name.toLowerCase() + " "
                                        }</Text>
                                </View>
                            }
                            {beginnerlist.levelExerciseTypes != '' &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 1 / 100 }}>
                                    <Text style={{
                                        color: selectcard == 'beginners' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {beginnerlist.levelExerciseTypes[0].exerciseTypes.name}</Text>
                                    <Text style={{
                                        color: Colors.lightAccent, fontFamily: Font.FontBold,
                                        fontSize: mobileW * 4 / 100,
                                    }}>{beginnerlist.levelExerciseTypes[0].minExerciseCount + "-"
                                        + beginnerlist.levelExerciseTypes[0].maxExerciseCount + " "
                                        // + beginnerlist.levelExerciseTypes[0].exerciseDurations.name + " "
                                        + beginnerlist.levelExerciseTypes[0].exerciseUnits.name + "  "}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </>
                }
                {elitelist != '' &&
                    <TouchableOpacity activeOpacity={0.8}
                        onPress={() => {
                            setSelectCard("elite"),
                                setTimeout(() => {
                                    navigation.navigate('AddChallenges', { isSelectLevel: 'elite' })
                                }, 100);
                        }}
                        style={[styles.cardView, { backgroundColor: selectcard == 'elite' ? Colors.orangeColor : Colors.blackColor }]}>

                        <Text style={[styles.cardTitle,]}>{elitelist.name.toUpperCase()}</Text>


                        {elitelist.levelExerciseTypes != '' && (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS == "ios" ? mobileW * 10 / 100 : mobileW * 5 / 100 }}>
                                    <Text style={{
                                        color: selectcard == 'elite' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {elitelist.levelExerciseTypes[1].exerciseTypes.name}</Text>
                                    <Text style={{ color: Colors.lightAccent, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>
                                        {elitelist.levelExerciseTypes[1].minExerciseCount + "-"
                                            + elitelist.levelExerciseTypes[1].maxExerciseCount + " reps/"
                                            + elitelist.levelExerciseTypes[1].exerciseDurations.name.toLowerCase() + " "
                                        }
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 1 / 100 }}>
                                    <Text style={{
                                        color: selectcard == 'elite' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {elitelist.levelExerciseTypes[0].exerciseTypes.name}</Text>
                                    <Text style={{
                                        color: Colors.lightAccent, fontFamily: Font.FontBold,
                                        fontSize: mobileW * 4 / 100,
                                    }}>
                                        {elitelist.levelExerciseTypes[0].minExerciseCount + "-"
                                            + elitelist.levelExerciseTypes[0].maxExerciseCount + " "
                                            // + elitelist.levelExerciseTypes[0].exerciseDurations.name + " "
                                            + elitelist.levelExerciseTypes[0].exerciseUnits.name + "  "}
                                    </Text>
                                </View>
                            </>)}
                    </TouchableOpacity>
                }

                {savagelist != '' &&
                    <TouchableOpacity onPress={() => {
                        setSelectCard("savage"),
                            setTimeout(() => {
                                navigation.navigate('AddChallenges', { isSelectLevel: 'savage' })
                            }, 100);
                    }} activeOpacity={0.8} style={[styles.cardView, { backgroundColor: selectcard == 'savage' ? Colors.orangeColor : Colors.blackColor }]}>
                        <Text style={styles.cardTitle}>{savagelist.name.toUpperCase()}</Text>
                        {savagelist.levelExerciseTypes != '' && (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS == "ios" ? mobileW * 10 / 100 : mobileW * 5 / 100 }}>
                                    <Text style={{
                                        color: selectcard == 'savage' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {savagelist.levelExerciseTypes[1].exerciseTypes.name}</Text>
                                    <Text style={{
                                        color: Colors.lightAccent, fontFamily: Font.FontBold,
                                        fontSize: mobileW * 4 / 100
                                    }}>
                                        {savagelist.levelExerciseTypes[1].minExerciseCount + "-"
                                            + savagelist.levelExerciseTypes[1].maxExerciseCount + " reps/"
                                            + savagelist.levelExerciseTypes[1].exerciseDurations.name.toLowerCase() + " "
                                        }</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 1 / 100 }}>
                                    <Text style={{
                                        color: selectcard == 'savage' ? Colors.lightOrange : Colors.orangeColor,
                                        fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                    }}>
                                        {savagelist.levelExerciseTypes[0].exerciseTypes.name}</Text>
                                    <Text style={{
                                        color: Colors.lightAccent, fontFamily: Font.FontBold,
                                        fontSize: mobileW * 4 / 100,
                                    }}>
                                        {savagelist.levelExerciseTypes[0].minExerciseCount + "-"
                                            + savagelist.levelExerciseTypes[0].maxExerciseCount + " "
                                            // + savagelist.levelExerciseTypes[0].exerciseDurations.name + " "
                                            + savagelist.levelExerciseTypes[0].exerciseUnits.name + "  "}</Text>
                                </View>
                            </>)}
                    </TouchableOpacity>

                }
                
            </View>

            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} isAddIcon={"true"} ></BottomTab>

        </View>
    )
}

const styles = StyleSheet.create({
    cardView: {
        width: mobileW * 75 / 100,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.lightGreyColor,
        height: mobileW * 40 / 100,
        borderRadius: mobileW * 4 / 100,
        padding: mobileW * 3 / 100,
        marginTop: mobileW * 5 / 100
    },
    cardTitle: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        marginTop: mobileW * 4 / 100,
        textAlign: 'center',
        fontSize: mobileW * 8.1 / 100
    }
})
