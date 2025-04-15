import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getuserorders, resetuserorders } from "@/store/Actions/userOrders";
import { auth } from "@/lib/firebase";

const UserOrder = () => {
  const user = auth.currentUser?.uid;
  const dispatch = useDispatch();
  const { data, loading, error, page, hasMore } = useSelector(
    (state) => state.userorder
  );
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order

  useEffect(() => {
    dispatch(getuserorders(user, 1)); // Fetch first page on mount
  }, [dispatch]);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      dispatch(getuserorders(user, page + 1)); // Fetch next page
    }
  };

  const onRefresh = () => {
    dispatch(resetuserorders()); // Reset orders
    dispatch(getuserorders(user, 1)); // Fetch first page again
  };

  const renderOrderItem = ({ item }) => {
    const isExpanded = expandedOrderId === item.order_id;

    return (
      <View className="bg-white rounded-lg mb-2.5 p-4 shadow-sm">
        <TouchableOpacity
          className="flex-row justify-between items-center"
          onPress={() => setExpandedOrderId(isExpanded ? null : item.order_id)}
        >
          <Text className="text-lg font-bold text-black">
            Order ID: {item.order_id}
          </Text>
          <Text
            className={`text-base font-bold ${
              item.cart_info[0].done === "in_progress"
                ? "text-yellow-500"
                : item.cart_info[0].done === "done"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {item.cart_info[0].done}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View className="mt-2.5">
            {/* Address Details */}
            <Text className="text-sm text-gray-600 mb-1">
              Street: {item.street}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Building: {item.building_num}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Floor: {item.floor_num}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Apartment: {item.partmint_num}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Delivery Instructions: {item.description_for_delivery}
            </Text>

            {/* Location Details */}
            <Text className="text-sm text-gray-600 mb-1">
              Country: {item.country}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              City: {item.city}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Village: {item.village}
            </Text>

            {/* Contact Details */}
            <Text className="text-sm text-gray-600 mb-1">
              Phone: {item.phone_number}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              Total Price: ${item.price}
            </Text>

            {/* Product Details */}
            {item.cart_info.map((product, index) => (
              <View
                key={index}
                className="mt-2.5 border-t border-gray-300 pt-2.5"
              >
                <Image
                  source={{ uri: product.cart_image }}
                  className="w-12 h-12 rounded mb-1"
                />
                <Text className="text-sm text-gray-600">
                  Product: {product.product_name}
                </Text>
                <Text className="text-sm text-gray-600">
                  Color: {product.color}
                </Text>
                <Text className="text-sm text-gray-600">
                  Size: {product.size}
                </Text>
                <Text className="text-sm text-gray-600">
                  Quantity: {product.quantity}
                </Text>
                <Text className="text-sm text-gray-600">
                  Price: ${product.product_price}
                </Text>
                <Text className="text-sm text-gray-600">
                  Total: ${product.total_price}
                </Text>
              </View>
            ))}
            <View className="mt-2.5 border-t border-gray-300 pt-2.5">
              <Text className="text-sm text-gray-600 mt-2.5">
                Payment Method: {item.payment_method}
              </Text>
              {(() => {
                const fullPrice = item.cart_info.reduce((total, product) => {
                  return total + (parseFloat(product.total_price) || 0); // Ensure total_price is a number
                }, 0);

                return (
                  <View>
                    <Text className="text-sm text-gray-600">
                      Total to Pay: ${fullPrice.toFixed(2)}{" "}
                      {/* Display the full price */}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Delivery price : {item.price}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Full price:{" "}
                      {parseFloat(item.price) + parseFloat(fullPrice)}
                    </Text>
                  </View>
                );
              })()}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-2.5">
      <FlatList
        data={data}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default UserOrder;
