import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { ScrollView } from 'react-native-gesture-handler'
import { config, Font, Colors, apifuntion, localStorage, Lang_chg, msgProvider, validationprovider, notification, mobileH, mobileW } from '../Provider/utilslib/Utils';
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import { requestPermissionForDevice, requestUserPermission } from './PushController'


export default function SignUP({ navigation }) {
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [secureTextRepeat, setSecureTextRepeat] = useState(true);
    const [cpassword, setcpassword] = useState('');
    const [password, setpassword] = useState('');
    const [characters, setCharacters] = useState(false);
    const [number, setNumber] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const [specialCharacter, setSpecialCharacter] = useState(false);
    const [repeatCharacters, setRepeatCharacters] = useState(false);
    const [repeatNumber, setRepeatNumber] = useState(false);
    const [repeatUpperCase, setRepeatUpperCase] = useState(false);
    const [repeatSpecialCharacter, setRepeatSpecialCharacter] = useState(false);
    const _userSignUp = () => {

        //------------------name===================
        if (name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyFullName[config.language], 'bottom')
            return false
        }
        if (name.length <= 2) {
            msgProvider.toast(Lang_chg.fullNameMinLength[config.language], 'bottom')
            return false
        }
        var namevalidation = config.namevalidationNum;
        if (namevalidation.test(name) !== true) {
            msgProvider.toast(Lang_chg.nameNumCheck[config.language], 'bottom')
            return false
        }

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

        //password===================
        if (password.length <= 0) {
            msgProvider.toast(Lang_chg.emptyPassword[config.language], 'bottom')
            return false
        }
        if (password.length <= 8) {
            msgProvider.toast(Lang_chg.passwordMinLength[config.language], 'bottom')
            return false
        }
       
        if (password == '' || !characters || !number  || !specialCharacter || !upperCase) {
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

        if (cpassword.length <= 8) {
            msgProvider.toast(Lang_chg.cPassCharLess[config.language], 'bottom')
            return false
        }
    
        if (cpassword == '' || !repeatCharacters || !repeatNumber | !repeatUpperCase || !repeatSpecialCharacter) {
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


        _signUpApiCalling()

    }


    useEffect(() => {
        if (password != '') {

            var numberValidation = config.numberValidation;
            var spacailValidation = config.spacailValidation;
            var upperCaseValidation = config.upperCaseValidation;

            password.length > 8 ? setCharacters(true) : setCharacters(false)
            numberValidation.test(password) ? setNumber(true) : setNumber(false)
            spacailValidation.test(password) ? setSpecialCharacter(true) : setSpecialCharacter(false)
            upperCaseValidation.test(password) ? setUpperCase(true) : setUpperCase(false)

        } 
        else {

            setCharacters(false)
            setNumber(false)
            setSpecialCharacter(false)
            setUpperCase(false)

        }
    }, [password])

    useEffect(() => {
        if (cpassword != '') {

            var numberValidation = config.numberValidation;
            var spacailValidation = config.spacailValidation;
            var upperCaseValidation = config.upperCaseValidation;

            cpassword.length > 8 ? setRepeatCharacters(true) : setRepeatCharacters(false)
            numberValidation.test(cpassword) ? setRepeatNumber(true) : setRepeatNumber(false)
            spacailValidation.test(cpassword) ? setRepeatSpecialCharacter(true) : setRepeatSpecialCharacter(false)
            upperCaseValidation.test(cpassword) ? setRepeatUpperCase(true) : setRepeatUpperCase(false)

        } 
        else {
            setRepeatCharacters(false)
            setRepeatNumber(false)
            setRepeatSpecialCharacter(false)
            setRepeatUpperCase(false)

        }
    }, [cpassword])

    const clearData = () => {
        setName("")
        setemail("")
        setpassword("")
        setcpassword("")
    }


    useFocusEffect(
        React.useCallback(async() => {
    
       
      if (Platform.OS == "android") {
        requestPermissionForDevice();
      }
          requestUserPermission();
        
        }, [])
      );

    const _signUpApiCalling = async () => {
        var FCM_TOKEN = await localStorage.getItemString("fcmTocken")
    
        global.props.showLoader();
        let apiUrl = appBaseUrl.SignUpUrl;

        var postData = JSON.stringify({
            email: email.toLowerCase(),
            password: password,
            confirmPassword: cpassword,
            name: name,
            fcmDeviceToken: FCM_TOKEN

        });
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        axios.post(apiUrl, postData, { headers })
            .then(async (response) => {
                console.log("signUpResponse--->", response.data);
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    await localStorage.setItemString("isLogin", "1")
                    await localStorage.setItemObject("UserData", response.data.Createcustomers)
                    navigation.navigate('Home')
                    clearData()
                    msgProvider.toast("SignUp " + response.data.ErrorMessage, 'center')
                } else {
                    alert(response.data.ErrorMessage)
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
            });


        return false
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
                            >{Lang_chg.Signupandgetmoving[config.language]}</Text>

                            {/*  --- Name Input --- */}
                            <View
                                style={[styles.BaseView, { marginTop: mobileH * 5.5 / 100 }]}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.nameSurname[config.language]}</Text>
                                <View style={styles.InputView}>
                                    <TextInput
                                        value={name}
                                        maxLength={30}
                                        placeholderTextColor="black"
                                        onChangeText={(txt) => { setName(txt) }}
                                        style={styles.TextInputs}></TextInput>
                                    <TouchableOpacity
                                        onPress={() => setName('')}
                                        activeOpacity={0.8}>
                                        <Image resizeMode='contain'
                                            source={localimag.icon_close}
                                            style={styles.ImageStyle}
                                        ></Image></TouchableOpacity>
                                </View>
                            </View>

                            {/*  --- Email Input --- */}
                            <View style={[styles.BaseView]}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.eMailAddress[config.language]}</Text>
                                <View style={styles.InputView}>
                                    <TextInput
                                        value={email}
                                        maxLength={30}
                                        autoCapitalize='none'
                                        placeholderTextColor="black"
                                        onChangeText={(txt) => { setemail(txt) }}
                                        style={styles.TextInputs}></TextInput>
                                    <TouchableOpacity
                                        onPress={() => setemail('')} activeOpacity={0.8}>
                                        <Image resizeMode='contain'
                                            source={localimag.icon_close}
                                            style={styles.ImageStyle}
                                        ></Image></TouchableOpacity>
                                </View>
                            </View>

                            {/*  --- Password Input --- */}
                            <View style={styles.BaseView}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.Password[config.language]}</Text>
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
                            <View style={{ flexDirection: "column", marginTop: mobileH * 0.5 / 100, marginLeft: mobileH * 0 / 100 }}>

                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: mobileH * 0.5 / 100 }}>

                                    <Image resizeMode='contain'
                                        source={characters ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { tintColor: characters ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"8+ characters"}</Text>

                                    <Image resizeMode='contain'
                                        source={number ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { marginLeft: mobileH * 2.5 / 100, tintColor: number ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"1+ number"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: mobileH * 0.5 / 100 }}>
                                    <Image resizeMode='contain'
                                        source={upperCase ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { tintColor: upperCase ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"1+ Upper case"}</Text>
                                    <Image resizeMode='contain'
                                        source={specialCharacter ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { marginLeft: mobileH * 2.5 / 100, tintColor: specialCharacter ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{
                                            fontSize: mobileW * 3.5 / 100,
                                            textAlign: "left", color: Colors.lightAccent
                                        }]
                                        }>{"1+ Special character"}</Text>
                                </View>
                            </View>

                            {/*  --- Repeat Password Input --- */}
                            <View style={styles.BaseView}>
                                <Text style={styles.EmailAddtxt}
                                >{Lang_chg.Repeatpassword[config.language]}</Text>
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
                            <View style={{ flexDirection: "column", marginTop: mobileH * 0.5 / 100, marginLeft: mobileH * 0 / 100 }}>

                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: mobileH * 0.5 / 100 }}>

                                    <Image resizeMode='contain'
                                        source={repeatCharacters ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { tintColor: repeatCharacters ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"8+ characters"}</Text>

                                    <Image resizeMode='contain'
                                        source={repeatNumber ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { marginLeft: mobileH * 2.5 / 100, tintColor: repeatNumber ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"1+ number"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: mobileH * 0.5 / 100 }}>
                                    <Image resizeMode='contain'
                                        source={repeatUpperCase ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { tintColor: repeatUpperCase ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{ fontSize: mobileW * 3.5 / 100, textAlign: "left", color: Colors.lightAccent }]
                                        }>{"1+ Upper case"}</Text>
                                    <Image resizeMode='contain'
                                        source={repeatSpecialCharacter ? localimag.icon_Check : localimag.icon_close}
                                        style={[styles.ImageStyle, { marginLeft: mobileH * 2.5 / 100, tintColor: repeatSpecialCharacter ? "green" : "red" }]}></Image>
                                    <Text
                                        style={[{
                                            fontSize: mobileW * 3.5 / 100,
                                            textAlign: "left", color: Colors.lightAccent
                                        }]
                                        }>{"1+ Special character"}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: mobileH * 5 / 100 }}>
                            <CommonButton
                                onPressClick={() => {
                                    _userSignUp()
                                }}
                                ScreenName={'Home'}
                                title={Lang_chg.Signup[config.language]}></CommonButton>
                        </View>

                        {/* --- Privacy Notice --- */}

                        <Text style={[styles.EmailAddtxt, {
                            marginTop: mobileH * 3 / 100,
                            textAlign: 'center',
                            fontSize: mobileW * 3.5 / 100,
                            color: Colors.whiteColor
                        }]
                        }>{Lang_chg.Privacynotice[config.language]}</Text>

                        {/* --- By SignIn text --- */}

                        <Text style={[styles.EmailAddtxt,
                        {
                            marginTop: mobileH * 2 / 100,
                            textAlign: 'center',
                            fontSize: mobileW * 3.2 / 100
                        }]
                        }>{Lang_chg.Bysigningupyouare[config.language]}</Text>


                        <TouchableOpacity onPress={() => { navigation.navigate("WebViewScreen", { titles: Lang_chg.TermsServices }), clearData() }}>
                            <Text style={[styles.bySignIn]
                            }>{Lang_chg.ourtxt[config.language]} <Text style={[styles.termsPrivacyOrange]
                            }>{Lang_chg.TermsServices[config.language]}</Text></Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { navigation.navigate("WebViewScreen", { titles: Lang_chg.PrivacyPolicy }), clearData() }}>
                            <Text style={[styles.bySignIn]
                            }>{Lang_chg.and[config.language]} <Text style={[styles.termsPrivacyOrange]
                            }>{Lang_chg.PrivacyPolicy[config.language]}</Text></Text>
                        </TouchableOpacity>

                        {/* --- LogIn txt --- */}

                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { navigation.navigate('Login'), clearData() }}>
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

