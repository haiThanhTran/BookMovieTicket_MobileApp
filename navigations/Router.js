import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeStackNavigation from "../screens/HomeScreenComponents/HomeStackNavigation";
import ProfileStackNavigation from "../screens/ProfileStackNavigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Tab = createMaterialBottomTabNavigator();

const AppRouter = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStackNavigation"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor="#054E9B"
      inactiveColor="#666"
      style={{ height: 56 }}
      barStyle={{
        backgroundColor: "#ffffff",
        borderTopWidth: 2,
        borderTopColor: "#EEEEEE",
        height: 70,
        paddingBottom: 0,
      }}
      theme={{
        colors: {
          secondaryContainer: "transparent", // This removes the background color when active
        },
      }}
    >
      <Tab.Screen
        
        name="HomeStackNavigation"
        component={HomeStackNavigation}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-minus-outline"
              color={color}
              size={21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CinemaStackNavigation"
        component={HomeStackNavigation}
        options={{
          tabBarLabel: "Rạp phim",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="movie-open-outline"
              color={color}
              size={21}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="HomeStackNavigation"
        component={HomeStackNavigation}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={21} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="ProfileStackNavigation"
        component={ProfileStackNavigation}
        options={{
          tabBarLabel: "Hồ Sơ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={21}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppRouter;
