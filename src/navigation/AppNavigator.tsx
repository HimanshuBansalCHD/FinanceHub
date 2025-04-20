import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SmartAuthScreen from "../screens/SmartAuthScreen";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/RegisterationScreen";
import HomeScreen from "../screens/Home";
import PayScreen from "../screens/PayScreen";
import AdditionalInformationScreen from "../screens/AdditionalInformationScreen";
import QRCodeScanner from "../screens/QRCodeScanner";
import PhoneNumberPayScreen from "../screens/PhoneNumberPaymentScreen";
import UnderDevelopmentScreen from "../screens/UnderDevelopmentScreen";
import SplashScreen from "../screens/SplashScreen";
// Define the stack navigator
const Stack = createNativeStackNavigator();

// Root stack param list (defined types for navigation)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Pay: undefined;
  LandingPage: undefined;
  QRCodeScanner: undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LandingPage"
          component={SmartAuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pay"
          component={PayScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdditionalInfomrationFoam"
          component={AdditionalInformationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRCodeScanner"
          component={QRCodeScanner}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhoneNumberPayScreen"
          component={PhoneNumberPayScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UnderDevelopmentScreen"
          component={UnderDevelopmentScreen}
          options={{ headerShown: false }}
        />

        {/* Fallback screen for any undefined routes */}
        <Stack.Screen
          name="NotFound"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
