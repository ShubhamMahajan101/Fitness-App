import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW } from './utilslib/Utils';
import Splash from './Splash';
import Login from '../Screens/Login';
import ExerciseList from '../Screens/ExerciseList';
import Home from '../Screens/Home';
import AddChallenges from '../Screens/AddChallenges';
import SignUP from '../Screens/SignUP';
import DailyexerciseList from '../Screens/DailyexerciseList';
import StartChallenge from '../Screens/StartChallenge';
import UserProfile from '../Screens/UserProfile';
import UserEditProfile from '../Screens/UserEditProfile';
import StartCounter from '../Screens/StartCounter';
import ChallengeRecords from '../Screens/ChallengeRecords';
import DailyworkoutCompleted from '../Screens/DailyworkoutCompleted';
import VideoPlayer from '../Screens/VideoPlayer';
import VideoRecording from '../Screens/VideoRecording';
import EarnedBades from '../Screens/EarnedBades';
import SplashCounter from '../Screens/SplashCounter';
import WebViewScreen from '../Screens/WebViewScreen'
import RecoverPassword from '../Screens/RecoverPassword'
import ChallengeRecordsComplete from '../Screens/ChallengeRecordsComplete'
import ResetPassword from '../Screens/ResetPassword'
import EarnedBadgesDetails from '../Screens/EarnedBadgesDetails';
import SubscriptionPlanList from '../Screens/SubscriptionPlanList';
import PaymentHistoryList from '../Screens/PaymentHistory';
import LiveChallenges from '../Screens/LiveChallenges';

const Stack = createNativeStackNavigator();
const Stacknav = (navigation) => {


  return (
    <Stack.Navigator
      initialRouteName={"Splash"}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>

      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SignUP" component={SignUP} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="RecoverPassword" component={RecoverPassword} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false, gestureEnabled: false }} />

    
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="AddChallenges" component={AddChallenges} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SplashCounter" component={SplashCounter} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExerciseList" component={ExerciseList} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="DailyexerciseList" component={DailyexerciseList} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="StartChallenge" component={StartChallenge} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="UserEditProfile" component={UserEditProfile} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="StartCounter" component={StartCounter} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ChallengeRecords" component={ChallengeRecords} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="DailyworkoutCompleted" component={DailyworkoutCompleted} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="VideoRecording" component={VideoRecording} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="EarnedBades" component={EarnedBades} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ChallengeRecordsComplete" component={ChallengeRecordsComplete} options={{ headerShown: false, gestureEnabled: false }} />

      <Stack.Screen name="EarnedBadgesDetails" component={EarnedBadgesDetails} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SubscriptionPlanList" component={SubscriptionPlanList} options={{ headerShown: false, gestureEnabled: false }} />

      <Stack.Screen name="PaymentHistoryList" component={PaymentHistoryList} options={{ headerShown: false, gestureEnabled: false }} />

      <Stack.Screen name="LiveChallenges" component={LiveChallenges} options={{ headerShown: false, gestureEnabled: false }} />

      
      
    </Stack.Navigator>



  );
}
export default Stacknav