import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, BackHandler, AppState, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { config, Font, Colors, apifuntion, localStorage, Lang_chg, msgProvider, validationprovider, notification, mobileH, mobileW } from '../Provider/utilslib/Utils';
import { ScrollView } from 'react-native-gesture-handler'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { requestPermissionForDevice, requestUserPermission } from './PushController'

export default function Login({ navigation }) {
  const [name, setName] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureTextRepeat, setSecureTextRepeat] = useState(false);
  const [characters, setCharacters] = useState(false);
  const [number, setNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [specialCharacter, setSpecialCharacter] = useState(false);


  useFocusEffect(
    React.useCallback(() => {

      if (Platform.OS == "android") {
        requestPermissionForDevice();
      }
      requestUserPermission();

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


  const _userLogin = async () => {

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
    if (password.length < 8) {
      msgProvider.toast(Lang_chg.passwordMinLength[config.language], 'bottom')
      return false
    }

    _loginApiCalling()

  }

  const isFocused = useIsFocused();

  useEffect(() => {
    if (password != '') {

      var numberValidation = config.numberValidation;
      var spacailValidation = config.spacailValidation;
      var upperCaseValidation = config.upperCaseValidation;

      password.length > 8 ? setCharacters(true) : setCharacters(false)
      numberValidation.test(password) ? setNumber(true) : setNumber(false)
      spacailValidation.test(password) ? setSpecialCharacter(true) : setSpecialCharacter(false)
      upperCaseValidation.test(password) ? setUpperCase(true) : setUpperCase(false)
    } else {
      setCharacters(false)
      setNumber(false)
      setSpecialCharacter(false)
      setUpperCase(false)

    }
  }, [password])

  const clearData = () => {
    setemail("")
    setpassword("")
  }

  const _loginApiCalling = async () => {
    var FCM_TOKEN = await localStorage.getItemString("fcmTocken")
    
    global.props.showLoader();
    let apiUrl = appBaseUrl.LoginUrl;
    // email: email.toLowerCase(),

    var postData = JSON.stringify({
      email: email,
      password: password,
      fcmDeviceToken: FCM_TOKEN
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
          await localStorage.setItemString("isLogin", "1")
          await localStorage.setItemObject("UserData", response.data.getAllActiveModelusers)
          navigation.navigate('DailyexerciseList')
          clearData()
        } else {
          alert(response.data.ErrorMessage)
          global.props.hideLoader();
        }
      })
      .catch(error => {
        global.props.hideLoader();
        // Handle errors
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
          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mobileH * 30 / 100 }}>
            <View
              style={{ alignItems: 'center', width: mobileW }}>
              <Text
                style={styles.signTextColor}>{Lang_chg.Welcomeback[config.language]}</Text>

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
                    autoCapitalize='none'
                    keyboardType="email-address"
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

              {/*  --- Password Input --- */}
              <View
                style={styles.BaseView}>
                <Text
                  style={styles.EmailAddtxt}
                >{Lang_chg.Password[config.language]}</Text>
                <View
                  style={styles.InputView}>
                  <TextInput
                    value={password}
                    maxLength={16}
                    autoCapitalize='none'
                    placeholderTextColor="grey"
                    secureTextEntry={secureText}
                    onChangeText={(txt) => { setpassword(txt) }}
                    style={styles.TextInputs}></TextInput>
                  <TouchableOpacity
                    onPress={() => setSecureText(!secureText)}
                    activeOpacity={0.8}>
                    {secureText ?
                      <Image resizeMode='contain'
                        source={localimag.icon_eye_hide}
                        style={styles.eyeImageStyle1}></Image> :
                      <Image resizeMode='contain'
                        source={localimag.icon_eye}
                        style={styles.eyeImageStyle}></Image>
                    }
                  </TouchableOpacity>
                </View>

              </View>

              {/* ---Recover Password --- */}
              <TouchableOpacity onPress={() => { clearData(), navigation.navigate("RecoverPassword", { isRecoverPassword: true }) }}>
                <Text
                  style={[styles.recoverPass, { marginTop: mobileH * 1.5 / 100 }]
                  }>{Lang_chg.Recoverpassword[config.language]}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ marginTop: mobileH * 5 / 100 }}>
              <CommonButton
                onPressClick={() => {
                  _userLogin()
                }}
                apiData={(test) => console.log('Please check here -----', test)}
                title={Lang_chg.LogIn[config.language]
                }></CommonButton>
            </View>


            {/* --- Send Magic link --- */}

            {/* ---Recover Password --- */}
            <TouchableOpacity onPress={() => { clearData(), navigation.navigate("RecoverPassword", { isRecoverPassword: false }) }}>

              <Text
                style={[styles.recoverPass, { marginTop: mobileH * 4 / 100 }]
                }>{Lang_chg.Sendmagiclink[config.language]}</Text>

            </TouchableOpacity>



            {/* --- Privacy Notice --- */}

            <Text
              style={[
                styles.EmailAddtxt, {
                  marginTop: mobileH * 3 / 100,
                  textAlign: 'center',
                  fontSize: mobileW * 3.5 / 100,
                  color: Colors.whiteColor

                }]
              }>{Lang_chg.Privacynotice[config.language]}</Text>

            {/* --- By SignIn text --- */}

            <Text
              style={[styles.EmailAddtxt,
              {
                marginTop: mobileH * 2 / 100,
                textAlign: 'center',
                fontSize: mobileW * 3.2 / 100,
              }]
              }>{Lang_chg.Bysigningupyouare[config.language]}</Text>


            <TouchableOpacity onPress={() => { clearData(), navigation.navigate("WebViewScreen", { titles: Lang_chg.TermsServices }) }}>
              <Text style={[styles.bySignIn]
              }>{Lang_chg.ourtxt[config.language]} <Text style={[styles.termsPrivacyOrange]
              }>{Lang_chg.TermsServices[config.language]}</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { clearData(), navigation.navigate("WebViewScreen", { titles: Lang_chg.PrivacyPolicy }) }}>
              <Text style={[styles.bySignIn]
              }>{Lang_chg.and[config.language]} <Text style={[styles.termsPrivacyOrange]
              }>{Lang_chg.PrivacyPolicy[config.language]}</Text></Text>
            </TouchableOpacity>



            {/* --- LogIn txt --- */}
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { clearData(), navigation.navigate('SignUP') }}>
                <Text style={[styles.LogInTxtOrange]
                }>{Lang_chg.Signup[config.language]}</Text>
              </TouchableOpacity>
              <View style={{ width: mobileW * 20 / 100, height: 1, backgroundColor: Colors.orangeColor }}></View>

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
  checkPass: {
    fontSize: mobileW * 3.5 / 100,
  },
  LogInTxtOrange: {
    marginTop: mobileH * 6 / 100,
    textAlign: 'center',
    fontSize: mobileW * 5.2 / 100,
    // textDecorationLine: 'underline',
    color: Colors.orangeColor,
    paddingBottom: mobileH * 0.2 / 100,
    fontFamily: Font.FontFonoMedium,
  }

})

