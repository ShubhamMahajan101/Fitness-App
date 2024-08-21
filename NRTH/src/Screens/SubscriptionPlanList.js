import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, Image, FlatList } from 'react-native'
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


export default function SubscriptionPlanList({ navigation }) {
    const [selectcard, setSelectCard] = useState('')
    const [planlist, setPlanList] = useState([])
    const [userName, setUserName] = useState("Ac")
    const [userId, setUserId] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const isFocused = useIsFocused();


    useEffect(() => {
        _SubscriptionPlanListApiCalling()
        CheckUserStatus({navigation})
    }, [isFocused])


    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        setUserName(formattedName)
        setUserId(UserData._id)
        setUserEmail(UserData.email)

    }


    const _SubscriptionPlanListApiCalling = async () => {
        getUserData()
    
        global.props.showLoader();
        let apiUrl = appBaseUrl.SubscriptionPlanListUrl;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.get(apiUrl, { headers })
            .then(async (response) => {
            
                // Handle the successful response
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    setPlanList(response.data.getAllDisplayActiveModel)

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
        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
            <Header navigation={navigation} firstImage={localimag.icon_back}
              secondImage={userName}></Header>
            <Text style={{ alignSelf: "center", marginTop: mobileW * 5 / 100, marginBottom: mobileW * 2 / 100, color: Colors.orangeColor, fontFamily: Font.FontRegularFono, fontSize: mobileW * 4 / 100 }}>{Lang_chg.SelectSubscriptionPlan}</Text>
            <FlatList
            style={{marginBottom:mobileW *6/100}}
                data={planlist}
                renderItem={({ item, index }) =>
                    <View style={{ flex: 1, width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center',
                     alignItems: 'center', }}>
                        <View
                            style={[styles.cardView, { backgroundColor: Colors.blackColor }]}>

                            <Text style={[styles.cardTitle, { lineHeight: mobileW * 7 / 100 }]}>{item.name.toUpperCase()}</Text>
                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', marginTop: Platform.OS == "ios" ? mobileW * 10 / 100 : mobileW * 5 / 100 }}>


                                <Text style={{
                                    color: Colors.orangeColor,
                                    fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                }}>
                                    Price</Text>
                                <Text style={{
                                    color: Colors.lightAccent, fontFamily: Font.FontBold,
                                    fontSize: mobileW * 4 / 100
                                }}>
                                    € {item.price}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', marginTop: mobileW * 1 / 100 }}>
                                <Text style={{
                                    color:  Colors.orangeColor,
                                    fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                                }}>
                                    Frequency</Text>
                                <Text style={{
                                    color: Colors.lightAccent, fontFamily: Font.FontBold,
                                    fontSize: mobileW * 4 / 100,
                                }}>{item.frequency}</Text>
                            </View>

                            <Text style={{
                                marginTop: mobileW * 1 / 100,
                                lineHeight: mobileW * 4 / 100,
                                color: Colors.orangeColor,
                                fontFamily: Font.DrunkBold, fontSize: mobileW * 3 / 100
                            }}>
                                Description : {item.description}</Text>
                           
                            <View style={{marginTop:mobileW*5/100}}>
                                <CommonButton
                                    onPressClick={() => {
                                        navigation.replace("WebViewScreen", 
                                        { titles: "PurchasePlan",PlanUrl:item.stripPaymentLink +"?prefilled_email="+userEmail })
                                    }}
                                    ScreenName={'Home'}
                                    title={Lang_chg.Subscribe[config.language]}>

                                </CommonButton>
                            </View>
                        </View>
                    </View>
                }
            />
            <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>
        </View>
    )
}

const styles = StyleSheet.create({
    cardView: {
        width: mobileW * 85 / 100,
        borderWidth: mobileW * 0.2 / 100,
        borderColor: Colors.lightGreyColor,
        // height: mobileW * 40 / 100,
        borderRadius: mobileW * 4 / 100,
        padding: mobileW * 4 / 100,
        marginTop: mobileW * 5 / 100
    },
    cardTitle: {
        color: Colors.whiteColor,
        fontFamily: Font.DrunkBold,
        marginTop: mobileW * 4 / 100,
        textAlign: 'center',
        fontSize: mobileW * 6 / 100
    }
})
