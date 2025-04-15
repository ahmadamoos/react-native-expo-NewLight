import {
  Text,
  View,
  Alert,
  StatusBar,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Button,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getSelectedItem,
  resetSelectedItem,
} from "../../../store/Actions/selectedItemAction";
import SearchBarr from "@/components/NewLightFolder/SearchBar";
import ProductsCard from "@/components/NewLightFolder/Products";
import EmptyState from "@/components/NewLightFolder/EmptyState";
import Trending from "@/components/NewLightFolder/Trending";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";

import { set } from "firebase/database";
import { icons } from "@/constants";
import PriceFilter from "@/components/NewLightFolder/priceFilter";
import SizeFilter from "@/components/NewLightFolder/SizeFilter";
import ColorFilter from "@/components/NewLightFolder/ColorFilter";
import TagFilter from "@/components/NewLightFolder/tagsFilter";
import Icon from "react-native-vector-icons/Ionicons";
import {
  allDataWithoutTag,
  fetchProductsByTags,
  resetPage,
  resetProductsByTags,
} from "@/store/Actions/fetchProductsByTags";
// import { getDataWithoutTag } from '@/store/Actions/getDataWithoutTag';
import SizeFilterSlider from "@/components/NewLightFolder/sizeSlider";
import {
  fetchFilterProducts,
  filterdata,
  resetProducts,
} from "@/store/Actions/filter";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const router = useRouter();
  const userId = auth.currentUser?.uid;
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const {
    itemss,
    hasMorethrey,
    filterpage,
    minprice,
    maxprice,
    minsize,
    maxsize,
    selectedColor,
    selectedTags,
  } = useSelector((state) => state.filterS);
  // const { item, loading, error, lastVisibleDocs, hasMoreData , tag} = useSelector((state) => state.search);
  const {
    itemm,
    loading,
    error,
    tagssss,
    hasmoredata,
    hasmoredatatow,
    pageone,
    pagetow,
  } = useSelector((state) => state.productbytagss);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(""); // Added query state
  const isLoadingg = useSelector((state) => state.selectedItem.loading);
  const [filterVisible, setFilterVisible] = useState(false); // Filter view state
  const filterAnimation = useRef(new Animated.Value(-300)).current; // Animation for filter
  const filterButtonAnimation = useRef(new Animated.Value(0)).current; // Animation for filter button visibility
  const lastScrollY = useRef(0); // Keeps track of the last scroll position
  const [isEndReached, setIsEndReached] = useState(false);
  const [selectedSizeRange, setSelectedSizeRange] = useState({
    min: 0,
    max: 300,
  });
  const [data, setdata] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTagss, setSelectedTags] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: 0,
    max: 1000,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [tagss, setTagss] = useState([]);
  // const [pagetow, setpagetow] = useState(1);
  const navigation = useNavigation(); // Access the navigation object

  const handleAddToCart = (id, producttag) => {
    dispatch(resetSelectedItem());
    dispatch(resetProductsByTags());
    dispatch(fetchProductsByTags(producttag, 1));
    dispatch(getSelectedItem(id));
    if (!isLoadingg) {
      router.push(`/home/${id}`);
    } else {
      console.log("Loading data, please wait...");
    }
  };

  useEffect(() => {
    if (tagssss && tagssss !== tagss) {
      setTagss(tagssss);
      console.log("Updated tagssss", tagssss);
    } else {
      console.log("tagssss is empty or unchanged");
    }
  }, [tagssss, tagss]); // Make sure tagss is included as a dependency

  const onRefresh = async () => {
    setRefreshing(true);

    const newTagss = tagss;
    try {
      // Don't reset tagss here, as it's already handled in useEffect
      console.log("Refreshing with tagss", newTagss);
      await dispatch(resetProducts());
      await dispatch(resetProductsByTags());
      await dispatch(fetchProductsByTags(newTagss, 1)); // Use the current tagss value here
    } catch (error) {
      Alert.alert("Error", "Failed to refresh products.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleEndReached = async () => {
    setIsFetching(true);

    try {
      if (itemss.length > 0) {
        if (hasMorethrey) {
          await dispatch(
            fetchFilterProducts(
              minprice,
              maxprice,
              minsize,
              maxsize,
              selectedColor,
              selectedTags,
              filterpage
            )
          );
        } else {
          console.log("No more data to fetch");
        }
      } else if (tagssss) {
        if (hasmoredata && !loading) {
          await dispatch(fetchProductsByTags(tagss, pageone));
        } else if (!hasmoredata && hasmoredatatow && !loading) {
          await dispatch(allDataWithoutTag(tagss, pagetow));
        } else {
          console.log("No more data to fetch");
        }
      }
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      setIsFetching(false); // Reset isFetching
    }
  };

  const handlePriceFilterChange = ({ minprice, maxprice }) => {
    setSelectedPriceRange({ minprice, maxprice });
    console.log(`Min: ${minprice}, Max: ${maxprice}`);
  };
  const handleSizeFilterChange = ({ minSize, maxSize }) => {
    setSelectedSizeRange({ minSize, maxSize });
    console.log(`Selected Size Range - Min: ${minSize} cm, Max: ${maxSize} cm`);
  };
  const handleColorSelect = (colors: string) => {
    setSelectedColors(colors);
    console.log("Selected Colors:", colors);
  };

  const handleTagSelect = (tags: string) => {
    setSelectedTags(tags);
    console.log("Selected Tags:", tags);
  };
  const submit = async () => {
    await dispatch(resetProductsByTags());
    await dispatch(resetProducts());
    setSelectedColors([]);
    setSelectedTags([]);
    try {
      await dispatch(
        filterdata(
          selectedPriceRange.min,
          selectedPriceRange.max,
          selectedSizeRange.min,
          selectedSizeRange.max,
          selectedColors,
          selectedTagss
        )
      );
      await dispatch(
        fetchFilterProducts(
          selectedPriceRange.minprice,
          selectedPriceRange.maxprice,
          selectedSizeRange.minSize,
          selectedSizeRange.maxSize,
          selectedColors,
          selectedTagss,
          1
        )
      );
      toggleFilterView();
    } catch (error) {
      console.error("Error during data fetch:", error);
    }
  };

  const toggleFilterView = () => {
    if (filterVisible) {
      Animated.timing(filterAnimation, {
        toValue: -1000,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setFilterVisible(false));
    } else {
      setFilterVisible(true);
      Animated.timing(filterAnimation, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };
  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY.current + 10) {
      // Scrolling down, hide the filter button
      Animated.timing(filterButtonAnimation, {
        toValue: 100, // Move out of view
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY < lastScrollY.current - 10) {
      // Scrolling up, show the filter button
      Animated.timing(filterButtonAnimation, {
        toValue: 0, // Bring back into view
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  const handelGo = async () => {
    await dispatch(resetProductsByTags());
    await dispatch(resetProducts());
    router.replace("/(tabs)/search");
  };
  const handelGoBack = async () => {
    await dispatch(resetProducts());

    await dispatch(resetProductsByTags());
    router.back();
  };

  const renderHeader = () => (
    <TouchableOpacity onPress={handelGo}>
      <View className="w-full h-14 justify-center items-center px-4 flex-row">
        <TouchableOpacity className="pr-1" onPress={handelGoBack}>
          <Icon name="chevron-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <View className="w-11/12 h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row">
          <TouchableOpacity className="flex-1" onPress={handelGo}>
            <TextInput
              className="text-base flex-1 text-white font-psemibold"
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor="#ccc"
              onFocus={handelGo}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handelGo}>
            <Image source={icons.search} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterView = () => (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        backgroundColor: "#0c3ea1",
        padding: 16,
        zIndex: 1000,
        transform: [{ translateY: filterAnimation }],
      }}
    >
      <ScrollView>
        <Text className="text-white text-lg font-semibold mb-4 ">
          Filter Options
        </Text>
        <PriceFilter onFilterChange={handlePriceFilterChange} />
        <View className="h-4" />
        <SizeFilterSlider onFilterChange={handleSizeFilterChange} />
        <View className="h-4" />
        <ColorFilter onColorSelect={handleColorSelect} />
        <View className="h-4" />
        <TagFilter onTagSelect={handleTagSelect} />

        <TouchableOpacity
          onPress={submit}
          className="bg-[#38e97c] py-3 rounded-md mt-4 justify-center items-center"
        >
          <Text className="text-white font-bold">submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleFilterView}
          className="bg-red-600 py-3 rounded-md mt-4 justify-center items-center"
        >
          <Text className="text-white font-bold">close</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderFooter = () =>
    (isEndReached || loading) && (
      <View className="flex justify-center items-center py-4">
        <ActivityIndicator size="large" color="#00f" />
      </View>
    );
  return (
    <SafeAreaView className="bg-[#dad7d7] h-full pb-6">
      <StatusBar barStyle="light-content" backgroundColor="#5d4ee0" />
      {renderHeader()}
      {filterVisible && renderFilterView()}
      <Animated.View
        style={{
          transform: [{ translateY: filterButtonAnimation }],
          position: "absolute",
          bottom: 16,
          width: "100%",
          zIndex: 500,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          className="w-11/12 h-12 bg-[#7a1919] justify-center items-center px-4 flex-row rounded-xl"
          onPress={toggleFilterView}
        >
          <Text className="text-white text-xl font-bold">Filter </Text>
          <Image source={icons.filter} className="w-5 h-5" />
        </TouchableOpacity>
      </Animated.View>

      <View className="w-full h-full">
        <FlatList
          data={itemm.length > 0 ? itemm : itemss}
          renderItem={({ item }) => (
            <ProductsCard data={item} handleAddToCart={handleAddToCart} />
          )}
          keyExtractor={(item, index) =>
            item?.product_id ? item.product_id.toString() : `key-${index}`
          }
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 0 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<EmptyState title="No Products Found" />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
