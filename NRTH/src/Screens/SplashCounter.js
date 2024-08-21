import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { localimag } from '../Provider/Localimageprovider/Localimage'

import { Lang_chg } from '../Provider/Language_provider'
import { config } from '../Provider/configProvider'
import { Colors, Font } from '../Provider/Colorsfont'
import { mobileH, mobileW } from '../Provider/utilslib/Utils'
import { useRoute } from '@react-navigation/native'
import { CheckUserStatus } from '../Components/ApiCallForLogot'

export default function SplashCounter({ navigation }) {

    const [count, setCount] = useState(3);
    const route = useRoute()
    const challengeItem = route.params?.challengeItem
    const ChallengeTime = route.params?.ChallengeTime
    useEffect(() => {
        CheckUserStatus({navigation})
        const timer = setInterval(() => {
            if (count > 1) {
                setCount(count - 1);

            } else {
                navigation.replace('StartCounter',{challengeItem:challengeItem,ChallengeTime:ChallengeTime})
                clearInterval(timer);
            }
        }, 2000);

        return () => {
            clearInterval(timer);
        };
    }, [count]);
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}
                imageStyle={{ flex: 1 }}
                source={localimag.backgroud_gradient}>
                <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.DrunkBold, color: Colors.lightAccent }}>Ready, Set,</Text>
                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.FontBoldFono, color: Colors.lightAccent }}>in</Text>
                {/* {count == 0 ?  <Text style={{color:Colors.lightAccent, fontSize:mobileW*8/100, fontFamily:Font.DrunkBold}}>Go!</Text>:null} */}
                <View style={{ marginTop: mobileW * -8 / 100 }}>
                    {count == 3 ? <Image resizeMode='contain' style={{ width: mobileW * 40 / 100, height: mobileW * 40 / 100 }}
                        source={localimag.icon_3}></Image> : null}
                    {count == 2 ? <Image resizeMode='contain' style={{ width: mobileW * 40 / 100, height: mobileW * 40 / 100 }}
                        source={localimag.icon_2}></Image> : null}
                    {count == 1 ? <Image resizeMode='contain' style={{ width: mobileW * 40 / 100, height: mobileW * 40 / 100, }}
                        source={localimag.icon_1}></Image> : null}
                </View>

                <View style={{ position: 'absolute', bottom: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.whiteColor, fontSize: mobileW * 3 / 100, fontFamily: Font.FontBoldFono }}>{count}s</Text>
                        <Image resizeMode='contain' style={{ width: mobileW * 4/ 100, height: mobileW * 4 / 100, marginHorizontal:mobileW*0.5/100 }} source={localimag.icon_watch}></Image>
                    </View>
                    <Image resizeMode='contain' style={{ width: mobileW * 20 / 100, height: mobileW * 10 / 100, marginTop: mobileW * 15 / 100, }} source={localimag.logo_white}></Image>
                </View>
            </ImageBackground>
        </View>
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
