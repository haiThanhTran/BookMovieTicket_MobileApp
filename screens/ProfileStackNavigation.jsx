import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreenComponents/ProfileScreen";
import LoginScreen from "../screens/AuthScreenComponents/LoginScreen";
import RegisterScreen from "../screens/AuthScreenComponents/RegisterScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Stack = createStackNavigator();

function ProfileStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Hồ Sơ"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Đăng nhập"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Thành công"
        component={SuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen options={{ headerShown: false }} name="Đăng ký" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigation;
