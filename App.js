import React, { useCallback, useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from './fontLoader';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import AddSchedule from './screens/AddSchedule';
import CountDown from './screens/CountDown';
import ChartHistory from './screens/Chart';
//import GroupedBars from './screens/Chart';
import * as Notifications from "expo-notifications";



const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);


  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
   

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: true,
        lightColor: "#FF231F7C",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });


  const Stack = createNativeStackNavigator()
  useEffect(() => {
    async function prepare() {
      try {

        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await _loadMyFonts();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        console.log('Loading app...')
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);



  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer  >
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='Home' component={Home} />
        <Stack.Screen options={{ headerShown: false }} name='AddSchedule' component={AddSchedule} />
        <Stack.Screen options={{ headerShown: false }} name='Chart' component={ChartHistory} />
        <Stack.Screen options={{ headerShown: false }} name='CountDown' component={CountDown} />



      </Stack.Navigator>
    </NavigationContainer>

  );

}

