//import liraries
// import React, { Component } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// // create a component
// const CommonButton = (props) => {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//       onPress={()=>props.onPressClick()}>
//       <Text>CommonButton</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // define your styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#2c3e50',
//   },
// });

// //make this component available to the app
// export default CommonButton;


import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Font, Colors } from '../Provider/Colorsfont'
import { apifuntion, mobileW } from '../Provider/utilslib/Utils'

const CommonButton = ({ ScreenName, title, navigation, apiData ,onPressClick,keys}) => {

  const _apiCalling = async (status = 0) => {
    let url = 'https://dummy.restapiexample.com/api/v1/employees'
    apifuntion.getApi(url).then((obj) => {
      // console.log('obj---', obj);
      apiData(obj)
    }).catch((error) => {
      console.log('error---', error);
    })
  }

  return (
    <View style={{}}>
      <TouchableOpacity
        // key={keys}
        onPress={onPressClick}
        activeOpacity={0.6}
        style={{
          alignSelf: "center", justifyContent: "center",
          height: mobileW * 12 / 100, width: mobileW * 75 / 100,
          alignItems: "center", borderRadius: mobileW * 3.5 / 100,
          backgroundColor: Colors.buttonColor
        }}>
        <Text
          style={{
            fontFamily: Font.FontRegularFono,
            fontSize: mobileW * 4.2 / 100,
            color: Colors.lightAccent
          }}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}
export default CommonButton