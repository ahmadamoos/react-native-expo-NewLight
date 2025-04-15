import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, resetUsers } from "@/store/Actions/usersdata";
import icons from "../../constants/icons";
import { getUserDataa, resetUserss } from "@/store/Actions/usersdatasearch";

const AddCreators = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false); // Track search mode
  const [isFetching, setIsFetching] = useState(false); // Prevent duplicate fetches

  const { data, pagee, hasMoree } = useSelector((state) => state.usersdata);
  const { dataa, page, hasMore } = useSelector(
    (state) => state.usersdatasearch
  );

  // Fetch initial data
  useEffect(() => {
    dispatch(getUserData(1));

    console.log("Initial data fetched:", data);
  }, []);
  const isEndReachedCalledDuringMomentum = useRef(false);

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      console.log("this is search term", searchTerm);
      setIsSearchMode(true);
      dispatch(resetUserss()); // Clear dataa before fetching new results
      dispatch(getUserDataa(searchTerm, 1)); // Fetch new search results
    } else {
      setIsSearchMode(false);
      dispatch(resetUsers()); // Reset search results
    }
  }, [searchTerm]);

  // Handle end of list reached
  const handleEndReached = async () => {
    if (isFetching || isLoading) return; // Prevent multiple calls

    if (isSearchMode) {
      if (hasMore) {
        setIsFetching(true);
        await dispatch(getUserDataa(searchTerm, page)); // Append more search results
        setIsFetching(false);
      }
    } else {
      if (hasMoree) {
        setIsFetching(true);
        await dispatch(getUserData(pagee)); // Append more normal data
        setIsFetching(false);
      }
    }
  };

  // Handle search button press
  const handleSearch = async () => {
    if (searchTerm.length > 0) {
      setIsLoading(true);
      dispatch(resetUserss()); // Clear dataa before fetching new results
      await dispatch(getUserDataa(searchTerm, 1)); // Fetch new search results
      setIsLoading(false);
    }
  };

  // Remove duplicates from data or dataa
  const getUniqueData = (dataArray) => {
    const uniqueData = [];
    const seenIds = new Set();

    for (const item of dataArray) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  };

  // Render each user
  const renderUserItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4 mx-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.profile_image || icons.defaultProfile }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-bold">{item.username}</Text>
          <Text className="text-gray-600">{item.email}</Text>
          <Text className="text-gray-600">{item.phone_number || "N/A"}</Text>
          <Text className="text-gray-600">{item.role_state || "N/A"}</Text>
          <Text className="text-gray-600">{item.firebase_uid || "N/A"}</Text>
        </View>
      </View>
      <Text className="text-gray-500 mt-2">
        Joined: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  // Render loading indicator at the bottom
  const renderFooter = () => {
    if (isLoading || isFetching) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  // Get unique data for display
  const uniqueData = isSearchMode ? getUniqueData(dataa) : getUniqueData(data);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="p-4 bg-white shadow-sm">
        <View className="flex-row items-center bg-gray-200 rounded-lg px-4 py-2">
          <TextInput
            className="flex-1 text-lg"
            placeholder="Search by username..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image source={icons.search} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={uniqueData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        onEndReached={() => {
          if (!isEndReachedCalledDuringMomentum.current) {
            handleEndReached();
            isEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onMomentumScrollBegin={() => {
          isEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReachedThreshold={0.3} // slightly less sensitive
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default AddCreators;
