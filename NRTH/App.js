import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, AppConsumer } from './src/Provider/context/AppProvider';
import Stacknav from './src/Provider/Routenavigation';
import { notificationListener, requestUserPermission, requestPermissionForDevice } from './src/Screens/PushController';
import { Linking, Platform, NativeModules } from 'react-native';
import { firebase } from '@react-native-firebase/auth';

const { VoiceChangingModule } = NativeModules;

global.MapAddress = 'NA';
class App extends Component {
  componentDidMount() {
    // console.log('I am here');
    if (Platform.OS == "android") {
      requestPermissionForDevice();
    }
    requestUserPermission();
    notificationListener();
  }

  

  changeToAlein = () => {
    // Platform.OS === 'android' && VoiceChangingModule.changeVoiceToAlien("audioTrackURL")
    VoiceChangingModule.changeVoiceToAlien()
      .then(data => {
        console.log('Received data from native module:', data);
      })
      .catch(error => {
        console.error('Error getting data from native module:', error);
      });
  };

  URlData = async () => {
    const url = await Linking.getInitialURL();
    console.log("URRRRRl==>", url);
  }
  render() {
    this.URlData()
    // this.changeToAlein()
    const linking = {
      prefixes: ["nrth://"], //prefixes can be anything depend on what you have wrote in intent filter 
      config: {
        initialRouteName: "Splash",  //define initial page jis page pr redirect krna h 
        screens: {
          ResetPassword: {    //define page name 
            path: "ResetPassword/:token",   //define url path pagename/:id ka name option h ydi aap is page pr use kr rhe ho to hi likhna h 
          },
        }

        // initialRouteName: "Splash" ,
        // screens: {
        //   // myapp://home -> HomeScreen
        //   Splash: "Splash",
        //   // myapp://details/1 -> DetailsScreen with param id: 1
        //   ResetPassword: "ResetPassword/:token",
        // },
      }
    }



    return (
      <NavigationContainer linking={linking}>
        <AppProvider {...this.props}>
          <AppConsumer>{funcs => {
            global.props = { ...funcs }
            return <Stacknav {...funcs} />
          }}
          </AppConsumer>
        </AppProvider>
      </NavigationContainer>

    );
  }
}

export default App;