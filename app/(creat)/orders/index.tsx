import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getdata, resetOrders } from "@/store/Actions/getOrders";
import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
import { getOrderbyid, resetOrderr } from "@/store/Actions/getOrderbyid";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { getallorders } from "@/store/Actions/getallorders";

const Orders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});

  const { page, orders, loading, hasMore } = useSelector(
    (state) => state.getoreders
  );
  const handlealldata = async () => {
    await dispatch(getallorders(1));
    router.push({
      pathname: "/(creat)/orders/historyorders",
    });
  };
  // Filter out duplicate orders based on order_id
  const uniqueOrders = orders.filter(
    (order, index, self) =>
      index === self.findIndex((o) => o.order_id === order.order_id)
  );

  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    console.log("Orders:", orders);
  }, [orders]);

  const handleorderbyid = async (id) => {
    await dispatch(getOrderbyid(id)).thin(
      router.push({
        pathname: "/orders/order",
      })
    );
  };

  const fetchOrders = async () => {
    setIsFetching(true);
    await dispatch(getdata(1));
    setIsFetching(false);
  };

  const handleEndReached = async () => {
    if (!loading && hasMore && !isFetching) {
      dispatch(getdata(page));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(resetOrders());
    await dispatch(getdata(1));
    setRefreshing(false);
  };

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

  const calculateTotalPrice = (cartInfo) => {
    if (!cartInfo || !Array.isArray(cartInfo)) {
      return 0;
    }
    return cartInfo.reduce((total, product) => {
      return total + product.quantity * product.product_price;
    }, 0);
  };

  const renderOrder = useCallback(
    ({ item }) => {
      const isExpanded = !!expandedOrders[item.order_id];
      const totalPrice = calculateTotalPrice(item.cart_info);

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
                    }`} // Fallback keys
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
    <View className="flex-1  bg-gray-100 p-4">
      <View className="flex-row items-center  justify-around mb-4">
        <Text className="text-2xl  w-1/3 font-bold text-gray-900 ">Orders</Text>
        <TouchableOpacity onPress={handlealldata}>
          <View className="flex-row items-center p-2 border bg-blue-500 border-gray-300 rounded-lg justify-center">
            <Text className="font-semibold text-lg text-white ">
              all orders
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {loading && orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={uniqueOrders} // Use filtered data
          keyExtractor={(item) => `${item.order_id || "unknown"}`} // Fallback key
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

export default Orders;
