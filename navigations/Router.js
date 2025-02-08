import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeStackNavigation from "../screens/HomeStackNavigation";
import ProfileStackNavigation from "../screens/ProfileStackNavigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Tab = createMaterialBottomTabNavigator();

const AppRouter = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStackNavigation"
      shifting={false}
      activeColor="#0066CC"
      inactiveColor="#999999"
      barStyle={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        height: 64,
        padding: 0,
      }}
    >
      <Tab.Screen
        name="HomeStackNavigation"
        component={HomeStackNavigation}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStackNavigation"
        component={ProfileStackNavigation}
        options={{
          tabBarLabel: "Hồ Sơ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="information"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppRouter;
