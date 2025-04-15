import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { images } from "@/constants";

const screenWidth = Dimensions.get("window").width;
const cardSize = screenWidth / 2 - 24; // Adjust card size based on screen width

const SquareProductsCard = ({ data, handleAddToCart }) => {
  const imagedatta = (data) => {
    return (
      data.images?.[0]?.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/newlightnew-82e5f.firebasestorage.app/o/mySQL-images%2F%D8%AB%D8%B1%D9%8A%D9%87%20%D9%83%D9%84%D8%A7%D8%B3%D9%83%20%D9%83-2-0.jpg?alt=media&token=c19eaeec-ed4b-44c3-bf48-6c6d9671def5"
    );
  };
  const tagedata = data.tags?.[0]?.tag_name || "LID";
  return (
    <View
      key={data.product_id || data.id}
      className="bg-[#1f2633] rounded-lg shadow-lg mb-4 mx-1"
      style={{ width: cardSize, height: cardSize + 100 }} // Width is half the screen size, height adjusted accordingly
    >
      <Image
        source={{ uri: imagedatta(data) }}
        className="w-full h-2/3 rounded-t-lg"
        resizeMode="cover"
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        defaultSource={{ uri: "https://via.placeholder.com/150" }} // Default placeholder
      />

      <View className="p-2">
        <Text className="text-base text-white font-semibold mb-1">
          {data.product_name}
        </Text>
        <Text className="text-xs text-gray-400 mb-2 line-clamp-2">
          {data.product_description}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-[#4caf50] font-semibold">
            ₪{data.variants[0].price}
          </Text>
          <TouchableOpacity
            onPress={() =>
              handleAddToCart(data.product_id || data.id, tagedata)
            }
            className="bg-[#5d4ee0] py-1 px-3 rounded-lg"
          >
            <Text className="text-white text-xs">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SquareProductsCard;
