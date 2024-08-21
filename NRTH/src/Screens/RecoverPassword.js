import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { config, Font, Colors, apifuntion, localStorage, Lang_chg, msgProvider, validationprovider, notification, mobileH, mobileW } from '../Provider/utilslib/Utils';
import { ScrollView } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'

export default function RecoverPassword({ navigation }) {
    const [email, setemail] = useState('');
    const route = useRoute()
    const isRecoverPassword = route.params?.isRecoverPassword

    const _ApiCalling = async () => {
        global.props.showLoader();
        let apiUrl
        { isRecoverPassword ? apiUrl = appBaseUrl.ForgotPsswordUrl : apiUrl = appBaseUrl.SendMagicLinkUrl }


        var postData = JSON.stringify({
            email: email,

        });
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                console.log("ApiResponse--->", response.data);
                var ErrorMessage = response.data.ErrorMessage
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    clearData()
                    navigation.navigate('Login')
                    {
                        isRecoverPassword ?
                            // Alert.alert(Lang_chg.Recoverpassword[config.language], response.data.ErrorMessage)

                            Alert.alert("Alert", response.data.ErrorMessage)
                            :
                            // Alert.alert(Lang_chg.Sendmagiclink[config.language], response.data.ErrorMessage);

                            Alert.alert("Alert", response.data.ErrorMessage);
                    }
                } else {
                    {
                        isRecoverPassword ?
                            Alert.alert("Alert", response.data.ErrorMessage)
                            :
                            Alert.alert("Alert", response.data.ErrorMessage);
                    }
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('Loginerror---', error);
            });
    }

    const _userInfo = async () => {

        //email============================
        if (email.length <= 0) {
            msgProvider.toast(Lang_chg.emptyEmail[config.language], 'bottom')
            return false
        }

        if (email.length > 50) {
            msgProvider.toast(Lang_chg.emailMaxLength[config.language], 'bottom')
            return false
        }

        var reg = config.emailvalidation;
        if (reg.test(email) !== true) {
            msgProvider.toast(Lang_chg.validEmail[config.language], 'bottom')
            return false
        }

        _ApiCalling()


    }

    const clearData = () => {
        setemail("")
    }
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1 }}
                imageStyle={{ flex: 1 }}
                source={localimag.backgroud_gradient}>

                <View style={{ alignItems: 'center' }}>
                    <Image
                        resizeMode='contain'
                        source={localimag.logo_white}
                        style={styles.LogoImage}></Image>
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: mobileH * 30 / 100 }}>
                        <View
                            style={{ alignItems: 'center', width: mobileW }}>
                            {/* <Text
                                style={styles.signTextColor}>{Lang_chg.RecoverPasswordHere[config.language]}</Text> */}

                            {/*  --- Email Input --- */}
                            <View
                                style={[styles.BaseView]}>
                                <Text
                                    style={styles.EmailAddtxt}
                                >{Lang_chg.eMailAddress[config.language]}</Text>
                                <View
                                    style={styles.InputView}>
                                    <TextInput
                                        value={email}
                                        maxLength={30}
                                        placeholderTextColor="black"
                                        onChangeText={(txt) => { setemail(txt) }}
                                        style={styles.TextInputs}></TextInput>
                                    <TouchableOpacity
                                        onPress={() => setemail('')}
                                        activeOpacity={0.8}>
                                        <Image
                                            resizeMode='contain'
                                            source={localimag.icon_close}
                                            style={styles.ImageStyle}></Image></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{ marginTop: mobileH * 5 / 100 }}>
                            <CommonButton
                                onPressClick={() => {
                                    _userInfo()
                                }}
                                apiData={(test) => console.log('Please check here -----', test)}
                                ScreenName={'Home'}
                                title={Lang_chg.Submit[config.language]
                                }></CommonButton>
                        </View>

                        {/* --- LogIn txt --- */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { clearData(), navigation.navigate('Login') }}>
                            <Text style={[styles.LogInTxtOrange]
                            }>{Lang_chg.LogIn[config.language]}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

            </ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
    },
    signTextColor: {
        fontSize: mobileW * 4.5 / 100,
        color: Colors.orangeColor,
        fontFamily: Font.FontRegular,
        alignSelf: 'center'
    },
    LogoImage: {
        height: mobileW * 45 / 100,
        width: mobileW * 74 / 100,
        marginTop: mobileH * 3 / 100
    },
    TextInputStyle: {
        backgroundColor: '#00000000',
        width: mobileW * 75 / 100,
        fontSize: mobileW * 4 / 100,
        marginTop: mobileH * 1 / 100
    },
    BaseView: {
        width: mobileW * 74 / 100,
        marginTop: mobileH * 5 / 100
    },
    InputView: {
        width: mobileW * 74 / 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: Colors.whiteColor,
        borderBottomWidth: mobileH * 0.12 / 100,
        justifyContent: 'space-between'
    },
    EmailAddtxt: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono
    },
    TextInputs: {
        height: mobileW * 10 / 100,
        marginTop: mobileW * 1 / 100,
        width: mobileW * 67 / 100,
        fontFamily: Font.FontBold,
        color: Colors.whiteColor,
        fontSize: mobileW * 4 / 100,
    },
    ImageStyle: {
        height: mobileW * 3 / 100,
        width: mobileW * 3 / 100,
        right: mobileW * 2 / 100
    },
    eyeImageStyle: {
        height: mobileW * 4 / 100,
        width: mobileW * 4 / 100,
        right: mobileW * 2 / 100
    },
    bySignIn: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        marginTop: mobileH * 0.5 / 100,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100
    },
    termsPrivacyOrange: {
        marginTop: mobileH * 0.2 / 100,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100,
        textDecorationLine: 'underline',
        color: Colors.orangeColor
    },
    recoverPass: {
        marginTop: mobileH * 0.5 / 100,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100,
        color: Colors.orangeColor
    },
    LogInTxtOrange: {
        marginTop: mobileH * 6 / 100,
        textAlign: 'center',
        fontSize: mobileW * 5.2 / 100,
        textDecorationLine: 'underline',
        color: Colors.orangeColor,
        paddingBottom: mobileH * 6 / 100,
        fontFamily: Font.FontFonoMedium,
    }

})

