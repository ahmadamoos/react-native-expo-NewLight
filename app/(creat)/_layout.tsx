import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
// import { getCurrentUser } from '../../lib/firebase';

const TabIcon = ({ icon, color, focused }) => {
  return (
    <View className="relative items-center">
      {focused && (
        <View
          className={`absolute top-[-10px] w-16 h-1.5 bg-blue-600 rounded-full`}
        />
      )}
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? color : "gray"}
        className="w-8 h-8"
      />
    </View>
  );
};
const TabIconn = ({ icon, color, focused }) => {
  return (
    <View className="relative items-center">
      {focused && (
        <View
          className={`absolute top-[-7px] w-16 h-1.5 bg-blue-600 rounded-full`}
        />
      )}
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? color : "gray"}
        className="w-10 h-10"
      />
    </View>
  );
};

const TabsLayout = () => {
  const [admin, setAdmin] = useState(true);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#6214c2" },
      }}
    >
      <Tabs.Screen
        name="AddCreators"
        options={{
          headerShown: false,
          href: admin ? "/AddCreators" : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIconn
              icon={icons.AddCreatorss}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="AddProdacts"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.addprodactss}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="UpdateProduct"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.addprodactss}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.boxes} // Replace with the appropriate icon for the admin tab
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="decorations"
        options={{
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.decorations} // Replace with the appropriate icon for the admin tab
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.locationIcon} // Replace with the appropriate icon for the admin tab
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
