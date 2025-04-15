import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useCart } from "@/context/CartGlobalProvider"; // Use the new CartProvider
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cart = () => {
  const router = useRouter();
  const { localCart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn, user } = useGlobalContext();

  const handleCheckout = async () => {
    console.log("localCart", localCart);
    router.push("/(tabs)/cart/chickOut");
  };

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row justify-between items-center p-4 bg-white mb-2 rounded-lg shadow-sm">
        {/* Product Info */}
        <View className="flex-row flex-1">
          <Image
            source={{ uri: item.cart_image || "fallback-image-url" }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="contain"
          />

          <View className="flex-1">
            <Text className="text-lg font-semibold mb-1">
              {item.product_name}
            </Text>
            <Text className="text-gray-600 text-sm">Color: {item.color}</Text>
            <Text className="text-gray-600 text-sm">Size: {item.size}</Text>
            <Text className="text-lg font-bold mt-2">
              ${(item.product_price * item.chosenQuantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Quantity Controls */}
        <View className="items-end">
          <View className="flex-row items-center bg-gray-100 rounded-full p-1">
            <TouchableOpacity
              className="px-3 py-1 bg-white rounded-full shadow"
              onPress={() =>
                updateQuantity(item.variant_id, item.chosenQuantity - 1)
              }
              disabled={item.chosenQuantity <= 1}
            >
              <Text className="text-lg">-</Text>
            </TouchableOpacity>

            <TextInput
              className="w-12 text-center mx-2"
              value={String(item.chosenQuantity)}
              keyboardType="numeric"
              onChangeText={(text) => {
                const qty = Math.min(
                  item.quantity,
                  Math.max(1, parseInt(text) || 1)
                );
                updateQuantity(item.variant_id, qty);
              }}
            />

            <TouchableOpacity
              className="px-3 py-1 bg-white rounded-full shadow"
              onPress={() =>
                updateQuantity(item.variant_id, item.chosenQuantity + 1)
              }
              disabled={item.chosenQuantity >= item.quantity}
            >
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-2 p-2"
            onPress={() => removeFromCart(item.variant_id)}
          >
            <Text className="text-red-500">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-500">Loading cart...</Text>
      </View>
    );
  }

  if (!isLoggedIn || (user && user.isAnonymous)) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-2xl font-semibold">Sign Up to Continue</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-up")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          <Text className="text-lg">Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      {localCart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-500">Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={localCart}
            renderItem={renderItem}
            keyExtractor={(item) => `cart-item-${item.id}-${item.variant_id}`}
            contentContainerStyle={{ padding: 16 }}
          />

          <View className="p-4 bg-white border-t border-gray-200">
            <View className="flex-row justify-between mb-4">
              <Text className="text-xl font-bold">Total:</Text>
              <Text className="text-xl font-bold">
                $
                {localCart
                  .reduce(
                    (sum, item) =>
                      sum + item.product_price * item.chosenQuantity,
                    0
                  )
                  .toFixed(2)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-full items-center"
              onPress={handleCheckout}
            >
              <Text className="text-white text-lg font-semibold">
                Checkout Now
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default Cart;
