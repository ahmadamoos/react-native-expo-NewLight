import React from "react";
import { TouchableOpacity, Text, Linking, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const WhatsAppButton = () => {
  const phoneNumber = "+0972598846632"; // Replace with the desired phone number
  const message = "Hello, I need assistance with my order."; // Optional pre-filled message

  const openWhatsApp = () => {
    // Create the WhatsApp link
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open the link
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "WhatsApp is not installed on your device.");
        }
      })
      .catch((err) => {
        console.error("An error occurred:", err);
        Alert.alert("Error", "Unable to open WhatsApp.");
      });
  };

  return (
    <TouchableOpacity
      onPress={openWhatsApp}
      className="flex-row items-center bg-green-500 p-3 rounded-lg"
    >
      <Icon name="logo-whatsapp" size={24} color="white" />
      <Text className="text-white font-semibold ml-2">Chat on WhatsApp</Text>
    </TouchableOpacity>
  );
};

export default WhatsAppButton;
