import { View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
import React from "react";
import icons from "../../constants/icons";
import {  usePathname ,useRouter  } from "expo-router";
import { useState } from "react";

const SearchBarr = ( {hndelGO}: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("")
  return (
    <View className="w-full h-14  justify-center items-center px-4 flex-row">
      <View className="w-full h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row">
        <TextInput
          onPress={hndelGO}
          className="text-base flex-1 text-white font-psemibold space-x-1"
          value={query}
          onChangeText={(e) => setQuery(e)}
          placeholder={"Search..."}
          
        />
        <TouchableOpacity
         onPress={hndelGO}
            
        >
          <Image source={icons.search} className="w-5 h-5" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBarr;
