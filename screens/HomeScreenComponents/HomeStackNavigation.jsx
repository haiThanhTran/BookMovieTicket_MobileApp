import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePageScreen from "./HomePageScreen";
import FilmDetailScreen from "./FilmDetailScreen";
import ListFilmScreen from "./ListFilmScreen";
import OrderSeatScreen from "./OrderSeatScreen";
import TransactionScreen from "./TransactionScreen";

const Stack = createStackNavigator();

function HomeStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Trang Chủ"
        component={HomePageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="FilmDetailScreen" component={FilmDetailScreen} />
      <Stack.Screen
        name="Đặt Chỗ"
        component={OrderSeatScreen}
        options={{
          bottomTabBarStyle: { display: "none" }, // **Use bottomTabBarStyle to hide bottom tab navigator**
          headerShown: true,
          title: "Đặt Chỗ",
        }}
      />
      <Stack.Screen name="Thanh Toán" component={TransactionScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Xem Thêm Film"
        component={ListFilmScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
