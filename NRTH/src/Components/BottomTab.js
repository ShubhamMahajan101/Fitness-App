import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { Font, Colors } from '../Provider/Colorsfont'
import { mobileW, mobileH, config, localStorage } from '../Provider/utilslib/Utils'
import { localimag } from '../Provider/utilslib/Utils'

export default function BottomTab({ title, firstImage, secondImage, navigation, navigateHome, subtitle, isAddIcon }) {
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
                    backgroundColor: Colors.blackColor, paddingVertical: mobileH * 1.5 / 100,
                    flexDirection: 'row', alignItems: 'center', width: mobileW * 80 / 100,
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DailyexerciseList")}
                        activeOpacity={0.7}
                        style={{
                            width: mobileW * 7 / 100, height: mobileW * 7 / 100,
                            alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Image resizeMode='contain' style={{
                            width: mobileW * 6 / 100,
                            height: mobileW * 6 / 100,
                        }}
                            source={localimag.icon_home_w}></Image>
                    </TouchableOpacity>

                    {isAddIcon == "true" ? null :
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}>
                            {/* <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.DrunkBold, color: Colors.lightGreyColor }}>N R T H</Text> */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Home')}
                                activeOpacity={0.7}
                                style={{
                                    backgroundColor: Colors.orangeColor,
                                    borderWidth: 1,
                                    position: "absolute",
                                    top: 0,
                                    marginTop: mobileW * -12 / 100,
                                    width: mobileW * 12 / 100, height: mobileW * 12 / 100,
                                    borderRadius: mobileW * 6 / 100, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>

                                <Image resizeMode='contain' style={{ tintColor: Colors.whiteColor, width: mobileW * 6 / 100, height: mobileW * 6 / 100, }}
                                    source={localimag.icon_plus}></Image>

                            </TouchableOpacity>
                        </View>
                    }
                        {/* onPress={() => navigation.navigate('LiveChallenges')} */}

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            borderColor: Colors.lightAccent,
                            borderWidth: 1,
                            width: mobileW * 7 / 100, height: mobileW * 7 / 100,
                            borderRadius: mobileW * 4 / 100, alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <Image resizeMode='contain' style={{ tintColor: Colors.whiteColor, width: mobileW * 4 / 100, height: mobileW * 4 / 100, }}
                            source={localimag.icon_Check}></Image>
                    </TouchableOpacity>


                </View>
            </View>
        </View>
    )
}