import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Header from '../Components/Header'
import { localimag } from '../Provider/Localimageprovider/Localimage'
import { Lang_chg } from '../Provider/Language_provider'
import { Colors, Font } from '../Provider/Colorsfont'
import { config, localStorage, mobileH, mobileW } from '../Provider/utilslib/Utils'
import Slider from 'react-native-slider'
import moment from 'moment';
import { appBaseUrl } from '../Provider/Apicallingprovider/ApiConstants';
import axios from 'axios';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { CheckUserStatus } from '../Components/ApiCallForLogot';
import BottomTab from '../Components/BottomTab';

const VideoPlayer = ({ navigation }) => {
  const route = useRoute()
  const recordData = route.params?.recordData
  const Index = route.params?.Index
  const videoRef = useRef();
  const [isMuted, setIsMuted] = useState(true); // Initialize with full volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userName, setUserName] = useState("Ac")
  const [videoList, setVideoList] = useState([])
  const [videoIndex, setVideoIndex] = useState(Index)
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    _GetVideoApiCalling()
    CheckUserStatus({ navigation })
  }, [])


  const _GetVideoApiCalling = async () => {
    let UserData = await localStorage.getItemObject("UserData")
    const formattedName = config.getFormateName(UserData.name);
    
    setUserName(formattedName)

    global.props.showLoader();
    let apiUrl = appBaseUrl.GetVideoChallengeUrl;

    var postData = JSON.stringify({
      challengeId: recordData._id,
      // challengeId: "65670fe8dab0af44da3b4db0",
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
          var ResponseData = response.data
          setVideoList(ResponseData.getVideoUrlsByChallengeId)
      
        } else {
          Alert.alert("Alert", response.data.ErrorMessage);
          global.props.hideLoader();
        }
      })
      .catch(error => {
        global.props.hideLoader();
        
        // Handle errors
      });
  }

  const togglePlayPause = () => {
    setPaused(!paused);

    if (duration == 0) {
      refreshVideo()
    }

  };
  const toggleMuteValume = () => {
    setIsMuted(!isMuted);
  };

  const togglePrevious = () => {
    setIsLoading(true);
    setVideoIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1) % videoList.length);
  };

  const toggleNext = () => {
    setIsLoading(true);
    setVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  };

  const onVolumeChange = (value) => {
    videoRef.current.setIsMuted(value);
  };

  const onSeek = (value) => {
    videoRef.current.seek(value);
  };
  const onFastForward = (seconds) => {
    const newTime = currentTime + seconds;
    if (newTime < duration) {
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };
  const onRewind = (seconds) => {
    const newTime = currentTime - seconds;
    if (newTime >= 0) {
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
    } else {
      videoRef.current.seek(0); // If rewinding beyond the start, go to the beginning
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds) => {
    let minutes
    if (seconds > 599) {
      minutes = Math.floor(seconds / 60);
    } else {
      minutes = '0' + Math.floor(seconds / 60);
    }
    const remainingSeconds = seconds % 60;
    console.log(remainingSeconds);
    const TimeInSecond = Math.trunc(remainingSeconds)
    return `${minutes}:${TimeInSecond < 10 ? '0' : ''}${TimeInSecond}`;
  };





  const onSliderValueChange = (value) => {
    // Update the video playback position
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
    }
  }
  const refreshVideo = () => {
    
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const stopSlider = () => {
    setCurrentTime(0);
    setDuration(0);
    setVideoList(videoList)
  }


  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }}
        imageStyle={{ flex: 1 }}
        source={localimag.backgroud_gradient}>
        <Header navigation={navigation} title={Lang_chg.challengeRecords} firstImage={localimag.icon_back} secondImage={userName} ></Header>

        <View style={{ flex: 1, width: mobileW * 92 / 100, alignSelf: 'center', justifyContent: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', }}>
              <Text style={{
                fontSize: mobileW * 5 / 100, color: Colors.lightAccent,
                fontFamily: Font.DrunkBold
              }}>{recordData.exerciseCount + " " + recordData.exercises.name}</Text>
              <Text style={styles.everydayForTxt}>{"Every" + recordData.exerciseDurations.name.toLowerCase() + " for"}</Text>
            </View>
            <Text style={{
              fontSize: mobileW * 5 / 100, color: Colors.lightAccent,
              fontFamily: Font.DrunkBold
            }}>{recordData.dayCount + " " + recordData.exerciseDurations.name}</Text>
          </View>

          {videoList != '' &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity activeOpacity={0.8} style={[styles.iconNextPrevies, { width: mobileW * 7 / 100, height: mobileW * 7 / 100, backgroundColor: Colors.orangeColor, position: 'absolute', top: mobileW * 5 / 100 }]}>
                <Text style={{
                  color: Colors.lightAccent, fontFamily: Font.FontRegularFono,
                  fontSize: mobileW * 3.5 / 100
                }}>{videoList[videoIndex].exerciseCount}</Text>

              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => togglePrevious()}>
                <Image resizeMode='contain' style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                  source={localimag.icon_left_arrow}></Image>
              </TouchableOpacity>


              <View style={{ backgroundColor: Colors.backgroundcolor, marginTop: mobileW * 5 / 100, width: mobileW * 68 / 100, borderRadius: mobileW * 3 / 100 }}>
                <Video
                  key={refreshKey}
                  ref={videoRef}
                  // source={{ uri: appBaseUrl.ImageLoadBaseUrl + videoList[videoIndex].videoUrl }}
                  source={{ uri:  videoList[videoIndex].videoUrl }}
                  // source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }}
                  onProgress={(e) => { setCurrentTime(e.currentTime), console.log("VP==>", e.currentTime) }}
                  onLoad={(e) => { setIsLoading(false), setDuration(e.duration), console.log("VP==>", e.currentTime) }}
                  onEnd={() => { togglePlayPause(), stopSlider() }}
                  onValueChange={onVolumeChange}
                  paused={paused}
                  volume={isMuted ? 0 : 1}
                  preload
                  resizeMode='cover'
                  style={{
                    width: mobileW * 68 / 100, height: mobileH * 50 / 100,
                    borderTopRightRadius: mobileW * 3 / 100, borderTopLeftRadius: mobileW * 3 / 100,
                    // backgroundColor:'green'
                  }}

                />

                {isLoading && (
                  <View style={styles.videoEmpty}>
                    <ActivityIndicator size="large" color="#fff" />

                  </View>
                )}

                {videoList[videoIndex].videoUrl == '' &&
                  <Text style={styles.videoEmpty}>Video Not Available</Text>
                }
                <Text style={styles.videoCurrentTime}>{formatTime(currentTime.toFixed(2))}</Text>
                {/* <Text style={styles.videoCurrentTime}>{formattedTime}</Text> */}
                <View style={{}}>

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: mobileW * 2.5 / 100, width: mobileW * 0.5 / 100, backgroundColor: Colors.whiteColor }}></View>
                    {videoList != '' &&

                      <Slider
                        value={currentTime}
                        minimumValue={0}
                        maximumValue={duration}
                        step={0.01}
                        onValueChange={onSeek}
                        minimumTrackTintColor={Colors.mediumDarkGrey}
                        maximumTrackTintColor={Colors.blackColor}
                        // thumbTintColor="red"
                        thumbStyle={{ width: 2, height: 12, backgroundColor: Colors.whiteColor }}
                        trackStyle={{ height: 12, }}
                        thumbTouchSize={{ width: 20, height: 20 }}
                        onSlidingStart={() => console.log('Sliding started')}
                        onSlidingComplete={() => console.log('Sliding completed')}
                        style={{ width: '99%', height: mobileW * 2.5 / 100, backgroundColor: 'red' }} />
                    }
                    <View style={{ height: mobileW * 2.5 / 100, width: mobileW * 0.5 / 100, backgroundColor: Colors.whiteColor }}></View>
                  </View>


                  <View style={{ flexDirection: 'row', marginTop: mobileW * 2 / 100, alignItems: 'center', marginBottom: mobileW * 2 / 100, marginHorizontal: mobileW * 3 / 100 }}>
                    <TouchableOpacity onPress={togglePlayPause} >
                      {paused ? <Image resizeMode='contain' style={{
                        width: mobileW * 4 / 100, height: mobileW * 4 / 100,
                        tintColor: Colors.whiteColor,
                      }}
                        source={localimag.icon_play}></Image>
                        :
                        <Image resizeMode='contain' style={{
                          width: mobileW * 4 / 100,
                          height: mobileW * 4 / 100, tintColor: Colors.whiteColor,
                        }}
                          source={localimag.icon_pause}></Image>
                      }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onRewind(10)} style={{ marginHorizontal: mobileW * 4 / 100 }}>
                      <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, tintColor: Colors.whiteColor, }}
                        source={localimag.icon_left_skip}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onFastForward(10)} >
                      <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, tintColor: Colors.whiteColor, }}
                        source={localimag.icon_right_skip}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleMuteValume} style={{ marginHorizontal: mobileW * 4 / 100 }}>
                      {isMuted ?
                        <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, tintColor: Colors.whiteColor, }}
                          source={localimag.icon_enable_sound}></Image> :
                        <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, tintColor: Colors.whiteColor, }}
                          source={localimag.icon_volume}></Image>
                      }
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={() => toggleNext()} >
                <Image resizeMode='contain' style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                  source={localimag.icon_right_arrow}></Image>
              </TouchableOpacity>
            </View>
          }
          
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={{ marginTop: mobileW * 10 / 100, }}>
            <Text style={styles.backToChallengesTxt}>{Lang_chg.backToChallenges}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <BottomTab navigation={navigation} navigateHome={"Home"} firstImage={localimag.icon_home} title={Lang_chg.yourDailyExercise} secondImage={userName} subtitle={Lang_chg.TodayIsTheDay} ></BottomTab>

    </View>
  );
};

export default VideoPlayer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundcolor
  },
  everydayForTxt: {
    fontSize: mobileW * 4 / 100,
    marginHorizontal: mobileW * 5 / 100,
    color: Colors.lightAccent,
    alignSelf: 'flex-end',
    fontFamily: Font.FontRegularFono
  },
  iconNextPrevies: {
    width: mobileW * 8 / 100,
    height: mobileW * 8 / 100,
    borderRadius: mobileW * 5 / 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundcolor
  },
  videoCurrentTime: {
    color: Colors.whiteColor,
    position: 'absolute',
    alignSelf: 'center',
    bottom: mobileW * 17 / 100,
    fontSize: mobileW * 4 / 100,
    fontFamily: Font.aeonikRegular
  },

  videoEmpty: {
    color: Colors.whiteColor,
    position: 'absolute',
    alignSelf: 'center',
    bottom: mobileW * 55 / 100,
    fontSize: mobileW * 4 / 100,
    fontFamily: Font.DrunkBold
  },
  backToChallengesTxt: {
    fontSize: mobileW * 3.5 / 100,
    textAlign: 'center',
    color: Colors.lightAccent,
    fontFamily: Font.FontRegularFono
  }
})