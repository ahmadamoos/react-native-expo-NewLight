import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { useCart } from "@/context/CartGlobalProvider"; // Import the useCart hook

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

const TabsLayout = () => {
  const [admin, setAdmin] = useState(true);
  const { localCart } = useCart(); // Use the useCart hook to access the cart

  // Calculate total item count
  const totalItems = localCart.reduce(
    (sum, item) => sum + item.chosenQuantity,
    0
  );

  const TabIconn = ({ icon, color, focused, cartItemCount }) => {
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
        {/* Cart Item Count Badge */}
        {cartItemCount > 0 && (
          <View className="absolute top-[-5px] right-[-10px] bg-red-500 rounded-full w-5 h-5 justify-center items-center">
            <Text className="text-white text-xs">{cartItemCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#6214c2" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.homea} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIconn
              icon={icons.cart}
              color={color}
              focused={focused}
              cartItemCount={totalItems}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.search} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.user} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          headerShown: false,
          href: null,
        }}
      />

      <Tabs.Screen
        name="userOrder"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.ordeer} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          headerShown: false,
          href: admin ? "/admin" : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.admin} // Replace with the appropriate icon for the admin tab
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
