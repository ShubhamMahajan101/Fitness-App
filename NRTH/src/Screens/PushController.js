
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage';
import notifee from '@notifee/react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}


export async function requestPermissionForDevice() {
  const checkPermission = await checkNotificationPermission();
  if (checkPermission !== RESULTS.GRANTED) {
    const request = await requestNotificationPermission();
    if (request == 'blocked') {
      // permission not granted
      const request = await requestNotificationPermission();
    }
  }
};

const requestNotificationPermission = async () => {
  const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  return result;
};

const checkNotificationPermission = async () => {
  const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  return result;
};

const getFcmToken = async () => {
  let checkTocken = await AsyncStorage.getItem('fcmTocken')
  if (!checkTocken) {
    try {
      var FcmToken = await messaging().getToken()
      if (!!FcmToken) {
        await AsyncStorage.setItem('fcmTocken', FcmToken)
      }
    } catch (error) {
      alert(error?.message)
    }
  }
}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {

      }
    });
  messaging().onMessage(async remoteMessage => {

    onDisplayNotification(remoteMessage.notification.body, remoteMessage.notification.title);
  });

  //   =====================display ============================


}

async function onDisplayNotification(body, title) {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: '@mipmap/ic_launcher_round',
      largeIcon: '@mipmap/ic_launcher_round',
      // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
