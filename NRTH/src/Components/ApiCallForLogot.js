import { View, Text, Alert } from 'react-native'
import React from 'react'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants';
import axios from 'axios';
import { localStorage } from '../Provider/localStorageProvider';

export async function CheckUserStatus({navigation}) {
  global.props.hideLoader();
    // global.props.showLoader();
    var User_Data = await localStorage.getItemObject("UserData");
    var User_Id = User_Data._id;
    console.log('User_Id----->>', User_Id);
    let apiUrl = appBaseUrl.CheckUserStatus + User_Id;
    console.log(apiUrl,'User_Id----->>', User_Id);

    const headers = {
        'Content-Type': 'application/json',
        'Cookie': 'HttpOnly'
    };

    // Make a POST request using Axios
    axios.get(apiUrl, { headers })
        .then(async (response) => {
            global.props.hideLoader();
            console.log('CheckUserStatus--->', response.data);
            if(response.data.ErrorCode==200){
                var UserActiveStatus = response.data.GetcustomersById.isActive
                var UserDeleteStatus = response.data.GetcustomersById.isDelete
                if(UserActiveStatus==0){
                    Alert.alert(
                        'Account deactivated',
                        'Your account has been deactivated',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                                setTimeout(() => {
                                    navigation.navigate('Login')
                                }, 500);
                            },
                          },
                        ],
                        { cancelable: false }
                      )
                }
                if(UserDeleteStatus==1){
                     Alert.alert(
                        'Account deleted',
                        'Your account has been deleted by Admin',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                                setTimeout(() => {
                                    navigation.navigate('Login')
                                }, 500);
                            },
                          },
                        ],
                        { cancelable: false }
                      )
                }
            }

        })
        .catch(error => {
            global.props.hideLoader();
            console.log('homeLevelError---', error);
            // Handle errors
        });
}