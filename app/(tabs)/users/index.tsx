import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "@/lib/firebase";
import { useGlobalContext } from "@/context/GlobalProvider";
import root from "@/lib/apihttp";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const PersonalPage = () => {
  const router = useRouter();
  const { isLoggedIn, user, setIsLoggedIn, isLoading } = useGlobalContext(); // Get global state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userdata, setuserdata] = useState(null);
  const [phonePrefix, setPhonePrefix] = useState("00970"); // Default prefix

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      getuserdata();
    }
  }, []);

  const getuserdata = async () => {
    try {
      const user = auth.currentUser?.uid;

      const respons = await axios.get(`http://${root}:3000/user-info`, {
        params: {
          uid: user,
        },
      });
      setuserdata(respons.data.data);
      if (respons.data.data.phone_number) {
        setPhoneNumber(respons.data.data.phone_number);
      }
      // Set profile image
      if (
        respons.data.data.profile_image &&
        respons.data.data.profile_image.startsWith("http")
      ) {
        setProfileImage(respons.data.data.profile_image);
      } else {
        setProfileImage(
          "https://lh3.googleusercontent.com/a/ACg8ocIO3Rj-O37fi7gT5Dzi2pxGnOBK9IBg6OcptFRM89Sey_p250Y=s96-c"
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await GoogleSignin.signOut();
      setIsLoggedIn(false); // Set login state to false after signing out

      router.push("/(auth)/sign-in");
      console.log("User signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addphone = async () => {
    try {
      const userid = auth.currentUser?.uid;
      if (userid) {
        const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;
        if (
          !fullPhoneNumber ||
          fullPhoneNumber.length < 12 ||
          fullPhoneNumber.length > 14
        ) {
          Alert.alert("Error", "Please enter a valid phone number.");
          return;
        }
        const respons = await axios.post(`http://${root}:3000/phone`, {
          user_id: userid,
          phone_number: fullPhoneNumber,
        });
        Alert.alert("Success", "Phone number added successfully!");
        getuserdata(); // Refresh user data
      } else {
        Alert.alert("Error", "User ID not found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // If loading is true, show a loading message or spinner
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Show "Sign Up" text if user is anonymous, otherwise show PersonalPage UI
  if (!isLoggedIn || (user && user.isAnonymous)) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-2xl font-semibold">Sign Up to Continue</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-up")} // Add the route for sign-up page
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          <Text className="text-lg">Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={["#D4C9F0", "#C3E8F1"]} className="flex-1">
      <SafeAreaView className="flex-1 p-6">
        {/* Profile Section */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={pickImage}
            className="w-24 h-24 rounded-full bg-purple-200 overflow-hidden"
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full object-cover"
              />
            ) : (
              <Ionicons
                name="camera"
                size={40}
                color="#4f46e5"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-gray-800">Profile</Text>
        </View>

        {/* Conditional Rendering Based on Login State */}
        <View>
          {isLoggedIn ? (
            // If logged in (not anonymous)
            <Text className="text-xl font-semibold text-gray-700">
              Welcome, {user?.displayName || user?.email}
            </Text>
          ) : (
            // If anonymous user
            <Text className="text-xl font-semibold text-gray-700">
              Welcome, Guest
            </Text>
          )}
        </View>

        {/* Phone Number Section */}
        {isLoggedIn && (
          <View className="bg-white p-6 rounded-lg mb-8">
            <Text className="text-sm text-gray-600 mb-2">Contact Number</Text>
            {userdata?.phone_number ? (
              <Text className="text-lg text-gray-800 font-medium">
                {userdata.phone_number}
              </Text>
            ) : (
              <View className="flex-row items-center">
                <View
                  className="border-2 border-gray-300 rounded-lg mr-2"
                  style={{ width: 120 }}
                >
                  <Picker
                    selectedValue={phonePrefix}
                    onValueChange={(itemValue) => setPhonePrefix(itemValue)}
                    dropdownIconColor="#4f46e5"
                    style={{
                      color: "#1f2937",
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    <Picker.Item label="00970" value="00970" />
                    <Picker.Item label="00972" value="00972" />
                  </Picker>
                </View>
                <TextInput
                  className="flex-1 text-base text-gray-800 font-medium py-2 px-3 rounded-lg border-2 border-gray-300"
                  placeholder="Enter phone number..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            )}
            {!userdata?.phone_number && (
              <TouchableOpacity
                onPress={addphone}
                className="mt-4 px-6 py-2 bg-blue-500 rounded-lg"
              >
                <Text className="text-lg text-white text-center">
                  Add Phone
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Navigation Options */}
        <ScrollView className="space-y-4">
          {[
            {
              name: "Customer Support",
              icon: "headset",
              route: "users/customerSupport",
            },
            { name: "Settings", icon: "settings", route: "users/settings" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className="flex-row items-center bg-white p-4 rounded-lg transition-all"
            >
              <LinearGradient
                colors={["#6C63FF", "#5A48D1"]}
                className="p-3 rounded-lg mr-4"
              >
                <Ionicons name={item.icon} size={24} color="white" />
              </LinearGradient>
              <Text className="text-lg text-gray-800 font-medium">
                {item.name}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#cbd5e1"
                className="ml-auto"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => router.push("../location")}
            className="flex-row items-center bg-white p-4 rounded-lg transition-all"
          >
            <LinearGradient
              colors={["#6C63FF", "#5A48D1"]}
              className="p-3 rounded-lg mr-4"
            >
              <Ionicons name="map" size={24} color="white" />
            </LinearGradient>
            <Text className="text-lg text-gray-800 font-medium">Location</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#cbd5e1"
              className="ml-auto"
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Sign Out Button */}
        <View className="mt-8 mb-12 items-center">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center border border-red-100 p-4 rounded-xl w-full justify-center bg-red-50 active:bg-red-100 transition-colors"
          >
            <Ionicons name="log-out" size={20} color="#dc2626" />
            <Text className="text-red-600 font-medium ml-2">Log Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PersonalPage;
