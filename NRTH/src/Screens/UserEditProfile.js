import { View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonButton from '../Components/CommonButton'
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import SmallButton from '../Components/SmallButton'
import { Lang_chg } from '../Provider/Language_provider'
import { config } from '../Provider/configProvider'
import { Colors, Font } from '../Provider/Colorsfont'
import { Cameragallery, localStorage, mediaprovider, mobileH, mobileW, msgProvider } from '../Provider/utilslib/Utils'
import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants'
import { CheckUserStatus } from '../Components/ApiCallForLogot'

export default function UserEditProfile({ navigation }) {
  const [name, setName] = useState('');
  const [email, setemail] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [password, setpassword] = useState('');
  const [media_pop_up, setmedia_pop_up] = useState('123456');
  const [profile_image, setprofile_image] = useState('NA');
  const [newProfile_image, setnewProfile_image] = useState('NA');
  const [formateUserName, setFormateUserName] = useState("Ac")
  const [user_id, setuser_id] = useState(0)
 
  const [isImageLoaded, setImageLoaded] = useState(false);


  useEffect(() => {
    getUserData()
    CheckUserStatus({navigation})
  }, [])

  const getUserData = async () => {
    let UserData = await localStorage.getItemObject("UserData")
    const formattedName = config.getFormateName(UserData.name);
    setFormateUserName(formattedName)
    setName(UserData.name)
    setemail(UserData.email)
    // setpassword(UserData.password)
    setpassword("Demo@123")
    setprofile_image(UserData.profileImageUrl)
    setuser_id(UserData._id)
  }




  const _UpadteProfile = async () => {

    //------------------ name ===================
    if (name.length <= 0) {
      msgProvider.toast(Lang_chg.emptyName[config.language], 'bottom')
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

    var data = new FormData();
    data.append('name', name)
    
    if (newProfile_image !== 'NA') {
      data.append('file', {
        uri: newProfile_image,
        type: 'image/jpeg',
        name: newProfile_image.split('/').pop(),
      });
    }
    data.append('profileImageUrl', '')
  
    global.props.showLoader();
    let apiUrl = appBaseUrl.customersProfile + '/' + user_id;
    let headers = {
      "Accept": 'application/json',
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-cache,no-store,must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,
      'Cookie': 'HttpOnly'
    }
    // Make a POST request using Axios
    axios.put(apiUrl, data, { headers })
      .then(async (response) => {
        // Handle the successful response
       
        if (response.data.ErrorCode == "200") {
          global.props.hideLoader();
          await localStorage.setItemObject("UserData", response.data.Updatecustomers)
          navigation.navigate('UserProfile')
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

  const _openCamera = () => {
    mediaprovider.launchCamera().then((obj) => {
      console.log(obj.path);
      setmedia_pop_up(false)
      setprofile_image(obj.path)
      setnewProfile_image(obj.path)
    })
  }

  const _openGellery = () => {
    mediaprovider.launchGellery().then((obj) => {
      console.log(obj.path);
      setmedia_pop_up(false)
      setprofile_image(obj.path)
      setnewProfile_image(obj.path)
    })
  }

  const closeMediaPopup = () => {
    setmedia_pop_up(false)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      {/* ----- Gallery Camera Picker ---- */}
      <Cameragallery
        mediamodal={media_pop_up}
        Camerapopen={_openCamera}
        Galleryopen={_openGellery}
        Canclemedia={closeMediaPopup} />

      <ImageBackground style={{ height: mobileH, width: mobileW }}
        imageStyle={{ height: mobileH, width: mobileW }}
        source={localimag.backgroud_gradient}>

        <Header
          navigation={navigation}
          title={Lang_chg.editProfileCapitalTxt[config.language]}
          secondImage='' />

        {/* --- Profile Section --- */}
        <ScrollView contentContainerStyle={{}}>

          <View
            style={styles.ProfileBaseView} >
            {profile_image == 'NA' ?
              <TouchableOpacity
                onPress={() => setmedia_pop_up(true)}
                activeOpacity={0.7}
                style={styles.ProfilePicView} >
                <Text style={styles.profileTxtView}>{formateUserName}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setmedia_pop_up(true)}
              >
               
                {profile_image != '' ?
                  <Image
                    resizeMode='cover'
                    source={{ uri: newProfile_image == "NA" ? profile_image : newProfile_image }}
                    style={styles.ProfilePicView}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}>

                  </Image>
                  :
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.ProfilePicView} >
                    <Text style={styles.profileTxtView}>{formateUserName}</Text>
                  </TouchableOpacity>
                }


              </TouchableOpacity>}
            <TouchableOpacity
              onPress={() => setmedia_pop_up(true)}
              style={{
                position: 'absolute',
                left: mobileW * 55 / 100,
                top: mobileH * 10 / 100
              }}
              activeOpacity={0.8}>
              <Image
                resizeMode='contain'
                source={localimag.icon_download}
                style={styles.BlankImageView}
              ></Image>
            </TouchableOpacity>
          </View>

          {/*  --- Name Input --- */}
          <View style={{ alignItems: 'center', justifyContent: 'center', width: mobileW }}>
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
                  editable={false}
                  placeholderTextColor="black"
                  onChangeText={(txt) => { setemail(txt) }}
                  style={styles.TextInputs}></TextInput>
              </View>
            </View>

            {/*  --- Password Input --- */}
            <View style={styles.BaseView}>
              <Text style={styles.EmailAddtxt}
              >{Lang_chg.Password[config.language]}</Text>
              <View style={styles.InputView}>
                <TextInput
                  value={password}
                  maxLength={15}
                  placeholderTextColor="black"
                  secureTextEntry={secureText}
                  editable={false}
                  // onChangeText={(txt) => { this.setState({ name: txt }) }}
                  style={[styles.TextInputs, { color: Colors.orangeColor }]}></TextInput>
              </View>
            </View>
          </View>
          <View style={{ marginTop: mobileH * 9 / 100 }}>
            <CommonButton
              ScreenName={'UserProfile'}
              onPressClick={() => {
                _UpadteProfile()
              }}
              navigation={navigation}
              title={Lang_chg.saveChanges[config.language]}></CommonButton>
          </View>

          {/* --- Privacy Notice --- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Text
              style={[
                styles.EmailAddtxt, {
                  marginTop: mobileH * 3 / 100,
                  textAlign: 'center',
                  fontSize: mobileW * 3.5 / 100,
                  color: Colors.lightAccent
                }]
              }>{Lang_chg.leaveWithoutSaving[config.language]}</Text>
          </TouchableOpacity>
        </ScrollView>

      </ImageBackground>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
  },
  headView: {
    width: mobileW,
    paddingBottom: mobileH * 3 / 100
  },
  EmailAddtxt: {
    color: Colors.lightAccent,
    fontFamily: Font.FontRegularFono,
    textAlign: 'center',
    fontSize: mobileW * 3 / 100,
    color: Colors.whiteColor
  },
  NameStyle: {
    color: Colors.lightAccent,
    fontFamily: Font.aeonikRegular,
    textAlign: 'center',
    fontSize: mobileW * 4 / 100,
    color: Colors.whiteColor
  },
  profileTxtView: {
    color: Colors.whiteColor,
    fontSize: mobileW * 7 / 100,
    fontFamily: Font.FontRegularFono
  },
  Emailtxt: {
    color: Colors.lightGreyColor,
    fontFamily: Font.FontRegularFono,
    textAlign: 'center',
    fontSize: mobileW * 3.2 / 100,
    marginTop: mobileH * 1 / 100,
    color: Colors.whiteColor
  },
  ProfileBaseView: {
    width: mobileW,
    paddingVertical: mobileH * 2 / 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: mobileH * 5 / 100
  },
  BlankImageView: {
    width: mobileW * 7.5 / 100,
    height: mobileW * 7.5 / 100,
    // position: 'absolute',
    // left: mobileW * 56 / 100,
    // top: mobileH * 11 / 100
  },
  ProfilePicView: {
    backgroundColor: Colors.IconBG,
    width: mobileW * 25 / 100,
    height: mobileW * 25 / 100,
    borderRadius: mobileW * 12.5 / 100,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: mobileW * 3 / 100,
    fontFamily: Font.aeonikRegular
  },
  TextInputs: {
    height: mobileW * 10 / 100,
    marginTop: mobileW * 1 / 100,
    width: mobileW * 67 / 100,
    fontFamily: Font.FontRegularFono,
    color: Colors.lightAccent,
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
})


