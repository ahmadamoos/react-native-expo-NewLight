import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { getlocation } from "@/store/Actions/location";
import { auth } from "@/lib/firebase";
import axios from "axios";
import root from "@/lib/apihttp";
import { useRouter } from "expo-router";

const AddLocationPage = () => {
  const rout = useRouter();
  const dispatch = useDispatch();
  const { location: reduxLocation } = useSelector(
    (state) => state.locationdata
  );

  // Local state to hold redux locations
  const [localLocation, setLocalLocation] = useState([]);

  useEffect(() => {
    dispatch(getlocation());
  }, [dispatch]);

  useEffect(() => {
    setLocalLocation(reduxLocation);
  }, [reduxLocation]);

  // Predefined list of countries
  const countries = ["Israel", "Palestine"];

  // State for form fields
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [siteType, setSiteType] = useState("Home");
  const [customSiteType, setCustomSiteType] = useState("");

  const [filteredCities, setFilteredCities] = useState([]); // Cities based on selected country
  const [filteredVillages, setFilteredVillages] = useState([]); // Villages based on selected city

  // Filter cities when the selected country or localLocation data changes
  useEffect(() => {
    if (localLocation.length > 0) {
      const citiesForCountry = [
        ...new Set(
          localLocation
            .filter(
              (item) =>
                item.country.trim().toLowerCase() ===
                selectedCountry.trim().toLowerCase()
            )
            .map((item) => item.city.trim())
        ),
      ];
      setFilteredCities(citiesForCountry);
      // Auto-select the first city if available
      if (citiesForCountry.length > 0) {
        setSelectedCity(citiesForCountry[0]);
      } else {
        setSelectedCity("");
      }
    }
  }, [selectedCountry, localLocation]);
  const handleGoBack = () => {
    rout.push("/(tabs)/location");
  };
  // Filter villages when the selected city or localLocation data changes
  useEffect(() => {
    if (localLocation.length > 0 && selectedCity) {
      const villagesForCity = [
        ...new Set(
          localLocation
            .filter(
              (item) =>
                item.city.trim().toLowerCase() ===
                selectedCity.trim().toLowerCase()
            )
            .map((item) => item.village.trim())
        ),
      ];
      setFilteredVillages(villagesForCity);
      // Auto-select the first village if available
      if (villagesForCity.length > 0) {
        setSelectedVillage(villagesForCity[0]);
      } else {
        setSelectedVillage("");
      }
    }
  }, [selectedCity, localLocation]);

  // Handle form submission
  const handleSubmit = async () => {
    const user = auth.currentUser.uid;
    if (!selectedCountry || !selectedCity || !selectedVillage || !user) {
      Alert.alert("Error", "Please select country, city, and village.");
      return;
    }

    const locationData = {
      user_id: user,
      country: selectedCountry,
      city: selectedCity,
      village: selectedVillage,
      street: street,
      building_num: buildingNumber,
      floor_num: floorNumber,
      building_name: apartmentNumber,
      description_for_delivery: description,
      site_type: siteType === "Other" ? customSiteType : siteType,
    };

    try {
      const response = await axios.post(
        `http://${root}:3000/create-location`,
        locationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      Alert.alert("Success", "Location added successfully!");
    } catch (error) {
      console.error("Error adding location:", error);

      // Log the full error response for debugging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }

      Alert.alert("Error", "Failed to add location. Please try again.");
    }
  };
  return (
    <LinearGradient
      colors={["#F3F4F6", "#E5E7EB", "#D1D5DB"]}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Header Section */}

          <View className="p-8 bg-white rounded-b-2xl shadow-md mb-6 mx-4">
            <View className="w-full h-14 justify-center items-center px-4 flex-row">
              <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
                <Icon
                  name="chevron-back-circle-outline"
                  size={32}
                  color="black"
                />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-4xl font-bold text-gray-800 text-center">
                  Add Location
                </Text>
                <Text className="text-center text-gray-600 mt-2">
                  Fill in the details to add a new location.
                </Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View className="px-6 space-y-6 mb-20">
            {/* Country Picker */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Country <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(itemValue) => setSelectedCountry(itemValue)}
                dropdownIconColor="#6B7280"
              >
                {countries.map((country, index) => (
                  <Picker.Item key={index} label={country} value={country} />
                ))}
              </Picker>
            </View>

            {/* City Picker */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                City <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(itemValue) => setSelectedCity(itemValue)}
                dropdownIconColor="#6B7280"
              >
                {filteredCities.map((city, index) => (
                  <Picker.Item key={index} label={city} value={city} />
                ))}
              </Picker>
            </View>

            {/* Village Picker */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Village <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedVillage}
                onValueChange={(itemValue) => setSelectedVillage(itemValue)}
                dropdownIconColor="#6B7280"
              >
                {filteredVillages.map((village, index) => (
                  <Picker.Item key={index} label={village} value={village} />
                ))}
              </Picker>
            </View>

            {/* Street Input */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Street
              </Text>
              <TextInput
                className="border border-gray-300 mt-3 rounded-lg p-3 text-gray-800"
                placeholder="Enter street"
                placeholderTextColor="#9CA3AF"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            {/* Building Number Input */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Building Number/Name
              </Text>
              <TextInput
                className="border border-gray-300 mt-3 rounded-lg p-3 text-gray-800"
                placeholder="Enter building number"
                placeholderTextColor="#9CA3AF"
                value={buildingNumber}
                onChangeText={setBuildingNumber}
                keyboardType="numeric"
              />
            </View>

            {/* Floor Number Input */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Floor Number
              </Text>
              <TextInput
                className="border border-gray-300 mt-3 rounded-lg p-3 text-gray-800"
                placeholder="Enter floor number"
                placeholderTextColor="#9CA3AF"
                value={floorNumber}
                onChangeText={setFloorNumber}
                keyboardType="numeric"
              />
            </View>

            {/* Apartment Number Input */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Apartment Number
              </Text>
              <TextInput
                className="border border-gray-300 mt-3 rounded-lg p-3 text-gray-800"
                placeholder="Enter apartment number"
                placeholderTextColor="#9CA3AF"
                value={apartmentNumber}
                onChangeText={setApartmentNumber}
                keyboardType="numeric"
              />
            </View>

            {/* Description Input */}
            <View className="bg-white rounded-2xl mb-3 p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Description for Delivery
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-800 h-24 mt-3"
                placeholder="Enter description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Site Type Selection */}
            <View className="bg-white rounded-2xl p-4 shadow-lg">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Site Type
              </Text>
              <View className="flex-row justify-around">
                <TouchableOpacity
                  className={`items-center p-4 rounded-xl ${
                    siteType === "Home" ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => setSiteType("Home")}
                >
                  <Icon
                    name="home-outline"
                    size={32}
                    color={siteType === "Home" ? "#3B82F6" : "#4B5563"}
                  />
                  <Text className="text-gray-800 mt-2">Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`items-center p-4 rounded-xl ${
                    siteType === "Office" ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => setSiteType("Office")}
                >
                  <Icon
                    name="business-outline"
                    size={32}
                    color={siteType === "Office" ? "#3B82F6" : "#4B5563"}
                  />
                  <Text className="text-gray-800 mt-2">Office</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`items-center p-4 rounded-xl ${
                    siteType === "Other" ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => setSiteType("Other")}
                >
                  <Icon
                    name="location-outline"
                    size={32}
                    color={siteType === "Other" ? "#3B82F6" : "#4B5563"}
                  />
                  <Text className="text-gray-800 mt-2">Other</Text>
                </TouchableOpacity>
              </View>

              {/* Custom Site Type Input */}
              {siteType === "Other" && (
                <TextInput
                  className="mt-4 border border-gray-300 rounded-lg p-3 text-gray-800"
                  placeholder="Enter custom site type"
                  placeholderTextColor="#9CA3AF"
                  value={customSiteType}
                  onChangeText={setCustomSiteType}
                />
              )}
            </View>
          </View>
        </ScrollView>

        {/* Submit Button fixed above navigation */}
        <View className="absolute bottom-4 left-0 right-0 px-6">
          <TouchableOpacity
            className="rounded-2xl shadow-lg"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              className="p-5 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-lg">
                Submit Location
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddLocationPage;
