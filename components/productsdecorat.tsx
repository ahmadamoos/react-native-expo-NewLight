import { View, Text, FlatList, RefreshControl, Image } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';

const ProductsCarddecor = ({ data: { id, title, inStouck, price, Census, description, Imagee , trending } }) => {
    if (Census === 0) {
        inStouck = false;
    }
  
  return (
    <View className="">
      <View className="bg-[#1f2633] rounded-lg shadow-lg mb-6 mx-4 flex-row items-center p-4" >
    
    
    <View className="relative w-40 h-40 mr-4">
        <Image
            source={{ uri: Imagee }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black opacity-10 rounded-lg" /> 
    </View>
    
   
    <View className="flex-1">
        <View className="border-l-4 border-[#5445db] pl-4">
            <Text className="text-lg text-white font-semibold mb-1">{title}</Text>
            <Text className="text-sm text-gray-400 mb-1 line-clamp-2">{description}</Text>
            <View className="flex-row items-center justify-between mt-2">
                <Text className="text-lg text-[#4caf50] font-semibold">${price}</Text>
                <Text className="text-sm text-gray-500 font-semibold">Prime</Text>
            </View>
        </View>
    </View>

      </View>

    </View>
    );
};

export default ProductsCarddecor;