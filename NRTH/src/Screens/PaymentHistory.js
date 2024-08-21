import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import BottomTab from '../Components/BottomTab'
import moment from 'moment'
import { CheckUserStatus } from '../Components/ApiCallForLogot'


export default function PaymentHistoryList({ navigation }) {
    const [selectcard, setSelectCard] = useState('')
    const [planlist, setPlanList] = useState([])
    const [userName, setUserName] = useState("Ac")
    const [userId, setUserId] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const isFocused = useIsFocused();


    useEffect(() => {
        _PaymentHistoryListApiCalling()
        CheckUserStatus({navigation})
    }, [isFocused])


    const getUserData = async () => {
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        console.log("UserDataName==>", formattedName)
        setUserName(formattedName)
        setUserId(UserData._id)
        setUserEmail(UserData.email)

    }


    const _PaymentHistoryListApiCalling = async () => {

        
        let UserData = await localStorage.getItemObject("UserData")
        const formattedName = config.getFormateName(UserData.name);
        
        setUserName(formattedName)
    
        getUserData()
       
        let apiUrl = appBaseUrl.PaymentHistoryListUrl;

        var postData = JSON.stringify({
            customerId: UserData._id,
            skip: 1,
            limit: 50,

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
                    setPlanList(response.data.getAssignPackageByCustomerId.assignPackages)
                } else {
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

            <Text style={{ alignSelf: "center", marginTop: mobileW * 5 / 100, marginBottom: mobileW * 2 / 100, color: Colors.orangeColor, fontFamily: Font.FontRegularFono, fontSize: mobileW * 4 / 100 }}>{Lang_chg.PaymentHistory}</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={planlist}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (

                    <View style={{ flexDirection: "column" }}>

                        <View style={styles.mainView}>
                            <View style={{
                                backgroundColor: Colors.blackColor, width: mobileW * 95 / 100, height: mobileW * 9 / 100,
                                borderTopRightRadius: mobileW * 3 / 100,
                                borderTopLeftRadius: mobileW * 3 / 100,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    marginLeft: mobileW * 4 / 100, color: Colors.lightAccent, fontFamily: Font.DrunkBold,
                                    fontSize: mobileW * 5 / 100
                                }}>{item.packageId.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', width: mobileW * 95 / 100, borderBottomRightRadius: mobileW * 3 / 100, borderBottomLeftRadius: mobileW * 3 / 100, padding: mobileW * 2 / 100, }}>
                                <View style={{ width: mobileW * 46 / 100 }}>
                                    <View style={styles.DemoText}>
                                        <Text style={styles.packageText}>{'Package Type'} : </Text>
                                        <Text style={styles.packageTextTitle}>{item.packageId.frequency}</Text>
                                    </View>
                                    <View style={styles.DemoText}>
                                        <Text style={styles.packageText}>{'Valid Till'} : </Text>


                                        <Text style={styles.packageTextTitle}>{moment(item.next_billing_time).format("DD-MM-YYYY")}</Text>
                                    </View>
                                    <View style={styles.DemoText}>
                                        <Text style={styles.packageText}>{'Date Of Purchase'} : </Text>
                                        <Text style={styles.packageTextTitle}>{moment(item.packageId.createdAt).format("DD-MM-YYYY")}</Text>
                                    </View>

                                </View>

                                <View style={{ width: mobileW * 54 / 100 }}>
                                    <View style={styles.DemoText}>
                                        <Text style={styles.packageText}>{'Paid Amount'} : </Text>
                                        <Text style={styles.packageTextTitle}>€ {item.packageId.price}</Text>
                                    </View>
                                    <View style={styles.DemoText}>
                                        <Text style={styles.packageText}>{'Subscribe Type'} : </Text>
                                        <Text style={styles.packageTextTitle}>{item.packageId.isFree ? "Free" : item.renewPackage == 0 ? 'Subscribed' : 'Renewed'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )} />

        
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
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    mainView: {
        width: mobileW * 95 / 100,
        backgroundColor: Colors.blackColor,
        alignSelf: "center",
        // height:hp('20%'),
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        borderRadius: mobileW * 3 / 100
    },
    packageText:
    {
        color: Colors.orangeColor,
        fontFamily: Font.DrunkBold,
        fontSize: mobileW * 2.5 / 100
    },

    packageTextTitle:
    {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        fontSize: mobileW * 2.5 / 100
    },

    DemoText: { alignItems: "center", marginLeft: mobileW * 2 / 100, flexDirection: 'row', padding: mobileW * 0.8 / 100 },
    DataView: { padding: mobileW * 1 / 100, flexDirection: 'row' }

})