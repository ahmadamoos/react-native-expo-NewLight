import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const ProductsCard = ({ data = {}, handleAddToCart }) => {
  const imagedatta = (data) => {
    return (
      data.images?.[0]?.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/newlightnew-82e5f.firebasestorage.app/o/mySQL-images%2F%D8%AB%D8%B1%D9%8A%D9%87%20%D9%83%D9%84%D8%A7%D8%B3%D9%83%20%D9%83-2-0.jpg?alt=media&token=c19eaeec-ed4b-44c3-bf48-6c6d9671def5"
    );
  };

  const productName = data.name || data.product_name || "Unnamed Product";
  const productDescription =
    data.description || data.product_description || "No description available";
  const productPrice =
    data.price || data.product_price || data.variants?.[0]?.price || "N/A";
  const producttag = data.tags?.[0]?.tags_name || data.tags_name || "N/A";
  return (
    <View className="mb-2">
      <View className="bg-[#ffffff]  rounded-lg shadow-md mb-2 mx-4 flex-row items-center h-52">
        <View className="relative w-40 h-52 mr-4">
          <Image
            source={{ uri: imagedatta(data) }}
            className="w-full h-full rounded-l-lg"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="border-l-4 border-[#7367da] pl-4">
            <Text className="text-lg text-[#000000] font-semibold mb-1">
              {productName}
            </Text>
            <Text className="text-sm text-[#000000] mb-1 line-clamp-2">
              {productDescription}
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-lg text-[#00f735] font-semibold">
                ₪{productPrice}
              </Text>
              <Text className="text-sm mr-3 text-[#000000] font-semibold">
                Prime
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                handleAddToCart(data.product_id || data.id, producttag)
              } // Handles null gracefully
              className="bg-[#5d4ee0] py-2 mr-2 px-4 rounded-lg mt-4"
            >
              <Text className="text-white text-center">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductsCard;
