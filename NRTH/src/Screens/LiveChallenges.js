import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Platform, Alert, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import moment from 'moment'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import LinearGradient from 'react-native-linear-gradient'
import BottomTab from '../Components/BottomTab'
import { Item } from 'react-native-paper/lib/typescript/components/List/List'

const DATA = [
  {
    id: 1,
    title: 1,
  },
  {
    id: 2,
    title: 2,
  },
  {
    id: 3,
    title: 3,
  },
  {
    id: 4,
    title: 1,
  },
  {
    id: 5,
    title: 2,
  },
  {
    id: 6,
    title: 3,
  },
  {
    id: 7,
    title: 1,
  },
  {
    id: 8,
    title: 2,
  },
  {
    id: 9,
    title: 3,
  },
];

const ChecklistData = [
  {
    id:1,
    title:'50 PULL UPS EVERY DAY FOR 50 DAYS'
  },
  {
    id:2,
    title:'50 PULL UPS EVERY DAY FOR 50 DAYS'
  },
  {
    id:2,
    title:'50 PULL UPS EVERY DAY FOR 50 DAYS'
  }
]

export default function LiveChallenges({ navigation }) {
  const [userName, setUserName] = useState("Ac")
  const [checkList, setCheckList] = useState('Grid')
  const [data, setData] = useState([{name:"Strength"},{name:"Strength"}])

  const flatListRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.x;
    setScrollPosition(offsetY);
    console.log("handleScroll==>",offsetY);
  };

  return (
    <View style={{flexDirection:"column", flex: 1, backgroundColor: Colors.backgroundcolor }}>
      <Header navigation={navigation} title={"LIVE CHELLANGES"} firstImage={localimag.icon_back} secondImage={userName} navigateHome={"Home"}></Header>

      {/* ++++++++++++++++++++++++++ Gradient Card++++++++++++++++++++ */}
      <View>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal={true}
          //   numColumns={7}
          //   ListFooterComponent={<FooterComponent lastItemText={previousDate} />}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{   justifyContent: "center", marginTop:mobileW*5/100, paddingBottom: mobileW * 10 / 100 }}
          renderItem={({ item, index }) =>
            <View style={{marginHorizontal:mobileW*5/100}}>
              <LinearGradient
                colors={['#EB6519', '#666666',]}
                style={styles.gradientCss}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 0.7 }}
              >
                <View style={styles.cardView}>
                  <View style={styles.cardHeaderView}>
                    <Text style={{
                      color: Colors.mediumGreyColor, fontFamily: Font.DrunkBold,
                      fontSize: mobileW * 2.5 / 100
                    }}>{item.name}</Text>

                    <Text style={styles.eliteText}>02-09-2024</Text>


                    <ImageBackground  style={{ alignItems:'center', justifyContent:'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, marginTop:mobileW*-3.8/100 }}
                        source={localimag.icon_shape2}>
                          <Text style={{color:Colors.blackColor,fontSize:mobileW*3/100, fontFamily:Font.DrunkBold}}>E</Text>
                        </ImageBackground>
                    {/* <Text style={styles.eliteText}>fdfd</Text> */}

                  </View>
                  <View style={{ alignItems: 'center' }}>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{
                        color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                        fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                      }}>50 </Text>
                      {/* {challengeItem.exerciseUnits != null && */}
                      <Text style={{
                        color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                        fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                      }}>PULL </Text>
                      {/* } */}
                      <Text style={{
                        color: Colors.lightAccent, marginTop: mobileW * 2 / 100,
                        fontFamily: Font.DrunkBold, fontSize: mobileW * 6 / 100
                      }}>UPS</Text>
                    </View>
                    <Text style={styles.everydayForText}>Everyday for</Text>
                    <Text style={{
                      marginTop: Platform.OS == "ios" ? mobileW * 2 / 100 : 0,
                      color: Colors.lightAccent, fontFamily: Font.DrunkBold,
                      fontSize: mobileW * 6 / 100
                    }}>
                      100 days</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: mobileW * 4 / 100, marginHorizontal: mobileW * 3 / 100 }}>
                    <View style={styles.selecteDateView}>
                      <Text style={{
                        color: Colors.orangeColor, fontSize: mobileW * 3.5 / 100,
                        fontFamily: Font.FontRegularFono
                      }}>Day 01/100</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                      <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontRegularFono, marginHorizontal: mobileW * 2 / 100, color: Colors.lightAccent }}>7:30am</Text>
                      <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100, }}
                        source={localimag.icon_time_white}></Image>
                    </View>

                  </View>
                </View>

              </LinearGradient>
            </View>
          }
        />
     </View>

      <View style={{ width: mobileW * 70 / 100, marginBottom:mobileW*5/100, borderColor: Colors.lightAccent, borderWidth: mobileW * 0.1 / 100, flexDirection: 'row', borderRadius: mobileW * 1.3 / 100, height: mobileW * 8 / 100, alignSelf: 'center', }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setCheckList("Grid")} style={{ width: mobileW * 35 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 2 / 100, height: mobileW * 8 / 100, backgroundColor: checkList == 'Grid' ? Colors.orangeColor : null }}>
          <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.lightAccent, fontFamily: Font.FontRegularFono }}>Grid</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setCheckList("Checklist")} style={{ width: mobileW * 35 / 100, alignItems: 'center', backgroundColor: checkList === 'Checklist' ? Colors.orangeColor : null, justifyContent: 'center', borderRadius: mobileW * 2 / 100, height: mobileW * 8 / 100, }}>
          <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.lightAccent, fontFamily: Font.FontRegularFono }}>Checklist</Text>

        </TouchableOpacity>
      </View> 


      {checkList == 'Grid' &&
        <View style={{ alignSelf: 'center' , marginTop:mobileW*5/100 }}>
          <Text style={{color:Colors.whiteColor, fontSize:mobileW * 2.6 / 100, fontFamily:Font.FontRegularFono}}>Start</Text>
          <Text style={{color:Colors.whiteColor, fontSize:mobileW * 2.6 / 100, fontFamily:Font.FontRegularFono}}>20-02-2020</Text>
          <FlatList
            data={DATA}
            numColumns={7}
            //   ListFooterComponent={<FooterComponent lastItemText={previousDate} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mobileH * 15 / 100 }}
            renderItem={({ item, index }) =>
              <View style={{ flexDirection: 'row', }}>
                <View style={{
                  backgroundColor: '#0000090', borderRadius: mobileW * 5.5 / 100, height: mobileW * 11 / 100,
                  width: mobileW * 11 / 100, borderWidth: mobileW * 0.1 / 100,
                  borderColor: Colors.lightAccent, marginRight: mobileW * 1.8 / 100,
                  marginTop: mobileW * 2 / 100, alignItems: 'center', justifyContent: 'center',
                }}>


                  {/* <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("VideoPlayer", { recordData: recordData, Index: index })} > */}
                  <TouchableOpacity activeOpacity={0.8}  >
                    <View
                      style={{
                        backgroundColor: Colors.lightAccent,
                        borderRadius: mobileW * 4.4 / 100,
                        height: mobileW * 8.8 / 100, width: mobileW * 8.8 / 100,
                        borderWidth: mobileW * 0.5 / 100,
                        borderColor: Colors.lightAccent, alignItems: "center",
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={[styles.DateDayTxt]}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                  {/* :
                          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("VideoPlayer", { recordData: challengeItem, Index: index })} >
                            <View
                              style={{
                                backgroundColor: Colors.orangeColor,
                                borderRadius: mobileW * 4.4 / 100,
                                height: mobileW * 8.8 / 100, width: mobileW * 8.8 / 100,
                                borderWidth: mobileW * 0.5 / 100,
                                borderColor: Colors.orangeColor, alignItems: "center",
                                justifyContent: 'center',
                              }}>
                              <Text style={[styles.DateDayTxt, { color: Colors.whiteColor }]}>{1}</Text>
                            </View>
                          </TouchableOpacity> */}



                </View>
                {/* {listLength % 7 === 0 || listLength % 6 === 0? null :
                    challengeItem.customerDayWiseExercises.length == item.exerciseCount &&
                    <View style={{ marginTop: mobileW * 2 / 100, marginLeft: mobileW * 1 / 100 }}>
                      <Text style={styles.DateTxt}>End</Text>
                      <Text style={[styles.DateTxt, { marginTop: mobileH * 0.3 / 100 }]}>{moment(previousDate).format("DD-MM-YYYY")}</Text>
                    </View>
                  } */}
              </View>
            } />
        </View>}



      {checkList == 'Checklist' &&
        <ScrollView >
          <FlatList
            data={ChecklistData}

            //   ListFooterComponent={<FooterComponent lastItemText={previousDate} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mobileH * 15 / 100 }}
            renderItem={({ item, index }) =>
              <View style={{ width: mobileW * 80 / 100, marginTop: mobileW * 5 / 100, borderWidth: mobileW * 0.2 / 100, borderRadius: mobileW * 5 / 100, alignSelf: 'center', borderColor: Colors.lightAccent }}>
                <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 3.5 / 100, padding: mobileW * 5 / 100, fontFamily: Font.FontRegularFono }}>{item.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 5.8 / 100, fontFamily: Font.DrunkBold, paddingLeft: mobileW * 5 / 100 }}>DAY 002/050</Text>
                  <TouchableOpacity activeOpacity={0.8} style={{ width: mobileW * 10 / 100, borderTopLeftRadius: mobileW * 2 / 100, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: mobileW * 2 / 100, height: mobileW * 8 / 100, backgroundColor: Colors.orangeColor }}>
                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.FontRegularFono, color: Colors.lightAccent }}>A</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', padding: mobileW * 5 / 100, }}>
                  <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 3 / 100, fontFamily: Font.FontRegularFono }}>02-09-2023 </Text>
                  <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 3 / 100, fontFamily: Font.FontRegularFono }}>+++++++++ </Text>
                  <Text style={{ color: Colors.lightAccent, fontSize: mobileW * 3 / 100, fontFamily: Font.FontRegularFono }}>10-010-2023 </Text>
                </View>
              </View>} />
        </ScrollView>

      }
      <View style={{position:"absolute",bottom:0}}>
      <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>

      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  calender_view: {
    // backgroundColor: Colors.whiteColor,
    alignSelf: "center",
    marginTop: mobileW * 3 / 100,
    // marginLeft: mobileW * 5 / 100,
  },
  areYoureadyText: {
    color: Colors.lightAccent,
    alignSelf: 'center',
    marginTop: mobileW * 5 / 100,
    fontFamily: Font.DrunkBold,
    fontSize: mobileW * 5 / 100
  },
  gradientCss: {
    width: mobileW * 88.4 / 100,
    padding: mobileW * 0.2 / 100,
    marginTop: mobileW * 5 / 100,
    alignSelf: 'center',
    borderRadius: mobileW * 4 / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    width: mobileW * 88 / 100,
    paddingBottom: mobileW * 3 / 100,
    borderRadius: mobileW * 4 / 100,
    backgroundColor: Colors.blackColor
  },
  cardHeaderView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: mobileW * 3.5 / 100,
    paddingVertical: mobileW * 3 / 100,

  },
  eliteText: {
    color: Colors.mediumGreyColor,
    fontFamily: Font.DrunkBold,
    fontSize: mobileW * 2.5 / 100,

  },
  cardHeaderImage: {
    width: mobileW * 11 / 100,
    height: mobileW * 11 / 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  everydayForText: {
    color: Colors.lightAccent,
    fontFamily: Font.FontRegularFono,
    // marginTop: mobileW * 1 / 100, 
    // marginBottom: mobileW * 1 / 100, 
    fontSize: mobileW * 3.5 / 100
  },
  selecteDateView: {
    padding: mobileW * 1.5 / 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: mobileW * 30 / 100,
    borderRadius: mobileW * 2 / 100,
    borderWidth: mobileW * 0.2 / 100,
    borderColor: Colors.orangeColor
  },
  Privious_icon: {
    width: mobileW * 5 / 100,
    height: mobileW * 5 / 100,
    tintColor: Colors.lightAccent
  },
  DateTxt: {
    color: Colors.whiteColor,
    fontFamily: Font.FontRegularFono,
    fontSize: mobileW * 2.6 / 100,
  },
  DateDayTxt: {
    color: Colors.orangeColor,
    fontFamily: Font.FontRegularFono,
    fontSize: mobileW * 3 / 100,
  },
})





