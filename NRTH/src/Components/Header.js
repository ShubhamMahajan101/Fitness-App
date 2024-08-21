import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { Font, Colors } from '../Provider/Colorsfont'
import { mobileW, mobileH, config, localStorage } from '../Provider/utilslib/Utils'
import { localimag } from '../Provider/utilslib/Utils'

export default function Header({ title, firstImage, secondImage, navigation, navigateHome, subtitle }) {
    console.log("SECONDICON==>", secondImage)



    return (
        <View style={{}}>
            <View style={{
                width: mobileW, backgroundColor: Colors.blackColor, alignItems: 'center',
                elevation: 1, shadowOffset: { width: 0, },
                shadowColor: '#000',
                shadowOpacity: 0.1,
            }}>
                <View style={{
                    backgroundColor: Colors.blackColor, paddingVertical: mobileH * 2 / 100, flexDirection: 'row', alignItems: 'center', width: mobileW * 90 / 100, justifyContent: 'space-between'
                }}>
                    {firstImage != '' && firstImage != undefined ?
                        <TouchableOpacity
                            onPress={() => navigateHome == "Home" ? navigation.navigate("DailyexerciseList") : navigation.goBack()}
                            activeOpacity={0.7}
                            style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                                source={firstImage}></Image>
                        </TouchableOpacity>
                        :

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                                source={firstImage}></Image>
                        </TouchableOpacity>
                    }
                    <View style={{ alignItems: 'center', alignSelf: 'center', }}>
                        <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.DrunkBold, color: Colors.lightGreyColor }}>N R T H</Text>
                        {title ?
                            <Text style={{ lineHeight: mobileW * 5 / 100, marginTop: config.device_type == "ios" ? mobileW * 1.5 / 100 : 0, fontSize: mobileW * 3.3 / 100, textAlign: "center", fontFamily: Font.DrunkBold, color: Colors.lightAccent }}>{title}</Text>
                            : null}
                        {subtitle ?
                            <Text style={{ lineHeight: mobileW * 3 / 100, marginTop: mobileW * 1.5 / 100, fontSize: mobileW * 3 / 100, textAlign: "center", fontFamily: Font.FontRegularFono, color: Colors.lightAccent }}>{subtitle}</Text>
                            : null}
                    </View>
                    {secondImage ?
                        <TouchableOpacity
                            onPress={() => navigation.navigate('UserProfile')}
                            activeOpacity={0.7}
                            style={{ backgroundColor: Colors.IconBG, width: mobileW * 8 / 100, height: mobileW * 8 / 100, borderRadius: mobileW * 4 / 100, alignItems: 'center', justifyContent: 'center' }}
                        >

                            <Text style={{ color: Colors.whiteColor, fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontBoldFono }}>{secondImage}</Text>
                            {/* <Image resizeMode='contain' style={{tintColor:Colors.whiteColor, width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100, }}
                                source={secondImage}></Image> */}
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ width: mobileW * 5 / 100, height: mobileW * 8 / 100 }}>
                            <Text style={{ color: Colors.whiteColor, }}> </Text>
                        </TouchableOpacity>}

                </View>
            </View>
        </View>
    )
}