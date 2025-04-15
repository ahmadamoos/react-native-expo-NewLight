import { View, Text, FlatList, Image } from 'react-native';
import React from 'react';

const Trending = ({ Products }) => {
  return (
    <FlatList
      data={Products ?? [{ id: '1', name: 'Welcome', price: '$99.99', image: 'https://via.placeholder.com/150', description: 'This is a great product that you will love.', rating: '4.5' }]}
      renderItem={({ item }) => (
        <View className="bg-[#2f3a4d] rounded-lg shadow-lg w-36 mr-4 overflow-hidden mb-2">
          <Image source={{ uri: item.Imagee }} className="w-full h-24 object-cover" />
          <View className="p-2">
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </Text>
            <Text className="text-base font-bold text-[#5d4ee0] mt-1">{item.price}</Text>
            <Text className="text-xs text-gray-500 mt-1">⭐ {item.rating}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default Trending;
