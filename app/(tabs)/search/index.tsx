import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SquareProductsCard from "@/components/NewLightFolder/SquareProductsCard";
import { icons } from "@/constants";
import Icon from "react-native-vector-icons/Ionicons";
import PriceFilter from "@/components/NewLightFolder/priceFilter";
import ColorFilter from "@/components/NewLightFolder/ColorFilter";
import TagFilter from "@/components/NewLightFolder/tagsFilter";
import { getSelectedItem } from "@/store/Actions/selectedItemAction";
import { useRouter } from "expo-router";
import {
  fetchFilterProducts,
  filterdata,
  resetProducts,
} from "@/store/Actions/filter";
import {
  allDataWithoutTag,
  fetchProductsByTags,
  resetProductsByTags,
} from "@/store/Actions/fetchProductsByTags";
import SizeFilterSlider from "@/components/NewLightFolder/sizeSlider";
import { set } from "firebase/database";

const QueryScreen = () => {
  const router = useRouter();
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
  const isLoadingg = useSelector((state) => state.selectedItem.loading);
  const [page, setpage] = useState(1);
  const [query, setQuery] = useState("");
  const [isEndReached, setIsEndReached] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    minprice: 0,
    maxprice: 1000,
  });
  const [selectedSizeRange, setSelectedSizeRange] = useState({
    minSize: 0,
    maxSize: 300,
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTagss, setSelectedTags] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [tagss, setTagss] = useState();
  const [data, setdata] = useState([]);
  const filterAnimation = useRef(new Animated.Value(-300)).current;
  const filterButtonAnimation = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (tagssss && tagssss !== tagss) {
      setTagss(tagssss);
    } else {
      console.log("tagssss is empty or unchanged");
    }
  }, [tagssss, tagss]); // Make sure tagss is included as a dependency
  const handletocart = (id, producttag) => {
    dispatch(resetProductsByTags());
    dispatch(fetchProductsByTags(producttag, 1));
    dispatch(getSelectedItem(id));
    if (!isLoadingg) {
      router.push(`/home/${id}`);
    } else {
      console.log("Loading data, please wait...");
    }
  };
  // Handle filter change and apply filters to Redux state
  const handlePriceFilterChange = ({ minprice, maxprice }) => {
    setSelectedPriceRange({ minprice, maxprice });
  };

  const handleSizeFilterChange = ({ minSize, maxSize }) => {
    setSelectedSizeRange({ minSize, maxSize });
  };

  const handleColorSelect = (colors) => {
    setSelectedColors(colors);
    console.log("Selected Colors:", colors);
  };

  const handleTagSelect = (tags) => {
    setSelectedTags(tags);
    console.log("Selected Tags:", tags);
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
  const handleGoBack = async () => {
    await dispatch(resetProducts());
    await dispatch(resetProductsByTags());
    router.back();
  };

  // Apply filters and dispatch the action
  const handleApplyFilters = async () => {
    await dispatch(resetProductsByTags());
    await dispatch(resetProducts());
    setQuery("");
    setSelectedColors([]);
    setSelectedTags([]);
    try {
      await dispatch(
        filterdata(
          selectedPriceRange.minprice,
          selectedPriceRange.maxprice,
          selectedSizeRange.minSize,
          selectedSizeRange.maxSize,
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
    } catch (error) {
      console.error("Error during data fetch:", error);
    }
    setFilterVisible(false);
    toggleFilterView();
  };
  useEffect(() => {
    if (itemm.length === 1 || itemss.length === 1) {
      setIsEndReached(true);
      handleEndReached(); // Trigger fetch when only one item exists
      console.log("only one item");
    } else if (itemm.length > 1 || itemss.length > 1) {
      console.log("only tow item");
      setIsEndReached(false);
    }
  }, [itemm, itemss]);
  const handleApplyTag = async () => {
    await dispatch(resetProducts());
    await dispatch(resetProductsByTags());
    await dispatch(fetchProductsByTags(query, 1));
  };
  // Fetch more products when reaching the end

  const handleEndReached = async () => {
    if (itemss.length > 0) {
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
      if (query) {
        try {
          if (hasmoredata && !loading) {
            // Make sure we don't skip a page

            await dispatch(fetchProductsByTags(query, pageone)); // Fetch data for the next page
          } else if (!hasmoredata && hasmoredatatow && !loading) {
            // Continue to fetch without tags

            console.log("Fetching without tags, page:", pagetow);
            await dispatch(allDataWithoutTag(query, pagetow)); // Fetch data for the next page
          } else {
            console.log("No more data to fetch");
          }
        } catch (error) {
          console.error("Error during data fetch:", error);
        }
      }
    }
  };

  // Scroll handler for filter visibility
  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY.current + 10) {
      Animated.timing(filterButtonAnimation, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY < lastScrollY.current - 10) {
      Animated.timing(filterButtonAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentScrollY;
  };

  // Render header (search bar)
  const renderHeader = () => (
    <View className="w-full h-14 justify-center items-center px-4 flex-row">
      <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
        <Icon name="chevron-back-circle-outline" size={32} color="white" />
      </TouchableOpacity>
      <View className="w-11/12 h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row">
        <TextInput
          className="text-base flex-1 text-white font-psemibold"
          value={query}
          onChangeText={setQuery}
          placeholder="Search..."
          placeholderTextColor="#ccc"
          onSubmitEditing={handleApplyTag} // Trigger handleApplyTag on Enter press
          returnKeyType="search" // Optional: Change the return key to "search"
          blurOnSubmit={false} // Keep the input focused after pressing Enter
        />
        <TouchableOpacity onPress={handleApplyTag}>
          <Image source={icons.search} className="w-5 h-5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render filters
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
        <Text className="text-white text-lg font-semibold mb-4">
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
          onPress={handleApplyFilters}
          className="bg-red-600 py-3 rounded-md mt-4 justify-center items-center"
        >
          <Text className="text-white font-bold">Apply</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  // Footer for loading more data
  const renderFooter = () =>
    isEndReached && (
      <View className="flex justify-center items-center py-4">
        <ActivityIndicator size="large" color="#00f" />
      </View>
    );

  return (
    <SafeAreaView className="h-full bg-[#021b36] pb-2">
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
          <Text className="text-white text-xl font-bold">Filter</Text>
          <Image source={icons.filter} className="w-5 h-5" />
        </TouchableOpacity>
      </Animated.View>
      <FlatList
        data={itemm.length > 0 ? itemm : itemss}
        renderItem={({ item }) => (
          <SquareProductsCard data={item} handleAddToCart={handletocart} />
        )}
        keyExtractor={(item, index) => `${item.id || item.product_id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

export default QueryScreen;
