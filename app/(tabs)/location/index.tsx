import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getlocationbyid,
  getlocationbyidreset,
} from "@/store/Actions/getlocationbyid";
import { auth } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import root from "@/lib/apihttp";

const UserLocations = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: reduxLocation } = useSelector((state) => state.locationbyid);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null); // Track which dropdown is visible

  useEffect(() => {
    fetchLocations();
  }, [dispatch]);

  const fetchLocations = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      dispatch(getlocationbyid(userId));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLocations();
    setRefreshing(false);
  };

  useEffect(() => {
    return () => {
      dispatch(getlocationbyidreset());
    };
  }, []);

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const closeDropdown = () => {
    setDropdownVisible(null);
  };
  const handleGoBack = () => {
    router.push("/(tabs)/users");
  };

  const handleDeleteLocation = async (id) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(
                `http://${root}:3000/delete-locationuser/${id}`
              );
            } catch (error) {
              Alert.alert(
                "Deletion Failed",
                "Something went wrong while deleting."
              );
              console.error("Deletion Error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-semibold text-gray-800">
          {item.city}, {item.country}
        </Text>
        <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
          <Icon name="ellipsis-vertical-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {dropdownVisible === item.id && (
        <View className="absolute right-2 w-25 h-25 top-10 bg-white rounded-lg shadow-lg z-10">
          <TouchableOpacity
            className="px-4 py-2"
            onPress={() => handleDeleteLocation(item.id)}
          >
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.village && (
        <Text className="text-gray-600 mt-1">
          <Icon name="location-outline" size={16} color="#6B7280" />{" "}
          {item.village}
        </Text>
      )}
      {item.street && (
        <Text className="text-gray-600 mt-1">
          <Icon name="map-outline" size={16} color="#6B7280" /> {item.street}
        </Text>
      )}
      {item.building_num && (
        <Text className="text-gray-600 mt-1">
          <Icon name="business-outline" size={16} color="#6B7280" /> Building:{" "}
          {item.building_num}
        </Text>
      )}
      {item.floor_num && (
        <Text className="text-gray-600 mt-1">
          <Icon name="layers-outline" size={16} color="#6B7280" /> Floor:{" "}
          {item.floor_num}
        </Text>
      )}
      {item.partmint_num && (
        <Text className="text-gray-600 mt-1">
          <Icon name="home-outline" size={16} color="#6B7280" /> Apartment:{" "}
          {item.partmint_num}
        </Text>
      )}
      {item.description_for_delivery && (
        <Text className="text-gray-600 mt-1">
          <Icon name="document-text-outline" size={16} color="#6B7280" />{" "}
          Description: {item.description_for_delivery}
        </Text>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <LinearGradient colors={["#F3F4F6", "#E5E7EB"]} className="flex-1">
        <View className="flex-1 p-4">
          <View className="flex-row  mb-4">
            <TouchableOpacity onPress={() => handleGoBack()}>
              <Icon
                name="chevron-back-circle-outline"
                size={32}
                color="black"
              />
            </TouchableOpacity>
            <Text className="text-2xl ml-2 font-bold mb-4">Your Locations</Text>
          </View>

          <FlatList
            data={reduxLocation}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-3 mt-4"
            onPress={() => router.push("/location/userscreatelo")}
          >
            <Text className="text-white text-center text-lg">
              Add New Location
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default UserLocations;
