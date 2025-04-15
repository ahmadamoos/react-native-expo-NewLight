import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "@/lib/firebase";
import { getlocationbyid } from "@/store/Actions/getlocationbyid";
import icons from "../../../constants/icons";
import { useCart } from "@/context/CartGlobalProvider"; // Import the useCart hook
import axios from "axios";
import root from "@/lib/apihttp";
import { Picker } from "@react-native-picker/picker";
import { useGlobalContext } from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Checkout = () => {
  const { isLoggedIn, user, setIsLoggedIn, isLoading } = useGlobalContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: reduxLocation, loading } = useSelector(
    (state) => state.locationbyid
  );
  const { localCart, isLoading: cartLoading, clearCart } = useCart(); // Use the global cart state
  const [chosenlocation, setChosenLocation] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [phonePrefix, setPhonePrefix] = useState("00970");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userdata, setuserdata] = useState(null);

  const pickup = "pickup";
  const delivery = "delivery";
  const cash = "cash";
  const card = "card";
  useEffect(() => {
    getuserdata();
  }, []);

  const getuserdata = async () => {
    try {
      const user = auth.currentUser?.uid;
      console.log("user data", auth.currentUser?.uid);
      const respons = await axios.get(`http://${root}:3000/user-info`, {
        params: {
          uid: user,
        },
      });
      setuserdata(respons.data.data);
      if (respons.data.data.phone_number) {
        setPhoneNumber(respons.data.data.phone_number);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
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

  useEffect(() => {
    fetchLocations();
  }, [dispatch]);

  useEffect(() => {
    console.log("chickout ", localCart);
    if (reduxLocation && reduxLocation.length > 0) {
      setChosenLocation(reduxLocation[0]);
      setShippingCost(reduxLocation[0].price); // Set initial shipping cost
    }
  }, [reduxLocation]);

  useEffect(() => {
    calculateTotalPrice();
  }, [localCart, deliveryMethod, shippingCost]);

  const calculateTotalPrice = () => {
    let subtotal = localCart.reduce(
      (sum, item) => sum + item.product_total_price,
      0
    );
    let total = subtotal;

    if (deliveryMethod === delivery && chosenlocation) {
      total += shippingCost; // Add shipping cost for delivery
    }

    setTotalPrice(total);
  };

  const handlePayToggle = (method) => {
    setPayMethod(method);
  };

  const handleToggle = (method) => {
    setDeliveryMethod(method);
    if (method === pickup) {
      setShippingCost(0); // No shipping cost for pickup
      setPayMethod(null); // Set default payment method to cash for pickup
    } else if (chosenlocation) {
      setShippingCost(chosenlocation.price); // Reset shipping cost for delivery
    }
  };

  const fetchLocations = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      dispatch(getlocationbyid(userId));
    }
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  const handleSelectLocation = (location) => {
    setChosenLocation(location);
    setShippingCost(location.price); // Update shipping cost
    setShowLocationDropdown(false);
  };

  const handlePlaceOrder = async () => {
    const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;
    const orderData = {
      cart_id: localCart[0]?.cart_id, // Use the cart_id from localCart
      items: localCart.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.chosenQuantity,
        product_price: item.product_price,
        product_name: item.product_name,
        cart_image: item.cart_image,
        color: item.color,
        size: item.size,
      })),
      payment_method: deliveryMethod === pickup ? "cash" : payMethod, // Include payment method
      location_id: deliveryMethod === pickup ? "5" : chosenlocation.id, // Include location ID
      phone_number: userdata?.phone_number
        ? userdata?.phone_number
        : fullPhoneNumber,
    };

    console.log("Sending order data:", orderData); // Log the data being sent

    try {
      const response = await axios.post(
        `http://${root}:3000/add-to-cart`,
        orderData
      );
      console.log("Backend response:", response.data); // Log the backend response

      if (response.data.success) {
        // Checkout was successful
        await AsyncStorage.removeItem("localCart"); // Clear the local cart
        clearCart();
        Alert.alert("Success", "Order placed successfully!");
        router.push("/(tabs)/userOrder"); // Navigate back after placing the order
      } else if (response.data.out_of_stock_items) {
        // Some items are out of stock, handle gracefully
        Alert.alert(
          "Out of Stock",
          `Some items are out of stock: ${response.data.out_of_stock_items
            .map((item) => item.product_name)
            .join(", ")}`
        );
      } else {
        // Handle any other error message from the backend
        Alert.alert("Error", response.data.error || "Failed to add items.");
      }
    } catch (error) {
      if (error.response) {
        console.log("Server Error:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data?.error || "Something went wrong."
        );
      } else if (error.request) {
        console.log("Network Error:", error.request);
        Alert.alert("Error", "Network issue. Please try again.");
      } else {
        console.log("Error:", error.message);
        Alert.alert("Error", "Failed to process checkout.");
      }
    }
  };

  const RenderItem = ({ item }) => {
    if (!item) {
      return null;
    }

    return (
      <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-gray-800">
            {item.city}, {item.country}
          </Text>
          <TouchableOpacity onPress={toggleLocationDropdown}>
            <Icon name="ellipsis-vertical-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

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
  };

  const RenderItemChosen = ({ item }) => {
    if (!item) {
      return null;
    }

    return (
      <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-gray-800">
            {item.city}, {item.country}
          </Text>
        </View>
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
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-purple-50 to-white">
      {/* Header Section */}
      <View className="bg-[#4b41d6] rounded-b-[60px] shadow-lg pb-24 pt-16 px-6">
        <Text className="text-4xl font-bold text-white text-center">
          Checkout
        </Text>
      </View>

      {/* Checkout Form Section */}
      <View className="bg-white rounded-2xl shadow-lg mx-6 p-6 -mt-20 z-10">
        {/* Delivery Method Section */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Delivery Method
          </Text>
          <View className="flex-row justify-around mb-3">
            <TouchableOpacity
              className={`items-center w-1/3 rounded-md p-3 ${
                deliveryMethod === delivery ? "bg-[#635ae9]" : "bg-gray-200"
              }`}
              onPress={() => handleToggle(delivery)}
            >
              <Icon name="car-outline" size={40} color="black" />
              <Text>Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`items-center w-1/3 rounded-md p-3 ${
                deliveryMethod === pickup ? "bg-[#635ae9]" : "bg-gray-200"
              }`}
              onPress={() => handleToggle(pickup)}
            >
              <Image
                source={icons.pickup}
                style={{ width: 40, height: 40, marginTop: 8 }}
              />
              <Text>Pickup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Address Section */}
        {deliveryMethod === delivery && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Shipping Address
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4b41d6" />
            ) : chosenlocation ? (
              <View>
                <RenderItem item={chosenlocation} />

                {/* Location Dropdown */}
                {showLocationDropdown && (
                  <View className="absolute top-0 left-0 right-0 bg-white rounded-lg shadow-lg z-20 p-4">
                    <ScrollView>
                      {reduxLocation.map((location) => (
                        <TouchableOpacity
                          key={location.id}
                          className="p-3 border-b border-gray-200"
                          onPress={() => handleSelectLocation(location)}
                        >
                          <RenderItemChosen item={location} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ) : (
              <Text className="text-gray-500">No address found.</Text>
            )}
          </View>
        )}
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

        {/* Payment Method Section */}
        {deliveryMethod === delivery && (
          <View className="mb-6 flex flex-row w-[99%] h-24 justify-around">
            <TouchableOpacity
              className={`items-center w-1/3 rounded-md p-3 ${
                payMethod === card ? "bg-[#635ae9]" : "bg-gray-200"
              }`}
              onPress={() => handlePayToggle(card)}
            >
              <Icon name="card-outline" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className={`items-center w-1/3 rounded-md p-3 ${
                payMethod === cash ? "bg-[#635ae9]" : "bg-gray-200"
              }`}
              onPress={() => handlePayToggle(cash)}
            >
              <Icon name="cash-outline" size={32} color="black" />
            </TouchableOpacity>
          </View>
        )}
        {payMethod === card && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Payment Details
            </Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
              placeholder="Card Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <View className="flex-row justify-between">
              <TextInput
                className="bg-gray-100 rounded-lg p-4 w-[48%] text-gray-800"
                placeholder="Expiry Date"
                placeholderTextColor="#999"
              />
              <TextInput
                className="bg-gray-100 rounded-lg p-4 w-[48%] text-gray-800"
                placeholder="CVV"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Order Summary Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-700">Subtotal</Text>
            <Text className="text-gray-700">
              $
              {localCart
                .reduce((sum, item) => sum + item.product_total_price, 0)
                .toFixed(2)}
            </Text>
          </View>
          {deliveryMethod === delivery && (
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-700">Shipping</Text>
              <Text className="text-gray-700">${shippingCost.toFixed(2)}</Text>
            </View>
          )}
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-700 font-semibold">Total</Text>
            <Text className="text-gray-700 font-semibold">
              ${totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className="bg-[#4b41d6] rounded-lg p-4 items-center mt-4"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white text-lg font-semibold">Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Checkout;
