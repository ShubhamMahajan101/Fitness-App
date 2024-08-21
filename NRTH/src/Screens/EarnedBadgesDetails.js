

import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ImageBackground, FlatList, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg, config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { Colors, Font } from '../Provider/utilslib/Utils'
import LinearGradient from 'react-native-linear-gradient'
import { platform } from 'cordova'
import { useRoute } from '@react-navigation/native'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import moment from 'moment'
import { CheckUserStatus } from '../Components/ApiCallForLogot'

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
const EarnedBadgesDetails = ({ navigation }) => {

    const [userName, setUserName] = useState("Ac")

    const route = useRoute()
    const recordData = route.params?.recordData
    
    useEffect(() => {
        CheckUserStatus({navigation})
    }, [])

    global.props.hideLoader();

    const _SaveClaimApiCalling = async () => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.SaveBadgeChallengeUrl;

        var postData = JSON.stringify({
            userBadgeId: responseData.CreateuserBadges._id,
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
                    navigation.navigate('UserProfile')

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

                <ScrollView
                    contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingBottom: mobileH * 15 / 100 }}
                >

                    <Text style={styles.pullText}>YOU HAVE {'\n'} EARNED YOUR {'\n'} NEW BADGE!</Text>

                
                    {recordData.levels.name.toLowerCase() == "beginner" &&
                        <ImageBackground resizeMode='contain' imageStyle={{
                            width: mobileW * 80 / 100,
                            height: mobileW * 40 / 100, borderRadius: mobileW * 5 / 100,
                        }}
                            style={{
                                marginTop: mobileH * 15 / 100, width: mobileW * 80 / 100,
                                height: mobileW * 50 / 100, borderRadius: mobileW * 5 / 100,
                            }}
                            source={localimag.Icon_beginner_badge}>
                            <View >
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                    marginTop: Platform.OS == "ios" ? mobileW * 4 / 100 : mobileW * 2 / 100
                                }}>
                                    <Text style={{
                                        fontSize: mobileW * 5 / 100,
                                        fontFamily: Font.DrunkBold, color: Colors.lightAccent,
                                        marginLeft: mobileW * 8 / 100
                                    }}>{recordData.levels.name.toUpperCase()}</Text>
                                    <View style={{ flexDirection: 'row', marginRight: mobileW * 6 / 100 }}>
                                        
                                        <Text style={{
                                            fontSize: mobileW * 3 / 100, fontFamily: Font.FontRegularFono,
                                            color: Colors.lightAccent, marginHorizontal: mobileW * 2 / 100
                                        }}>{recordData.userbadges.createdAt != null && moment(recordData.userbadges.createdAt).format("DD-MM-YYYY")}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: mobileW * 1 / 100 }}>
                                    <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 4 / 100 : 0, width: mobileW * 39 / 100, height: mobileW * 15 / 100, }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, fontFamily: Font.DrunkBold,
                                            textAlign: 'center', marginTop: mobileW * -1 / 100, color: Colors.backgroundcolor
                                        }}>{recordData.exerciseCount}</Text>
                                        <View style={{
                                            width: mobileW * 25 / 100, height: mobileW * 7 / 100,
                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100, justifyContent: 'center', alignItems: 'center',
                                            borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100,
                                            backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                        }}>
                                            <Text style={{
                                                fontSize: mobileW * 2 / 100,
                                                color: Colors.lightAccent, marginTop: mobileW * -1 / 100,
                                                fontFamily: Font.DrunkBold
                                            }}> {recordData.exercises.name.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 3.5 / 100 : mobileW * 0 / 100, width: mobileW * 39 / 100, height: mobileW * 15 / 100, }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, textAlign: 'center',
                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                        }}>{recordData.dayCount}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100, }}>
                                            <View style={{
                                                width: mobileW * 16 / 100, marginLeft: mobileW * 1 / 100,
                                                height: mobileW * 7 / 100, justifyContent: 'center', alignItems: 'center',
                                                borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100,
                                                backgroundColor: Colors.backgroundcolor,
                                            }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.lightAccent,
                                                    marginTop: mobileW * -1 / 100, fontFamily: Font.FontRegularFono
                                                }}>{"Every" + recordData.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                            </View>
                                            <View style={{
                                                width: mobileW * 11 / 100,
                                                height: mobileW * 7 / 100, marginLeft: mobileW * 5.5 / 100,
                                                justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 2 / 100,
                                                borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.backgroundcolor,
                                                alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                            }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.lightAccent,
                                                    marginTop: mobileW * -1 / 100, fontFamily: Font.DrunkBold
                                                }}>{recordData.exerciseDurations.name.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ fontSize: mobileW * 5 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? 0 : mobileW * 1 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                                <Text style={{ fontSize: mobileW * 2.5 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? 0 : mobileW * -1 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>C O M P L E T E D</Text>

                            </View>
                        </ImageBackground>
                    }

                    {recordData.levels.name.toLowerCase() == "elite" &&
                        <ImageBackground resizeMode='contain' imageStyle={{
                            width: mobileW * 80 / 100, height: mobileW * 80 / 100,
                            borderRadius: mobileW * 5 / 100,
                        }} style={{

                            width: mobileW * 80 / 100, height: mobileW * 80 / 100,
                            borderRadius: mobileW * 5 / 100,
                            marginTop: mobileH * 5 / 100,
                        }}
                            source={localimag.icon_elite_badge}>
                            <View>
                                <Text style={{
                                    fontSize: mobileW * 5 / 100, textAlign: "center", marginTop: mobileW * 18 / 100,
                                    fontFamily: Font.DrunkBold, color: Colors.lightAccent,
                                }}>{recordData.levels.name.toUpperCase()}</Text>
                                <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 6 / 100 : 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{
                                        width: mobileW * 39.5 / 100, height: mobileW * 15.5 / 100,
                                        marginTop: mobileW * 0.5 / 100
                                    }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, textAlign: 'right',
                                            marginRight: mobileW * 1 / 100, fontFamily: Font.DrunkBold,
                                            color: Colors.backgroundcolor
                                        }}>{recordData.exerciseCount}</Text>
                                        <View style={{
                                            width: mobileW * 25 / 100, height: mobileW * 8 / 100,
                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100, justifyContent: 'center', alignItems: 'center',
                                            borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                        }}>
                                            <Text style={{
                                                fontSize: mobileW * 2 / 100, color: Colors.lightAccent,
                                                marginTop: mobileW * -2 / 100, fontFamily: Font.DrunkBold
                                            }}>
                                                {recordData.exercises.name.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: mobileW * 39 / 100, height: mobileW * 15.5 / 100, marginTop: mobileW * 0.5 / 100 }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, textAlign: 'left', marginLeft: mobileW * 1 / 100,
                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                        }}>{recordData.dayCount}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100, }}>
                                            <View style={{ marginLeft: mobileW * 1 / 100, justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.backgroundcolor,
                                                    marginTop: mobileW * -2 / 100, fontFamily: Font.FontRegularFono
                                                }}>
                                                    {"Every" + recordData.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                            </View>
                                            <View style={{
                                                width: mobileW * 11 / 100, height: mobileW * 8 / 100, marginLeft: mobileW * 2 / 100,
                                                justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 2 / 100,
                                                borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                            }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.lightAccent, marginTop: mobileW * -2 / 100,
                                                    fontFamily: Font.DrunkBold
                                                }}>{recordData.exerciseDurations.name.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ fontSize: mobileW * 5 / 100, textAlign: "center", marginTop: mobileW * 2 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                            </View>
                        </ImageBackground>
                    }

                    {recordData.levels.name.toLowerCase() == "savage" &&
                        <ImageBackground resizeMode='contain' imageStyle={{ width: mobileW * 80 / 100, height: mobileW * 80 / 100, borderRadius: mobileW * 5 / 100, }} style={{
                            marginTop: mobileH * 5 / 100,
                            width: mobileW * 80 / 100, height: mobileW * 80 / 100, borderRadius: mobileW * 5 / 100,
                        }}
                            source={localimag.icon_savage_badge}>
                            <View>
                               
                                <Text style={{
                                    fontSize: mobileW * 8 / 100, textAlign: "center", fontFamily: Font.DrunkBold,
                                    marginTop:mobileW*14/100,
                                    color: Colors.lightAccent,
                                }}>{recordData.levels.name.toUpperCase()}</Text>

                                <View style={{ marginTop: Platform.OS == "ios" ? mobileW * 7 / 100 : 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: mobileW * 39.5 / 100, height: mobileW * 15.5 / 100, marginTop: mobileW * 0.5 / 100 }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, textAlign: 'right', marginRight: mobileW * 1 / 100,
                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                        }}>{recordData.exerciseCount}</Text>
                                        <View style={{
                                            marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100,
                                            width: mobileW * 25 / 100, height: mobileW * 8 / 100,
                                            justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 2 / 100,
                                            borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.backgroundcolor,
                                            alignSelf: 'flex-end', marginRight: mobileW * 1 / 100
                                        }}>
                                            <Text style={{
                                                fontSize: mobileW * 2 / 100, color: Colors.lightAccent,
                                                marginTop: mobileW * -2 / 100, fontFamily: Font.DrunkBold
                                            }}>{recordData.exercises.name.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: mobileW * 39 / 100, height: mobileW * 15.5 / 100, marginTop: mobileW * 0.5 / 100 }}>
                                        <Text style={{
                                            fontSize: mobileW * 8 / 100, textAlign: 'left', marginLeft: mobileW * 1 / 100,
                                            fontFamily: Font.DrunkBold, color: Colors.backgroundcolor
                                        }}>{recordData.dayCount}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 0 : mobileW * -2 / 100, }}>
                                            <View style={{ marginLeft: mobileW * 1 / 100, justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.backgroundcolor,
                                                    marginTop: mobileW * -2 / 100, fontFamily: Font.FontRegularFono
                                                }}>{"Every" + recordData.exerciseDurations.name.toLowerCase() + " for"}</Text>
                                            </View>
                                            <View style={{ width: mobileW * 10 / 100, height: mobileW * 8 / 100, marginLeft: mobileW * 1.2 / 100, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.backgroundcolor, alignSelf: 'flex-end', marginRight: mobileW * 1 / 100 }}>
                                                <Text style={{
                                                    fontSize: mobileW * 2 / 100, color: Colors.lightAccent,
                                                    marginTop: mobileW * -2 / 100, fontFamily: Font.DrunkBold
                                                }}>{recordData.exerciseDurations.name.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ fontSize: mobileW * 5 / 100, textAlign: "center", marginTop: mobileW * 4 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>CHALLENGE</Text>
                                <Text style={{ fontSize: mobileW * 2.5 / 100, textAlign: "center", marginTop: Platform.OS == "ios" ? mobileW * 1 / 100 : mobileW * -1 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent, }}>C O M P L E T E D</Text>
                                <Text style={{ fontSize: mobileW * 3 / 100, textAlign: "center", marginTop: mobileW * 5 / 100, fontFamily: Font.FontRegularFono, color: Colors.lightAccent, }}>{recordData.userbadges.createdAt != null && moment(recordData.userbadges.createdAt).format("DD-MM-YYYY")}</Text>
                            </View>
                        </ImageBackground>
                    }
                </ScrollView>

                <View style={styles.completeButton}>
                    <SmallButton
                        onPressClick={() => {
                            navigation.navigate('UserProfile')
                        }}
                        navigation={navigation} screenName={'DailyworkoutCompleted'} title={"GO TO PROFILE"}></SmallButton>
                </View>
            </View>
        </View>
    )
}
export default EarnedBadgesDetails;

const styles = StyleSheet.create({

    pullText: {
        color: Colors.lightAccent,
        fontFamily: Font.DrunkBold,
        textAlign: 'center',
        fontSize: mobileW * 5 / 100,
        marginTop: mobileH * 10 / 100,
        lineHeight: mobileW * 7 / 100
    },
    watchIcon: {
        width: mobileW * 68 / 100,
        height: mobileW * 68 / 100,
        alignSelf: 'center',
        marginTop: mobileH * 8 / 100,
        elevation: 0.5,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
    },
    completeButton: {
        position: "absolute",
        bottom: mobileH * 10 / 100,
        alignSelf: "center"
    },

})