import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { searchItemsByTags } from "@/store/Actions/searchByQuery";
import icons from "../../constants/icons";

const SearchBarrT = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a search query."); // Validation message
      return;
    }
    const tagsArray = query.split(" ").filter((tag) => tag.trim()); // Clean split
    dispatch(searchItemsByTags(tagsArray)); // Dispatch action to Redux
    console.log(tagsArray);
    console.log(query);
  };

  return (
    <View className="w-full h-14 justify-center items-center px-4 flex-row">
      <View className="w-full h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row">
        {/* TextInput for search query */}
        <TextInput
          className="text-base flex-1 text-white font-psemibold space-x-1"
          value={query}
          onChangeText={(text) => setQuery(text)}
          placeholder="Search..."
          placeholderTextColor="#ccc"
        />
        
        {/* Touchable for executing search */}
        <TouchableOpacity onPress={handleSearch}>
          <Image source={icons.search} className="w-5 h-5" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBarrT;
