import React, { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getlocation, restartlocation } from "@/store/Actions/location";
import axios from "axios";
import Checkbox from "expo-checkbox";
import root from "@/lib/apihttp";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const UpdateLocation = () => {
  const dispatch = useDispatch();
  const { location: reduxLocation } = useSelector(
    (state) => state.locationdata
  );
  const rout = useRouter();
  const [localLocation, setLocalLocation] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState({});
  const [locationDelete, setLocationDelete] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Fetch locations on component mount
  useEffect(() => {
    dispatch(getlocation());
  }, [dispatch]);

  // Update localLocation when reduxLocation changes
  useEffect(() => {
    if (reduxLocation && reduxLocation.length > 0) {
      setLocalLocation(reduxLocation);
    }
  }, [reduxLocation]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedLocations({});
    setLocationDelete({});

    try {
      await dispatch(getlocation()); // Fetch the latest data
    } catch (error) {
      console.error("Error refreshing locations:", error);
      Alert.alert("Error", "Failed to refresh locations.");
    } finally {
      setRefreshing(false); // Reset refreshing state
    }
  };

  // Reset location state on component unmount
  useEffect(() => {
    return () => {
      dispatch(restartlocation()); // Reset Redux state
    };
  }, [dispatch]);

  // Toggle selection for update
  const toggleSelection = (id) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle selection for deletion
  const toggleSelectionDelete = (id) => {
    setLocationDelete((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    setLocalLocation((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "price" ? parseFloat(value) || 0 : value,
            }
          : item
      )
    );
  };

  // Navigate back
  const handleGoBack = () => {
    rout.push("/location");
  };

  // Handle update selected locations
  const handleUpdate = async () => {
    const updates = localLocation.filter((item) => selectedLocations[item.id]);

    if (updates.length === 0) {
      Alert.alert("No selection", "Please select locations to update.");
      return;
    }

    // Confirmation Alert
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to save the changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Update",
          onPress: async () => {
            try {
              await Promise.all(
                updates.map(async (location) => {
                  const { id, country, city, village, price } = location;
                  await axios.put(`http://${root}:3000/update-location/${id}`, {
                    country,
                    city,
                    village,
                    price,
                  });
                })
              );
              Alert.alert("Success", "Locations updated successfully!");
              // Refresh the list after update
              onRefresh();
            } catch (error) {
              Alert.alert(
                "Update Failed",
                "Something went wrong while updating."
              );
              console.error("Update Error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Handle delete selected locations
  const handleDelete = async () => {
    const deletions = Object.keys(locationDelete).filter(
      (id) => locationDelete[id]
    );

    if (deletions.length === 0) {
      Alert.alert("No selection", "Please select locations to delete.");
      return;
    }

    // Confirmation Alert
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete the selected locations?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await Promise.all(
                deletions.map(async (id) => {
                  await axios.delete(
                    `http://${root}:3000/delete-location/${id}`
                  );
                })
              );
              Alert.alert("Success", "Locations deleted successfully!");
              // Refresh the list after deletion
              onRefresh();
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
    onRefresh();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
        <Icon name="chevron-back-circle-outline" size={32} color="black" />
      </TouchableOpacity>
      <View className="p-4 flex-1">
        <FlatList
          data={localLocation}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }} // Add padding for the button
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View className="p-4 mb-4 bg-white rounded-2xl shadow-md border border-gray-200">
              <TextInput
                className="border border-gray-300 p-4 rounded-lg text-gray-800 mb-3 bg-gray-50 focus:border-blue-500"
                value={item.country}
                onChangeText={(text) =>
                  handleInputChange(item.id, "country", text)
                }
                placeholder="Country"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                className="border border-gray-300 p-4 rounded-lg text-gray-800 mb-3 bg-gray-50 focus:border-blue-500"
                value={item.city}
                onChangeText={(text) =>
                  handleInputChange(item.id, "city", text)
                }
                placeholder="City"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                className="border border-gray-300 p-4 rounded-lg text-gray-800 mb-3 bg-gray-50 focus:border-blue-500"
                value={item.village}
                onChangeText={(text) =>
                  handleInputChange(item.id, "village", text)
                }
                placeholder="Village"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                className="border border-gray-300 p-4 rounded-lg text-gray-800 mb-3 bg-gray-50 focus:border-blue-500"
                value={item.price.toString()}
                onChangeText={(text) =>
                  handleInputChange(item.id, "price", text)
                }
                placeholder="Price"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <View className="flex-row items-center mt-2">
                <Checkbox
                  value={!!selectedLocations[item.id]}
                  onValueChange={() => toggleSelection(item.id)}
                  color={selectedLocations[item.id] ? "#007BFF" : undefined}
                  className="mr-2 w-6 h-6 border-gray-400 rounded-md"
                />
                <Text className="text-gray-700 text-lg">Select for Update</Text>

                <Checkbox
                  value={!!locationDelete[item.id]}
                  onValueChange={() => toggleSelectionDelete(item.id)}
                  color={locationDelete[item.id] ? "#FF0000" : undefined} // Red color for deletion
                  className="ml-4 mr-2 w-6 h-6 border-gray-400 rounded-md"
                />
                <Text className="text-gray-700 text-lg">Select for Delete</Text>
              </View>
            </View>
          )}
        />
        {Object.values(selectedLocations).includes(true) && (
          <TouchableOpacity
            className="bg-blue-600 p-5 rounded-full items-center shadow-lg absolute bottom-8 left-6 right-6"
            onPress={handleUpdate}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              Update Selected
            </Text>
          </TouchableOpacity>
        )}
        {Object.values(locationDelete).includes(true) && (
          <TouchableOpacity
            className="bg-red-600 p-5 rounded-full items-center shadow-lg absolute bottom-24 left-6 right-6"
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              Delete Selected
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UpdateLocation;
