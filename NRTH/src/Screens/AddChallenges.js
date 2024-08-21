import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileW, msgProvider } from '../Provider/utilslib/Utils'
import { Dropdown } from 'react-native-element-dropdown';
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useIsFocused, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { CheckUserStatus } from '../Components/ApiCallForLogot'
import BottomTab from '../Components/BottomTab'


export default function AddChallenges({ navigation }) {
    const route = useRoute()
    const isSelectLevel = route.params?.isSelectLevel
    const [tab, setTab] = useState(isSelectLevel != null ? isSelectLevel : "beginner")
    const [cardTab, setCardTab] = useState("strength")
    const [countPullups, setCountPullups] = useState(0);
    const [dayCount, setDayCount] = useState("0")
    const [cardioDayCount, setCardioDayCount] = useState("0")
    const [cardioExarciseCount, setCardioExarciseCount] = useState(0)
    const [value, setValue] = useState('Burpees');
    const [valueCardio, setValueCardio] = useState('Run');
    const [isFocus, setIsFocus] = useState(false);
    const [beginnerlist, setBeginners] = useState([])
    const [elitelist, setElite] = useState([])
    const [savagelist, setSavege] = useState([])
    const [challengeList, setChallengeList] = useState([])
    const [strengthList, setStrengthList] = useState([])
    const [cardioList, setCardioList] = useState([])
    const [unitList, setUnitList] = useState([])
    const [userName, setUserName] = useState("Ac")
    const [levelId, setLevelId] = useState("")
    const [userId, setUserId] = useState("")
    const [exerciseId, setExerciseId] = useState("")
    const [isLinked, setIsLinked] = useState(false)
    const [isLinkedCardio, setIsLinkedCardio] = useState(false)
    const isFocused = useIsFocused();


    useEffect(() => {
        getUserData()
        CheckUserStatus({ navigation })
    }, [isFocused])


    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setUserId(UserData._id)
    }

    useEffect(() => {
        _LevelApiCalling2()
    }, [tab])



    useEffect(() => {
        _LevelApiCalling()
    }, [isFocused])

   

    const _AddChallengeApiCalling = async () => {
        if (exerciseId.length <= 0 || exerciseId == '' || exerciseId == null) {
            msgProvider.toast(Lang_chg.chooseExcercise[config.language], 'bottom')
            return false
        }
        if (dayCount <= 0 && cardioDayCount <= 0) {
            msgProvider.toast(Lang_chg.greaterThenZeroDay[config.language], 'bottom')
            return false
        }
        if (countPullups <= 0 && cardioExarciseCount <= 0) {
            msgProvider.toast(Lang_chg.greaterThenZero[config.language], 'bottom')
            return false
        }

        global.props.showLoader();
        let apiUrl = appBaseUrl.AddExercisesUrl;

        var postData = JSON.stringify({
            customerId: userId,
            levelId: levelId,
            exerciseId: exerciseId,
            exerciseDurationId: appBaseUrl.dayExcerciseId , // client server 65b78ed401b49aa9207c0607 // company server 65546cc0ffd2467438396664
            exerciseUnitId: cardTab == "strength" ? null : unitList[unitIndex]._id,
            exerciseCount: cardTab == "strength" ? countPullups : cardioExarciseCount,
            dayCount: cardTab == "strength" ? dayCount : cardioDayCount
        });

    
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                console.log("AddExrciseResponse--->", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    navigation.navigate('DailyexerciseList')
                    clearData()
                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
            });

    }

    const clearData = () => {
        setCountPullups(0)
        setCardioExarciseCount(0)
        setDayCount(0)
        setCardioDayCount(0)
    }

    const _LevelApiCalling = async () => {
        // global.props.showLoader();
        let apiUrl = appBaseUrl.LevelListUrl;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.get(apiUrl, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("AddChallengeLevelResponse---222>", response.data.getAllActiveModellevels);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    setBeginners(response.data.getAllActiveModellevels[0])
                    setElite(response.data.getAllActiveModellevels[1])
                    setSavege(response.data.getAllActiveModellevels[2])


                    tab === 'savage' ? _ChallengeApiCalling(response.data.getAllActiveModellevels[2]._id)
                        : tab === 'elite' ? _ChallengeApiCalling(response.data.getAllActiveModellevels[1]._id)
                            : _ChallengeApiCalling(response.data.getAllActiveModellevels[0]._id)

                    tab === 'savage' ? setLevelId(response.data.getAllActiveModellevels[2]._id)
                        : tab === 'elite' ? setLevelId(response.data.getAllActiveModellevels[1]._id)
                            : setLevelId(response.data.getAllActiveModellevels[0]._id)




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

    const _LevelApiCalling2 = async () => {
       
        let apiUrl = appBaseUrl.LevelListUrl;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.get(apiUrl, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("AddChallengeLevelResponse---22233>", response.data.getAllActiveModellevels);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                            
                    tab === 'savage' ? setLevelId(response.data.getAllActiveModellevels[2]._id)
                        : tab === 'elite' ? setLevelId(response.data.getAllActiveModellevels[1]._id)
                            : setLevelId(response.data.getAllActiveModellevels[0]._id)

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

    const _ChallengeApiCalling = async (id) => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.ChallengeListUrl;

        var postData = JSON.stringify({
            levelId: id,
        });

        console.log("postDatapostData=>", postData)
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                // Handle the successful response
                console.log("ChallengeApi--->222", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    setChallengeList(response.data.getLevelExerciseTypesWithDetailByLevelId)
                    setStrengthList(response.data.getLevelExerciseTypesWithDetailByLevelId[0])
                    setCardioList(response.data.getLevelExerciseTypesWithDetailByLevelId[1])
                    setUnitList(response.data.unit)
                    
                    setCountPullups(response.data.getLevelExerciseTypesWithDetailByLevelId[0].minExerciseCount.toString())
                    setCardioExarciseCount(response.data.getLevelExerciseTypesWithDetailByLevelId[1].minExerciseCount.toString())

                    if (isLinked) {
                        setDayCount(response.data.getLevelExerciseTypesWithDetailByLevelId[0].minExerciseCount.toString())
                    }

                    if (isLinkedCardio) {
                        setCardioDayCount(response.data.getLevelExerciseTypesWithDetailByLevelId[1].minExerciseCount.toString())
                    }

                } else {
                    Alert.alert("Alert", response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('ChallengeApi---22', error);
                // Handle errors
            });

    }

    console.log('cardTab', cardTab);

    const units = ['Km', 'Mt', 'Miles'];
    const [unitIndex, setUnitIndex] = useState(0);

    const changeUnit = () => {
        setUnitIndex((prevIndex) => (prevIndex + 1) % unitList.length);

        return false
        console.log("changeUnitunit===>", unitList[unitIndex].name)

        if (unitList[unitIndex].name == 'km') {
            convertUnits(Number(cardioExarciseCount), 'km')
        }
        else if (unitList[unitIndex].name == 'miles') {
            convertUnits(Number(cardioExarciseCount), 'miles')
        }
    };

    const convertUnits = (value, unit) => {
        console.log("unit===>", unit)
        switch (unit) {
            case 'km':
                var finalVal = (parseFloat(value) * 1.60934).toFixed(0)
                setCardioExarciseCount(finalVal);
                break;
            case 'Meter':
                setCardioExarciseCount(cardioExarciseCount);
                break;
            case 'miles':
                var finalVal = (parseFloat(value) / 1.60934).toFixed(0)
                setCardioExarciseCount(finalVal);
                break;
            default:
                setCardioExarciseCount(1);
        }
    };

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const incrementCount = () => {
        var incremenToString = Number(countPullups) + 1
        setCountPullups(incremenToString.toString())
        console.log("pppp", typeof (countPullups));

        levelConfigure(incremenToString);

    };
    const decrementCount = () => {
        var decrementToString = countPullups == 0 ? 0 : Number(countPullups) - 1
        setCountPullups(decrementToString.toString())

        levelConfigure(decrementToString);
    };

    const levelConfigure = (txt) => {
        console.warn("txttxt==>", txt);
        Number(txt) <= 49
            ? setTab("beginner") :
            Number(txt) < 100 ? setTab("elite") :
                setTab("savage")

        if (isLinked) {
            setDayCount(txt + "")
        }
    };

    const levelConfigureCardio = (txt) => {
        console.warn("txttxt==>", txt);
        Number(txt) <= 5
            ? setTab("beginner") :
            Number(txt) <= 15 ? setTab("elite") :
                setTab("savage")

        if (isLinkedCardio) {
            setCardioDayCount(txt + "")
        }
    };

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const dayIncrement = () => {
        var dayIncrement = Number(dayCount) + 1
        setDayCount(dayIncrement.toString());
    };
    const dayDecrementCount = () => {
        var dayDecrement = Number(dayCount) == 0 ? 0 : Number(dayCount) - 1
        setDayCount(dayDecrement.toString());
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const cardioExarciseIncrement = () => {
        var incremenToString = Number(cardioExarciseCount) + 1
        setCardioExarciseCount(incremenToString.toString())
        console.log("pppp", typeof (cardioExarciseCount));
        levelConfigureCardio(incremenToString);
        // setCardioExarciseCount(cardioExarciseCount === cardioList.maxExerciseCount ? cardioList.maxExerciseCount : cardioExarciseCount + 1);
    };
    const cardioDecrementIncrement = () => {
        var decrementToString = cardioExarciseCount == 0 ? 0 : Number(cardioExarciseCount) - 1
        setCardioExarciseCount(decrementToString.toString())
        levelConfigureCardio(decrementToString);
        // setCardioExarciseCount(cardioExarciseCount === 0 ? 0 : cardioExarciseCount - 1);
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const CardioDayIncrement = () => {
        var dayIncrement = Number(cardioDayCount) + 1
        setCardioDayCount(dayIncrement.toString());
    };
    const CardioDayDecrementCount = () => {
        var dayDecrement = Number(cardioDayCount) == 0 ? 0 : Number(cardioDayCount) - 1
        setCardioDayCount(dayDecrement.toString());
    };

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const ToSetDataInKmMiles = (txt) => {
        console.log('--------->>>>', unitList[unitIndex].name);
        if (unitList[unitIndex].name == 'miles') {
            const milesValue = Number(txt) * 0.621371;
            setMiles(milesValue.toFixed(2)); // Round to 2 decimal places
        }
        // 'Meter' 
    }

    const dataLink = () => {
        setIsLinked(!isLinked)
        setDayCount(countPullups + "")
       
    }

    const dataCardioLink = () => {
        setIsLinkedCardio(!isLinkedCardio)
        setCardioDayCount(cardioExarciseCount + "")
        
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <Header navigation={navigation} title={Lang_chg.challengeConfigurator} firstImage={localimag.icon_back} secondImage={userName}></Header>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                    <View style={{ flex: 1, alignSelf: "center", justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: Colors.orangeColor, fontSize: mobileW * 4 / 100, fontFamily: Font.FontRegularFono }}>{Lang_chg.setyourfirstexercise}</Text>

                        <View
                            // style={{alignItems:"center",justifyContent:'center',alignSelf:'center',backgroundColor:'yellow'}}
                            style={styles.cardView}
                        >
                            <View
                            // style={styles.cardHeader}
                            >
                                {cardTab == 'strength' ?
                                    <ImageBackground
                                        resizeMode='contain'
                                        imageStyle={{
                                            width: mobileW * 85 / 100,
                                            height: mobileW * 74 / 100
                                        }}
                                        style={{
                                            width: mobileW * 85 / 100, marginLeft: mobileW * -0.2 / 100,
                                            height: mobileW * 74 / 100
                                        }}
                                        source={localimag.right_icon_image}>
                                        <TouchableOpacity
                                            onPress={() => setCardTab(cardTab == 'strength' ? 'cardio' : 'strength')} activeOpacity={0.8}
                                            style={{
                                                position: 'absolute', flexDirection: 'row',
                                                width: mobileW * 85 / 100, alignItems: 'center', justifyContent: 'space-around',
                                                height: mobileW * 10 / 100
                                            }}>
                                            {strengthList != '' &&
                                                <Text style={{
                                                    fontSize: mobileW * 3 / 100, fontFamily: Font.DrunkBold,
                                                    color: cardTab == 'strength' ? Colors.orangeColor : Colors.lightAccent
                                                }}>{strengthList.exerciseTypes.name}</Text>
                                            }
                                            {cardioList != '' &&
                                                <Text style={{
                                                    fontSize: mobileW * 3 / 100, fontFamily: Font.DrunkBold,
                                                    color: cardTab == 'cardio' ? Colors.orangeColor : Colors.lightAccent
                                                }}>{cardioList.exerciseTypes.name}</Text>
                                            }
                                        </TouchableOpacity>

                                        {/* ---------------------------------------------- */}
                                        <View style={{
                                            width: mobileW * 72 / 100, marginTop: mobileW * 12 / 100,
                                            marginBottom: mobileW * 5 / 100, alignSelf: 'center',
                                        }}>
                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                    <TouchableOpacity style={styles.touch} onPress={() => incrementCount()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_up}></Image>
                                                    </TouchableOpacity>
                                                    <View style={[styles.countPullupsView, { width: mobileW * 20 / 100 }]}>
                                                        
                                                        <TextInput
                                                            value={countPullups}
                                                            keyboardType="numeric"
                                                            maxLength={4}
                                                            // placeholderTextColor="black"
                                                            onChangeText={(txt) => {
                                                                setCountPullups(Number(txt)),
                                                                    levelConfigure(txt)
                                                            }}
                                                            style={{
                                                                // backgroundColor:"red",
                                                                width: mobileW * 16 / 100,
                                                                textAlign: "center",
                                                                color: Colors.lightAccent, fontSize: mobileW * 5 / 100,
                                                                fontFamily: Font.DrunkBold
                                                            }}></TextInput>


                                                    </View>
                                                    <TouchableOpacity style={styles.touch} onPress={() => decrementCount()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_down}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                                {strengthList != '' &&
                                                    <Dropdown
                                                        style={[styles.countPullupsView, { width: mobileW * 46 / 100, paddingLeft: mobileW * 3 / 100 }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        activeColor={Colors.blackColor}
                                                        containerStyle={styles.inputSearchStyle}
                                                        itemTextStyle={{ color: Colors.whiteColor, fontFamily: Font.DrunkBold }}
                                                        // backgroundColor={Colors.blackColor}
                                                        // inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={strengthList.exerciseTypes.exercises}
                                                        Mode={"outlined"}
                                                        maxHeight={300}
                                                        placeholder="Select"
                                                        labelField="name"
                                                        valueField="_id"
                                                        // placeholder={Lang_chg.Dance[config.language]}
                                                        // searchPlaceholder="Search..."
                                                        // value={value}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            setValue(item._id);
                                                            setExerciseId(item._id);
                                                            setIsFocus(false);
                                                        }}
                                                    />
                                                }
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <TouchableOpacity onPress={() => dataLink()}>
                                                    <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                        <Image resizeMode='contain' style={{ tintColor: isLinked ? Colors.orangeColor : Colors.lightAccent, width: mobileW * 6 / 100, height: mobileW * 6 / 100 }}
                                                            source={localimag.icon_link}></Image>
                                                    </View>
                                                </TouchableOpacity>


                                                <View style={styles.everdayforView}>
                                                    <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 4 / 100, fontFamily: Font.FontRegularFono }}>{Lang_chg.everydayFor}</Text>
                                                </View>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                    <TouchableOpacity style={styles.touch} onPress={() => !isLinked && dayIncrement()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_up}></Image>
                                                    </TouchableOpacity>
                                                    <View style={[styles.countPullupsView, { width: mobileW * 20 / 100, borderColor: Colors.lightGreyColor }]}>
                                                     
                                                        <TextInput
                                                            value={dayCount}
                                                            keyboardType="numeric"
                                                            editable={!isLinked}
                                                            maxLength={4}
                                                            // placeholderTextColor="black"
                                                            onChangeText={(txt) => {
                                                                setDayCount(Number(txt))
                                                            }}
                                                            style={{
                                                                // backgroundColor:"red",
                                                                width: mobileW * 20 / 100,
                                                                textAlign: "center",
                                                                color: Colors.lightAccent, fontSize: mobileW * 5 / 100,
                                                                fontFamily: Font.DrunkBold
                                                            }}></TextInput>
                                                    </View>
                                                    <TouchableOpacity style={styles.touch} onPress={() => !isLinked && dayDecrementCount()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_down}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ width: mobileW * 48 / 100, height: mobileW * 14 / 100, justifyContent: 'center', }}>

                                                    <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 4.5 / 100, fontFamily: Font.DrunkBold }}>{Lang_chg.days}</Text>

                                                </View>
                                            </View>
                                        </View>
                                        {/* ---------------------------------------------- */}

                                    </ImageBackground>
                                    :
                                    <ImageBackground
                                        resizeMode='contain'
                                        imageStyle={{
                                            width: mobileW * 85.3 / 100,
                                            height: mobileW * 74 / 100
                                        }}
                                        style={{
                                            width: mobileW * 85 / 100, marginLeft: mobileW * -0.2 / 100,
                                            height: mobileW * 74 / 100
                                        }}
                                        source={localimag.left_icon_image}>
                                        <TouchableOpacity
                                            onPress={() => setCardTab(cardTab == 'strength' ? 'cardio' : 'strength')} activeOpacity={0.8}
                                            style={{
                                                position: 'absolute', flexDirection: 'row',
                                                width: mobileW * 85 / 100, alignItems: 'center', justifyContent: 'space-around',
                                                height: mobileW * 10 / 100
                                            }}>
                                            {strengthList != '' &&
                                                <Text style={{
                                                    fontSize: mobileW * 3 / 100, fontFamily: Font.DrunkBold,
                                                    color: cardTab == 'strength' ? Colors.orangeColor : Colors.lightAccent
                                                }}>{strengthList.exerciseTypes.name}</Text>
                                            }
                                            {cardioList != '' &&
                                                <Text style={{
                                                    fontSize: mobileW * 3 / 100, fontFamily: Font.DrunkBold,
                                                    color: cardTab == 'cardio' ? Colors.orangeColor : Colors.lightAccent
                                                }}>{cardioList.exerciseTypes.name}</Text>
                                            }
                                        </TouchableOpacity>


                                        {/* --------------------------------------------------------- */}
                                        <View style={{ width: mobileW * 72 / 100, marginTop: mobileW * 12 / 100, marginBottom: mobileW * 5 / 100, alignSelf: 'center', }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                    <TouchableOpacity style={styles.touch} onPress={() => cardioExarciseIncrement()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_up}></Image>
                                                    </TouchableOpacity>
                                                    <View style={styles.countPullupsView}>
                                                        <TextInput
                                                            value={cardioExarciseCount}
                                                            keyboardType="numeric"

                                                            maxLength={4}
                                                            // placeholderTextColor="black"
                                                            onChangeText={(txt) => {
                                                                setCardioExarciseCount(Number(txt)), levelConfigureCardio(txt)
                                                            }}
                                                            style={{
                                                                width: mobileW * 16 / 100,
                                                                textAlign: "center",
                                                                color: Colors.lightAccent, fontSize: mobileW * 5 / 100,
                                                                fontFamily: Font.DrunkBold
                                                            }}></TextInput>

                                                        {/* <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 5 / 100, fontFamily: Font.DrunkBold }}>{cardioExarciseCount}</Text> */}

                                                    </View>
                                                    <TouchableOpacity style={styles.touch} onPress={() => cardioDecrementIncrement()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_down}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ marginLeft: mobileW * 1 / 100, width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                    <TouchableOpacity style={styles.touch} onPress={() => changeUnit('add')}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_up}></Image>
                                                    </TouchableOpacity>

                                                    {unitList != '' &&
                                                        <View style={styles.countPullupsView}>
                                                            <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 4 / 100, fontFamily: Font.DrunkBold }}>{unitList[unitIndex].name}</Text>
                                                        </View>}

                                                    <TouchableOpacity style={styles.touch} onPress={() => changeUnit('sub')}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_down}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                                {cardioList != '' &&
                                                    <Dropdown
                                                        style={[styles.countPullupsView, { width: mobileW * 33 / 100, paddingLeft: mobileW * 1 / 100 }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        activeColor={Colors.blackColor}

                                                        containerStyle={styles.inputSearchStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        itemTextStyle={{ color: Colors.whiteColor, fontFamily: Font.DrunkBold }}
                                                        // inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={cardioList.exerciseTypes.exercises}

                                                        Mode={"outlined"}
                                                        maxHeight={300}
                                                        labelField="name"
                                                        valueField="_id"
                                                        placeholder="Select"
                                                        // placeholder={!isFocus ?{Lang_chg.Dance[config.language]}: '...'}
                                                        // placeholder={Lang_chg.Dance[config.language]}
                                                        searchPlaceholder="Search..."
                                                        // value={valueCardio}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            setValueCardio(item._id);
                                                            setExerciseId(item._id);
                                                            setIsFocus(false);
                                                        }}
                                                    />
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <TouchableOpacity onPress={() => dataCardioLink()}>
                                                    <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                        <Image resizeMode='contain' style={{ tintColor: isLinkedCardio ? Colors.orangeColor : Colors.lightAccent, width: mobileW * 6 / 100, height: mobileW * 6 / 100 }}
                                                            source={localimag.icon_link}></Image>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={styles.everdayforView}>
                                                    <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 4 / 100, fontFamily: Font.FontRegularFono }}>{Lang_chg.everydayFor}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ width: mobileW * 16 / 100, alignItems: 'center', }}>
                                                    <TouchableOpacity style={styles.touch} onPress={() => !isLinkedCardio && CardioDayIncrement()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_up}></Image>
                                                    </TouchableOpacity>
                                                    <View style={[styles.countPullupsView, { borderColor: Colors.lightGreyColor }]}>
                                                        {/* <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 5 / 100, fontFamily: Font.DrunkBold }}>{cardioDayCount}</Text> */}

                                                        <TextInput
                                                            value={cardioDayCount}
                                                            keyboardType="numeric"
                                                            editable={!isLinkedCardio}
                                                            maxLength={4}
                                                            // placeholderTextColor="black"
                                                            onChangeText={(txt) => {
                                                                setCardioDayCount(Number(txt))
                                                            }}
                                                            style={{
                                                                width: mobileW * 16 / 100,
                                                                textAlign: "center",
                                                                color: Colors.lightAccent, fontSize: mobileW * 5 / 100,
                                                                fontFamily: Font.DrunkBold
                                                            }}></TextInput>
                                                    </View>
                                                    <TouchableOpacity style={styles.touch} onPress={() => !isLinkedCardio && CardioDayDecrementCount()}>
                                                        <Image resizeMode='contain' style={{ width: mobileW * 3 / 100, height: mobileW * 3 / 100 }}
                                                            source={localimag.icon_down}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ width: mobileW * 48 / 100, height: mobileW * 15 / 100, justifyContent: 'center', }}>

                                                    <Text style={{ color: Colors.whiteColor, fontSize: mobileW * 4.5 / 100, fontFamily: Font.DrunkBold }}>{Lang_chg.days}</Text>

                                                </View>
                                            </View>

                                        </View>
                                        {/* --------------------------------------------------------- */}

                                    </ImageBackground>
                                }

                            </View>

                        </View>


                        <View style={styles.bottomTab}>


                            {beginnerlist != '' &&
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { _ChallengeApiCalling(beginnerlist._id), setTab('beginner') }} style={[styles.begginerTab, { borderColor: tab == 'beginner' ? Colors.orangeColor : Colors.blackColor, backgroundColor: tab == 'beginner' ? Colors.greyThemeColor : Colors.blackColor }]}>
                                    <Text style={{ color: tab == 'beginner' ? Colors.whiteColor : Colors.lightAccent, fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100 }}>{beginnerlist.name.toUpperCase()}</Text>
                                </TouchableOpacity>
                            }

                            {elitelist != '' &&
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { _ChallengeApiCalling(elitelist._id), setTab('elite') }} style={[styles.begginerTab, { borderColor: tab == 'elite' ? Colors.orangeColor : Colors.blackColor, backgroundColor: tab == 'elite' ? Colors.greyThemeColor : Colors.blackColor }]}>
                                    <Text style={{ color: tab == 'elite' ? Colors.whiteColor : Colors.lightAccent, fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100 }}>{elitelist.name.toUpperCase()}</Text>
                                </TouchableOpacity>
                            }

                            {savagelist != '' && savagelist != null &&
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { _ChallengeApiCalling(savagelist._id), setTab('savage') }} style={[styles.begginerTab, { borderColor: tab == 'savage' ? Colors.orangeColor : Colors.blackColor, backgroundColor: tab == 'savage' ? Colors.greyThemeColor : Colors.blackColor }]}>
                                    <Text style={{ color: tab == 'savage' ? Colors.whiteColor : Colors.lightAccent, fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100 }}>{savagelist.name.toUpperCase()}</Text>
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: mobileW * 9 / 100, }}>
                            <Image style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                                source={localimag.icon_star} />
                            <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightAccent, marginLeft: mobileW * 2 / 100, fontFamily: Font.FontRegularFono }}>{Lang_chg.completingThisActivity}</Text>
                        </View>
                        <View style={{ marginTop: mobileW * 10 / 100 }}>
                            <CommonButton
                                onPressClick={() => {
                                    _AddChallengeApiCalling()

                                }}
                                navigation={navigation} ScreenName={'ExerciseList'} title={Lang_chg.addExercise} ></CommonButton>
                        </View>

                    </View>

                </View>
                {/* <SmallButton ></SmallButton>  */}
            </ScrollView>

            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>


        </View>
    )
}


const styles = StyleSheet.create({
    cardView: {
        width: mobileW * 85 / 100,
        borderWidth: mobileW * 0.2 / 100,
        borderRadius: mobileW * 3.5 / 100,
        borderColor: Colors.mediumDarkGrey,
        marginTop: mobileW * 8 / 100,
        backgroundColor: Colors.blackColor
    },
    cardHeader: {
        flexDirection: 'row',
        // borderBottomWidth: mobileW * 0.2 / 100,
        width: mobileW * 85 / 100,
        borderRadius: mobileW * 3 / 100,
        // height: mobileW * 10 / 100,
        // backgroundColor:'yellow'
    },
    cardTabe: {
        width: mobileW * 40 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: mobileW * -1.2 / 100,
        borderBottomWidth: mobileW * 0.2 / 100,

        // margin: mobileW * 1 / 100,
        // borderWidth: mobileW * 0.2 / 100,
        // borderRadius: mobileW * 4 / 100
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
    touch: {
        width: mobileW * 5 / 100, justifyContent: "center", alignItems: "center",
        paddingVertical: mobileW * 0.5 / 100
    },
    everdayforView: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: mobileW * 1.5 / 100,
        height: mobileW * 14 / 100,
        backgroundColor: Colors.blackColor,
    },
    bottomTab: {
        width: mobileW * 85 / 100,
        height: mobileW * 13.5 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: mobileW * 3 / 100,
        flexDirection: 'row',
        backgroundColor: Colors.blackColor,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.mediumDarkGrey,
        marginTop: mobileW * 5 / 100
    },
    dropdown: {
        height: mobileW * 14 / 100,
        width: mobileW * 85 / 100,
        alignSelf: 'center',
        borderWidth: mobileW * 0.3 / 100,
        borderColor: Colors.orangeColor,
        borderRadius: mobileW * 1 / 100,
        paddingHorizontal: mobileW * 3 / 100,
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
        // height: mobileW * 12 / 100,
        // fontSize: mobileW * 3.5 / 100,
        // fontFamily:Font.FontMedium,
        backgroundColor: Colors.blackColor,
        borderColor: Colors.orangeColor,
        borderWidth: mobileW * 0.2 / 100
    },
    dayWeetStyles: {
        width: mobileW * 30 / 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: mobileW * 3 / 100,
        borderRadius: mobileW * 1.5 / 100,
        height: mobileW * 14 / 100,
        backgroundColor: Colors.blackColor,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.orangeColor
    },
    begginerTab: {
        width: mobileW * 27.5 / 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: mobileW * 11 / 100,
        borderRadius: mobileW * 3 / 100,
        borderWidth: mobileW * 0.2 / 100,
    }

})
