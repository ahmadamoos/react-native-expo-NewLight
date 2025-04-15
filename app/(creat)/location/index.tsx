import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons from @expo/vector-icons

const AdminLocationPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-6">
      {/* Card Container */}
      <View className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6">
          <Ionicons name="location" size={32} color="#3b82f6" />
          <Text className="text-2xl font-semibold ml-2">
            Location Management
          </Text>
        </View>

        {/* Buttons */}
        <View className="space-y-4">
          {/* Add Location */}
          <TouchableOpacity
            onPress={() => router.push("/(creat)/location/addlocation")}
            className="flex-row items-center justify-center bg-blue-500 py-3 rounded-xl"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-lg text-white ml-2">Add Location</Text>
          </TouchableOpacity>

          {/* Update Location */}
          <TouchableOpacity
            onPress={() => router.push("/(creat)/location/updateLocation")}
            className="flex-row items-center justify-center bg-yellow-500 py-3 rounded-xl"
          >
            <Ionicons name="pencil" size={20} color="white" />
            <Text className="text-lg text-white ml-2">Update Location</Text>
          </TouchableOpacity>

          {/* Delete Location */}
        </View>
      </View>
    </View>
  );
};

export default AdminLocationPage;
