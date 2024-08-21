import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { ScrollView } from 'react-native-gesture-handler'
import { config, Font, Colors, apifuntion, localStorage, Lang_chg, msgProvider, validationprovider, notification, mobileH, mobileW } from '../Provider/utilslib/Utils';
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useRoute } from '@react-navigation/native'


export default function ResetPassword({ navigation }) {
    const route = useRoute()
    const token = route.params.token

    const [secureText, setSecureText] = useState(true);
    const [secureTextRepeat, setSecureTextRepeat] = useState(true);
    const [cpassword, setcpassword] = useState('');
    const [password, setpassword] = useState('');

    const _userSignUp = () => {


        //password===================
        if (password.length <= 0) {
            msgProvider.toast(Lang_chg.emptyPassword[config.language], 'bottom')
            return false
        }
        if (password.length < 8) {
            msgProvider.toast(Lang_chg.passwordMinLength[config.language], 'bottom')
            return false
        }
        // var pattern = config.passwordvalidation;
        // if (pattern.test(password) !== true) {
        //     msgProvider.toast(Lang_chg.passFormate[config.language], 'bottom')
        //     return false
        // }


        var numberValidation = config.numberValidation;
        var spacailValidation = config.spacailValidation;
        var upperCaseValidation = config.upperCaseValidation;

        if (password == '' || password.length < 8 || numberValidation.test(password) !== true
            || spacailValidation.test(password) !== true || upperCaseValidation.test(password) !== true) {
            msgProvider.toast(Lang_chg.passFormate[config.language], 'bottom')
            return false
        }

        var pattern = config.spaceValidation;
        if (pattern.test(password) !== true) {
            msgProvider.toast(Lang_chg.validPassword[config.language], 'bottom')
            return false
        }
        if (password.length > 16) {
            msgProvider.toast(Lang_chg.passwordMaxLength[config.language], 'bottom')
            return false
        }
        //==================================confirmpassword===================
        if (cpassword.length <= 0) {
            msgProvider.toast(Lang_chg.cPassBlank[config.language], 'bottom')
            return false
        }
        if (cpassword.length < 8) {
            msgProvider.toast(Lang_chg.cPassCharLess[config.language], 'bottom')
            return false
        }
        // var pattern = config.passwordvalidation;
        // if (pattern.test(password) !== true) {
        //     msgProvider.toast(Lang_chg.passFormate[config.language], 'bottom')
        //     return false
        // }
        var numberValidation = config.numberValidation;
        var spacailValidation = config.spacailValidation;
        var upperCaseValidation = config.upperCaseValidation;

        if (cpassword == '' || cpassword.length < 8 || numberValidation.test(cpassword) !== true
            || spacailValidation.test(cpassword) !== true || upperCaseValidation.test(cpassword) !== true ) {
            msgProvider.toast(Lang_chg.passFormate[config.language], 'bottom')
            return false
        }
       

        var pattern = config.spaceValidation;
        if (pattern.test(password) !== true) {
            msgProvider.toast(Lang_chg.validPassword[config.language], 'bottom')
            return false
        }
        if (password.length > 16) {
            msgProvider.toast(Lang_chg.passwordMaxLength[config.language], 'bottom')
            return false
        }
        if (cpassword !== password) {
            msgProvider.toast(Lang_chg.cPassNotMatch[config.language], 'bottom')
            return false
        }

        // _VerifyApiCalling()
        if (token != null) {
            _ResetApiCalling(token)
        }
    }
    const clearData = () => {
        setpassword("")
        setcpassword("")
    }
    const _VerifyApiCalling = async () => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.VerifytokenUrl + "?token=" + token;

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

                    _ResetApiCalling(response.data.verifyMagicLink.magicToken)
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


    const _ResetApiCalling = async (magicToken) => {

        global.props.showLoader();
        let apiUrl = appBaseUrl.UpdatePasswordUrl;

        var postData = JSON.stringify({
            token: magicToken,
            password: password,
            confirmPassword: cpassword,

        });


      
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
               
                if (response.data.ErrorCode == "200") {
                    clearData()
                    global.props.hideLoader();
                    navigation.navigate('Login')
                    msgProvider.toast("Password recovered successfully", 'long')
                    // navigation.goBack()
                    // Alert.alert(Lang_chg.Recoverpassword[config.language], response.data.ErrorMessage);
                } else {
                    Alert.alert(Lang_chg.Recoverpassword[config.language], response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                
            });

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
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: mobileH * 30 / 100 }}>
                        <View style={{ alignItems: 'center', width: mobileW }}>
                            <Text style={styles.signTextColor}
                            >{Lang_chg.Recoverpassword[config.language]}</Text>

                            {/*  --- Password Input --- */}
                            <View style={[styles.BaseView, { marginTop: mobileH * 5 / 100 }]}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.NewPassword[config.language]}</Text>
                                <View style={styles.InputView}>
                                    <TextInput
                                        value={password}
                                        maxLength={16}
                                        autoCapitalize='none'
                                        placeholderTextColor="black"
                                        secureTextEntry={secureText}
                                        onChangeText={(txt) => { setpassword(txt) }}
                                        style={styles.TextInputs}></TextInput>
                                    <TouchableOpacity
                                        onPress={() => setSecureText(!secureText)}
                                        activeOpacity={0.8}>
                                        {secureText ? <Image resizeMode='contain' source={localimag.icon_eye_hide}
                                            style={styles.eyeImageStyle1}></Image> :
                                            <Image resizeMode='contain' source={localimag.icon_eye}
                                                style={styles.eyeImageStyle}></Image>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*  --- Repeat Password Input --- */}
                            <View style={[styles.BaseView]}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.ConfirmPassword[config.language]}</Text>
                                <View style={styles.InputView}>
                                    <TextInput
                                        value={cpassword}
                                        maxLength={16}
                                        autoCapitalize='none'
                                        placeholderTextColor="black"
                                        secureTextEntry={secureTextRepeat}
                                        onChangeText={(txt) => { setcpassword(txt) }}
                                        style={styles.TextInputs}></TextInput>
                                    <TouchableOpacity
                                        onPress={() => setSecureTextRepeat(!secureTextRepeat)}
                                        activeOpacity={0.8}>
                                        {secureTextRepeat ? <Image resizeMode='contain'
                                            source={localimag.icon_eye_hide}
                                            style={styles.eyeImageStyle1}></Image> :
                                            <Image resizeMode='contain'
                                                source={localimag.icon_eye}
                                                style={styles.eyeImageStyle}></Image>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        <View style={{ marginTop: mobileH * 5 / 100 }}>
                            <CommonButton
                                onPressClick={() => {
                                    _userSignUp()
                                }}
                                ScreenName={'Home'}
                                title={Lang_chg.Submit[config.language]}>

                            </CommonButton>
                        </View>


                        {/* --- LogIn txt --- */}

                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.LogInTxtOrange]
                                }>{Lang_chg.LogIn[config.language]}</Text>
                            </TouchableOpacity>
                            <View style={{ width: mobileW * 18 / 100, height: 1, backgroundColor: Colors.orangeColor }}></View>

                        </View>
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
        alignSelf: 'center',
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
        marginTop: mobileH * 2 / 100
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
        height: mobileW * 4.3 / 100,
        width: mobileW * 4.3 / 100,
        right: mobileW * 2 / 100
    },
    eyeImageStyle1: {
        height: mobileW * 4 / 100,
        width: mobileW * 4 / 100,
        right: mobileW * 2 / 100
      },
    bySignIn: {
        color: Colors.lightAccent,
        fontFamily: Font.FontRegularFono,
        marginTop: mobileH * 0.2 / 100,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100
    },
    termsPrivacyOrange: {
        marginTop: mobileH * 0.5 / 100,
        textAlign: 'center',
        fontSize: mobileW * 3.5 / 100,
        textDecorationLine: 'underline',
        color: Colors.orangeColor
    },
    LogInTxtOrange: {
        marginTop: mobileH * 6 / 100,
        textAlign: 'center',
        fontSize: mobileW * 5.2 / 100,
        // textDecorationLine: 'underline',
        color: Colors.orangeColor,
        paddingBottom: mobileH * 0.2 / 100,
        fontFamily: Font.FontFonoMedium
    }

})

