import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, Linking, Alert, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { config } from '../Provider/configProvider'
import { Colors, Font } from '../Provider/Colorsfont'
import { localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import { ScrollView } from 'react-native-gesture-handler'
import queryString from 'query-string';
import { appBaseUrl } from './Apicallingprovider/ApiConstants'
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native'

export default function Splash({ navigation }) {
    global.props.hideLoader();

    const isFocused = useIsFocused();

    // useEffect(() => {
    //     const handleDeepLinkkk = (event) => {
    //         console.log('Deep Link Event:Nnnnnnnnn', event);
    //         console.log('URL:nnnnnnnnnn', event.url);
    //         // Handle deep link here
    //     };

    //     // Add event listener
    //     Linking.addEventListener('url', handleDeepLinkkk);

    //     // Remove event listener on component unmount
    //     return () => {
    //         Linking.removeEventListener('url', handleDeepLinkkk);
    //     };
    // }, []);



    var initialUrl12 = ""
    useEffect(() => {
      
        const handleInitialDeepLink = async () => {
            var initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                initialUrl12 = initialUrl
                // Handle the initial deep link
                pageNavigation(initialUrl)
                console.log("initialUrl===>", initialUrl);
            } 
        };

        // Handle initial deep link on app start
        handleInitialDeepLink();
        const handleDeepLinkkk = (event) => {
            console.log("event.url===>11111", event.url);
            if (event.url) {
                initialUrl12 = event.url
                pageNavigation(event.url)
            }
        };


        // Add event listener
        Linking.addEventListener('url', handleDeepLinkkk);
        // Remove event listener on component unmount

        

        return () => {
            Linking.removeEventListener('url', handleDeepLinkkk);
        };
    }, []);

    useEffect(() => {
        global.props.showLoader();

        setTimeout(() => {
            if(initialUrl12 == ""){
                pageNavigation(null);
            }
        }, 2000);
    }, []);


    const pageNavigation = (initialUrl1) => {
        console.log("newCondition===>111112222", initialUrl1);
        if (initialUrl1 != null) {
            extractTokenFromUrl(initialUrl1);
        } else {
            isLogin()
        }
    }




    // useEffect(() => {
    //     const handleDeepLink = async (event) => {
    //         const url = await Linking.getInitialURL();
    //         // url == null ? url = event.url : url
    //         console.log('urlurl:', url);
    //         if (url != null) {
    //             extractTokenFromUrl(url);
    //         } else {
    //             isLogin()
    //         }
    //     };
    //     handleDeepLink();
    //     // Linking.addEventListener('url', handleDeepLink);
    //     // return () => {
    //     //   Linking.removeEventListener('url', handleDeepLink);
    //     // };
    //     const subscription = Linking.addEventListener('url', handleDeepLink);
    //     return () => {
    //         // Remove the event listener when the component is unmounted using the subscription's remove method
    //         subscription.remove();
    //     };
    // }, []);

    const _VerifyApiCalling = async (token, isResetPassword) => {
        global.props.showLoader();
        let apiUrl = appBaseUrl.VerifytokenUrl + "?token=" + token;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'HttpOnly'
        };

        // Make a POST request using Axios
        axios.get(apiUrl, { headers })
            .then(async (response) => {
                console.log('VerifyTokenResponse--->', response.data);
                // Handle the successful response
                if (response.data.ErrorCode == "200") {
                    global.props.hideLoader();
                    await localStorage.setItemString("isLogin", "1")
                    await localStorage.setItemObject("UserData", response.data.verifyMagicLink)
                    // _ResetApiCalling(response.data.verifyMagicLink.magicToken)
                    isResetPassword == "login" || isLogin == "1" ? navigation.navigate('DailyexerciseList') : navigation.navigate('Splash');
                } else {
                    Alert.alert(Lang_chg.verifyToken[config.language], response.data.ErrorMessage);
                    global.props.hideLoader();
                }
            })
            .catch(error => {
                global.props.hideLoader();
                console.log('homeLevelError---', error);
                // Handle errors
            });
    }

    const extractTokenFromUrl = async (url) => {
        console.log('SplashUrl', url);
        const parsedUrl = queryString.parseUrl(url);
        const { token, isResetPassword } = parsedUrl.query;
        const isLogin = await localStorage.getItemString("isLogin");
        // The token and isResetPassword values are now available

        console.log('GetToken:', token);
        console.log('Is Reset Password:', isResetPassword);
        const cleanedToken = token.replace(/\//g, '');
        console.log("cleanedToken==>", cleanedToken);

        isResetPassword == "repairPassword" ? navigation.navigate('ResetPassword', { token: cleanedToken })
            : _VerifyApiCalling(cleanedToken, isResetPassword);


        // _VerifyApiCalling(cleanedToken, isResetPassword)
        global.props.hideLoader();

    };

    const isLogin = async () => {
        const isLogin = await localStorage.getItemString("isLogin");
        console.log("isLogin==>", isLogin);
        isLogin == "1" ? navigation.navigate('DailyexerciseList') : navigation.navigate('Splash');
        global.props.hideLoader();

    };
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1, alignItems: 'center' }}
                imageStyle={{ flex: 1 }}
                source={localimag.backgroud_gradient}>
                <Image resizeMode='contain' source={localimag.logo}
                    style={styles.LogoImage}></Image>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUP')}
                    activeOpacity={0.6}
                    style={{
                        alignSelf: "center", justifyContent: "center",
                        height: mobileW * 11 / 100, width: mobileW * 72 / 100,
                        alignItems: "center", borderRadius: mobileW * 3.5 / 100,
                        backgroundColor: Colors.lightAccent, marginTop: mobileH * 23 / 100
                    }}>
                    <Text
                        style={{
                            fontFamily: Font.FontBoldFono,
                            fontSize: mobileW * 3.5 / 100,
                            color: Colors.blackColor
                        }}>{Lang_chg.Signup[config.language]}</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.6}
                    style={{
                        alignSelf: "center", justifyContent: "center",
                        height: mobileW * 11 / 100, width: mobileW * 72 / 100,
                        alignItems: "center", borderRadius: mobileW * 3.5 / 100,
                        backgroundColor: Colors.lightAccent,
                        marginTop: mobileH * 2 / 100
                    }}>
                    <Text
                        style={{
                            fontFamily: Font.FontBoldFono,
                            fontSize: mobileW * 3.5 / 100,
                            color: Colors.blackColor
                        }}>{Lang_chg.Logintxt[config.language]}</Text>
                </TouchableOpacity>
            </ImageBackground></View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    LogoImage: {
        height: mobileW * 45 / 100,
        width: mobileW * 72 / 100,
        marginTop: mobileH * 20 / 100
    },
});


