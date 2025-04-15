import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import root from "@/lib/apihttp";
import { useDispatch, useSelector } from "react-redux";
import { getlocation } from "@/store/Actions/location";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
const AddLocationForm = () => {
  const dispatch = useDispatch();
  const { location: reduxLocation } = useSelector(
    (state) => state.locationdata
  );
  const rout = useRouter();
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    village: "",
    price: "",
  });

  const [localLocation, setLocalLocation] = useState([]); // Local copy of location data
  const [filteredCities, setFilteredCities] = useState([]); // Cities based on selected country
  const [filteredVillages, setFilteredVillages] = useState([]); // Villages based on selected city

  // Copy Redux data to local state on component mount or when Redux data changes
  useEffect(() => {
    setLocalLocation(reduxLocation);
  }, [reduxLocation]);
  const handleGoBack = () => {
    rout.push("/location");
  };
  useEffect(() => {
    dispatch(getlocation());
  }, [dispatch]);

  useEffect(() => {
    // Filter cities based on selected country
    if (formData.country) {
      const citiesForCountry = [
        ...new Set(
          localLocation
            .filter((item) => item.country.trim() === formData.country.trim())
            .map((item) => item.city.trim())
        ),
      ];
      setFilteredCities(citiesForCountry);
      setFormData((prev) => ({ ...prev, city: "", village: "" }));
    } else {
      setFilteredCities([]);
    }
  }, [formData.country, localLocation]);

  useEffect(() => {
    // Filter villages based on selected city
    if (formData.city) {
      const villagesForCity = [
        ...new Set(
          localLocation
            .filter((item) => item.city.trim() === formData.city.trim())
            .map((item) => item.village.trim())
        ),
      ];
      setFilteredVillages(villagesForCity);
      setFormData((prev) => ({ ...prev, village: "" }));
    } else {
      setFilteredVillages([]);
    }
  }, [formData.city, localLocation]);

  const countries = [
    ...new Set(localLocation.map((item) => item.country.trim())),
  ];

  const [isAddingCity, setIsAddingCity] = useState(false);
  const [isAddingVillage, setIsAddingVillage] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      if (name === "country") {
        setIsAddingCity(false);
        setIsAddingVillage(false);
        return { ...prev, country: value, city: "", village: "" };
      }
      if (name === "city") {
        if (value === "new") {
          setIsAddingCity(true);
          return { ...prev, city: "" }; // Ensure city is empty when adding new
        } else {
          setIsAddingCity(false);
          return { ...prev, city: value, village: "" };
        }
      }
      if (name === "village") {
        if (value === "new") {
          setIsAddingVillage(true);
          return { ...prev, village: "" }; // Ensure village is empty when adding new
        } else {
          setIsAddingVillage(false);
          return { ...prev, village: value };
        }
      }
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async () => {
    try {
      // Trim all fields in formData
      const trimmedFormData = {
        country: formData.country.trim(),
        city: formData.city.trim(),
        village: formData.village.trim(),
        price: formData.price.trim(), // Assuming price is a string; if it's a number, handle accordingly
      };

      const { country, city, village, price } = trimmedFormData;

      // Validate required fields
      if (!country || !city || !price || !village) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      // Send the trimmed data to the backend
      const response = await axios.post(
        `http://${root}:3000/add-location`,
        trimmedFormData
      );

      const data = response.data.locationId;

      // Optionally, update the local state with the new location
      const newLocation = {
        country,
        city,
        village,
        price,
        id: response.data.locationId, // Assuming the backend returns the new location ID
      };

      setLocalLocation((prev) => [...prev, newLocation]);

      Alert.alert(
        "Success",
        `Message: the location has been added successfully `
      );

      // Reset form data
      setFormData({ country: "", city: "", village: "", price: "" });
    } catch (error) {
      console.error("Error adding location:", error);
      Alert.alert("Error", "Failed to add location. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 p-6 bg-gray-100">
      <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
        <Icon name="chevron-back-circle-outline" size={32} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-center mb-6">
        Add New Location
      </Text>

      {/* Country Selection */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Country</Text>
        <View className="bg-white border border-gray-300 rounded">
          <Picker
            selectedValue={formData.country}
            onValueChange={(itemValue) => handleChange("country", itemValue)}
          >
            <Picker.Item label="Select a country" value="" />
            {countries.map((country, index) => (
              <Picker.Item key={index} label={country} value={country} />
            ))}
          </Picker>
        </View>
      </View>

      {/* City Selection or Manual Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">City</Text>
        <View className="bg-white border border-gray-300 rounded">
          <Picker
            selectedValue={isAddingCity ? "new" : formData.city}
            onValueChange={(itemValue) => handleChange("city", itemValue)}
          >
            <Picker.Item label="Select a city" value="" />
            {filteredCities.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
            <Picker.Item label="Add new city" value="new" />
          </Picker>
        </View>
        {isAddingCity && (
          <TextInput
            placeholder="Enter new city name"
            value={formData.city} // Ensure input value is linked to state
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, city: text }))
            }
            className="w-full p-3 bg-white border border-gray-300 rounded mt-2"
          />
        )}
      </View>
      {/* Country Selection */}

      {/* Village Selection or Manual Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Village</Text>
        <View className="bg-white border border-gray-300 rounded">
          <Picker
            selectedValue={isAddingVillage ? "new" : formData.village}
            onValueChange={(itemValue) => handleChange("village", itemValue)}
          >
            <Picker.Item label="Select a village" value="" />
            {filteredVillages.map((village, index) => (
              <Picker.Item key={index} label={village} value={village} />
            ))}
            <Picker.Item label="Add new village" value="new" />
          </Picker>
        </View>
        {isAddingVillage && (
          <TextInput
            placeholder="Enter new village name"
            value={formData.village} // Ensure input value is linked to state
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, village: text }))
            }
            className="w-full p-3 bg-white border border-gray-300 rounded mt-2"
          />
        )}
      </View>

      {/* Price Input */}
      <View className="mb-6">
        <Text className="text-sm font-medium mb-1">Price</Text>
        <TextInput
          placeholder="Enter price"
          value={formData.price}
          onChangeText={(text) => handleChange("price", text)}
          keyboardType="numeric"
          className="w-full p-3 bg-white border border-gray-300 rounded"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full bg-blue-500 p-3 rounded items-center"
      >
        <Text className="text-white font-bold">Add Location</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddLocationForm;
