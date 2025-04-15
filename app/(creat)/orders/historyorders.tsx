import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { getOrderbyid } from "@/store/Actions/getOrderbyid";
import { getallorders, resetgetallorders } from "@/store/Actions/getallorders";
import { searchOrder } from "@/store/Actions/searchOrderA";
import { icons } from "@/constants";

const Historyorders = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [expandedOrders, setExpandedOrders] = useState({});
  const [query, setQuery] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [localdata, setlocaldata] = useState();
  const {
    data = [],
    loading,
    error,
    page,
    hasMore,
  } = useSelector((state) => state.allOrders);
  const { dataa, loadingg, errorr } = useSelector((state) => state.searchOrder);
  const handlesearch = async () => {
    await dispatch(searchOrder(query));
  };
  const handleGoBack = () => {
    router.back();
  };

  const calculateTotalPrice = (cartInfo) => {
    if (!cartInfo || !Array.isArray(cartInfo)) {
      return 0;
    }
    return cartInfo.reduce((total, product) => {
      return total + product.quantity * product.product_price;
    }, 0);
  };
  useEffect(() => {
    if (dataa.length > 0) {
      setlocaldata(dataa);
      dispatch(resetgetallorders());
    } else {
      setlocaldata(data);
    }
  }, [dataa]);

  const toggleOrder = useCallback((orderId) => {
    setExpandedOrders((prev) => {
      const newExpandedOrders = { ...prev };
      if (newExpandedOrders[orderId]) {
        delete newExpandedOrders[orderId];
      } else {
        newExpandedOrders[orderId] = true;
      }
      return newExpandedOrders;
    });
  }, []);

  const handleorderbyid = async (id) => {
    await dispatch(getOrderbyid(id)).then(() => {
      router.push({
        pathname: "/orders/order",
      });
    });
  };

  const handleEndReached = async () => {
    if (loading) {
      return;
    }
    if (!hasMore) {
      return;
    }
    if (data.length === 0) {
      return;
    }
    await dispatch(getallorders(page));
  };

  const uniqueOrders = (localdata || []).filter(
    (order, index, self) =>
      index === self.findIndex((o) => o.order_id === order.order_id)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(resetgetallorders());
    await dispatch(getallorders(1));
    setRefreshing(false);
  };

  const renderOrder = useCallback(
    ({ item }) => {
      const isExpanded = !!expandedOrders[item.order_id];
      const totalPrice = calculateTotalPrice(item.cart_info);
      const orderStatus = item.cart_info?.[0]?.done || "unknown"; // Moved inside renderOrder

      return (
        <View className="bg-white p-4 my-2 rounded-2xl shadow-lg">
          <TouchableOpacity
            onPress={() => toggleOrder(item.order_id)}
            className="flex-row justify-between items-center"
          >
            <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
              {item.username}'s Order #{item.order_id} Time{" "}
              {item.cart_info?.[0]?.created_at || "N/A"}
            </Text>
            <Icon
              name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
              size={24}
              color="#4F46E5"
            />
          </TouchableOpacity>

          {isExpanded && (
            <>
              {item.cart_info?.map((product) => {
                return (
                  <View
                    key={`${item.order_id || "unknown"}-${
                      product.cart_items_id || "unknown"
                    }`}
                    className="border-t border-gray-200 mt-2 pt-2"
                  >
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: product.cart_image }}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="cover"
                      />
                      <View className="ml-3 flex-1">
                        <Text className="text-base font-medium text-gray-900">
                          {product.product_name}
                        </Text>
                        <Text className="text-gray-600">
                          Color: {product.color} | Size: {product.size}
                        </Text>
                        <Text className="text-gray-800 font-semibold">
                          Qty: {product.quantity} | ${product.product_price}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Order Status Display */}
              {orderStatus === "in_progress" && (
                <View className="bg-yellow-300 p-6 rounded-xl shadow-lg my-3">
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    Order is in progress
                  </Text>
                </View>
              )}
              {orderStatus === "done" && (
                <View className="bg-green-300 p-6 rounded-xl shadow-lg my-3">
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    Order is completed
                  </Text>
                </View>
              )}
              {orderStatus === "canceled" && (
                <View className="bg-red-300 p-6 rounded-xl shadow-lg my-3">
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    Order is canceled
                  </Text>
                </View>
              )}

              <View className="border-t border-gray-200 mt-2 pt-2">
                <Text className="text-lg font-semibold text-gray-800">
                  Total Price: ${totalPrice.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleorderbyid(item.order_id)}
                className="mt-4 bg-blue-500 py-2 px-4 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">View Details</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    },
    [expandedOrders]
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-col items-center mb-4">
        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-4">Orders</Text>

        {/* Search Bar */}
        <View className="w-full h-14 justify-center items-center px-4">
          <View className="w-full h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row shadow-lg">
            <TextInput
              className="text-base flex-1 text-white font-psemibold"
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor="#ccc"
              onSubmitEditing={handlesearch}
              returnKeyType="search"
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={handlesearch}>
              <Image source={icons.search} className="w-5 h-5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Back Button (Top Left) */}
        <TouchableOpacity
          className="absolute left-0 top-0 p-2"
          onPress={() => handleGoBack()}
        >
          <Icon name="chevron-back-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View className="w-full h-px bg-gray-300 mb-4" />

      {/* Content */}
      {loading && data.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={uniqueOrders}
          keyExtractor={(item) => `${item.order_id || "unknown"}`}
          renderItem={renderOrder}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading && <ActivityIndicator size="small" color="#4F46E5" />
          }
        />
      )}
    </View>
  );
};

export default Historyorders;
