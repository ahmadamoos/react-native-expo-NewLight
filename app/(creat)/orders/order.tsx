import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { resetOrderr } from "@/store/Actions/getOrderbyid";
import Icon from "react-native-vector-icons/Ionicons";
import root from "@/lib/apihttp";
import axios from "axios";

const Order = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.orderid);

  const handleGoBack = async () => {
    router.back();
    await dispatch(resetOrderr());
  };

  const updateOrderStatus = async (order_id, new_status) => {
    try {
      console.log("Updating order status:", order_id, new_status);
      // Show confirmation dialog
      Alert.alert(
        "Confirm Changes",
        "Are you sure you want to save the changes?",
        [
          {
            text: "Cancel",
            style: "cancel", // Cancel button
          },
          {
            text: "Confirm",
            onPress: async () => {
              // User confirmed, proceed with the API request
              try {
                const response = await axios.put(
                  `http://${root}:3000/update-order-status`,
                  {
                    order_id,
                    new_status,
                  }
                );

                console.log(response.data); // Log the response data

                // Optionally, show a success message to the user
                Alert.alert("Success", "Order status updated successfully!");
              } catch (error) {
                console.error("Error updating order status:", error);

                // Handle specific error responses
                if (error.response) {
                  console.error(
                    "Server responded with an error:",
                    error.response.data
                  );
                  Alert.alert(
                    "Error",
                    error.response.data.error || "Failed to update order status"
                  );
                } else if (error.request) {
                  console.error("No response received:", error.request);
                  Alert.alert("Error", "No response received from the server");
                } else {
                  console.error("Error setting up the request:", error.message);
                  Alert.alert("Error", "Failed to set up the request");
                }
              }
            },
          },
        ],
        { cancelable: true } // Allow dismissing the dialog by tapping outside
      );
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
    }
  };

  // Redirect if data is empty
  useEffect(() => {
    if (!data || data.length === 0) {
      router.push("/(creat)/orders");
    }
  }, [data]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-semibold">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
          <Icon name="chevron-back-circle-outline" size={32} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-red-500">{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-semibold">No order data found.</Text>
      </View>
    );
  }

  const {
    order_id,
    username,
    payment_method,
    street,
    building_num,
    floor_num,
    city,
    country,
    village,
    description_for_delivery,
    cart_info = [], // Default to an empty array if cart_info is undefined
    price: deliveryPrice,
    phone_number,
  } = data;

  // Calculate total price
  const totalCartPrice = cart_info.reduce(
    (total, item) => total + parseFloat(item.total_price || 0),
    0
  );
  const totalPrice = totalCartPrice + parseFloat(deliveryPrice || 0);

  // Determine the order status
  const orderStatus = cart_info[0]?.done || "unknown";

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Back Button */}
      <TouchableOpacity className="pr-1 mb-4" onPress={() => handleGoBack()}>
        <Icon name="chevron-back-circle-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Order Summary */}
      <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Order #{order_id}
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Username:</Text> {username}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Payment Method:</Text>{" "}
            {payment_method}
          </Text>
        </View>
      </View>

      {/* Delivery Address */}
      <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Delivery Address
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Street:</Text> {street}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Building:</Text> {building_num}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Floor:</Text> {floor_num}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">City:</Text> {city}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Country:</Text> {country}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Village:</Text> {village}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Delivery Instructions:</Text>{" "}
            {description_for_delivery || "None"}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">phone number:</Text>{" "}
            {phone_number || "None"}
          </Text>
        </View>
      </View>

      {/* Cart Items */}
      <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">Cart Items</Text>
        {cart_info.length > 0 ? (
          cart_info.map((item, index) => (
            <View
              key={item.cart_items_id}
              className={`border-t border-gray-200 pt-4 ${
                index === 0 ? "border-t-0" : ""
              }`}
            >
              <View className="flex-row">
                <Image
                  source={{ uri: item.cart_image }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {item.product_name}
                  </Text>
                  <View className="space-y-1">
                    <Text className="text-gray-600">
                      <Text className="font-semibold">Color:</Text> {item.color}
                    </Text>
                    <Text className="text-gray-600">
                      <Text className="font-semibold">Size:</Text> {item.size}
                    </Text>
                    <Text className="text-gray-600">
                      <Text className="font-semibold">Quantity:</Text>{" "}
                      {item.quantity}
                    </Text>
                    <Text className="text-gray-600">
                      <Text className="font-semibold">Price:</Text> $
                      {item.product_price}
                    </Text>
                    <Text className="text-gray-600">
                      <Text className="font-semibold">Total:</Text> $
                      {item.total_price}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 text-center">No items in cart</Text>
        )}
      </View>

      {/* Total Price */}
      <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Order Summary
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Cart Total:</Text> $
            {totalCartPrice.toFixed(2)}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Delivery Fee:</Text> $
            {deliveryPrice}
          </Text>
          <Text className="text-lg font-bold text-gray-900">
            <Text className="font-semibold">Total Price:</Text> $
            {totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Order Status */}
      {orderStatus === "in_progress" && (
        <View className="bg-yellow-300 p-6 rounded-xl shadow-lg mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Order is in progress
          </Text>
        </View>
      )}
      {orderStatus === "done" && (
        <View className="bg-green-300 p-6 rounded-xl shadow-lg mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Order is completed
          </Text>
        </View>
      )}
      {orderStatus === "canceled" && (
        <View className="bg-red-300 p-6 rounded-xl shadow-lg mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Order is canceled
          </Text>
        </View>
      )}

      {/* Buttons for Updating Order Status */}
      {orderStatus === "in_progress" && (
        <>
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-xl mb-3 items-center mt-1"
            onPress={() => updateOrderStatus(order_id, "done")}
          >
            <Text className="text-white text-lg font-semibold">
              Confirm Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-xl mb-8 items-center"
            onPress={() => updateOrderStatus(order_id, "canceled")}
          >
            <Text className="text-white text-lg font-semibold">
              Cancel Order
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default Order;
