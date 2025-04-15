import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  resetCategories,
} from "@/store/Actions/fetchCategories";
import SearchBarr from "@/components/NewLightFolder/SearchBar";
import {
  fetchProductsByTags,
  resetProductsByTags,
} from "@/store/Actions/fetchProductsByTags";
import { useNavigation } from "@react-navigation/native";
import {
  getFirstPage,
  getFirstpageRestart,
} from "@/store/Actions/getFirstPageADS";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  getRandomProductAction,
  resetRandomProduct,
} from "@/store/Actions/randomProduct";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const SPACING = 16;
const CARD_HEIGHT = 400;

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);
  const { categories } = useSelector((state) => state.categories);
  const { data: adsData } = useSelector((state) => state.AdsFirst);
  const { random } = useSelector((state) => state.randomProduct);
  const router = useRouter();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handelGo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)/search");
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Reset all relevant states
      await dispatch(getFirstpageRestart());
      await dispatch(resetRandomProduct());
      await dispatch(resetCategories());

      // Fetch fresh data
      await Promise.all([
        dispatch(getFirstPage()),
        dispatch(getRandomProductAction()),
        loadData(),
      ]);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(getFirstPage());
  }, []);
  useEffect(() => {
    dispatch(getRandomProductAction());
  }, []);

  // Auto-scroll ads
  useEffect(() => {
    if (adsData?.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % adsData.length;
        setCurrentIndex(nextIndex);
        sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, adsData]);

  const getAdsImageUrl = (adItem) => {
    return (
      adItem?.publicUrl ||
      "https://firebasestorage.googleapis.com/v0/b/newlightnew-82e5f.firebasestorage.app/o/mySQL-images%2F%D8%AB%D8%B1%D9%8A%D9%87%20%D9%83%D9%84%D8%A7%D8%B3%D9%83%20%D9%83-2-0.jpg?alt=media&token=c19eaeec-ed4b-44c3-bf48-6c6d9671def5"
    );
  };

  const getProductImageUrl = (product) => {
    if (product?.image_url) {
      return product.image_url;
    }

    if (product?.images?.length > 0) {
      if (typeof product.images[0].image_url === "string") {
        try {
          const parsed = JSON.parse(product.images[0].image_url);
          if (parsed?.publicUrl) {
            return parsed.publicUrl;
          }
        } catch (e) {
          return product.images[0].image_url;
        }
      }
    }

    return "https://firebasestorage.googleapis.com/v0/b/newlightnew-82e5f.firebasestorage.app/o/mySQL-images%2F%D8%AB%D8%B1%D9%8A%D9%87%20%D9%83%D9%84%D8%A7%D8%B3%D9%83%20%D9%83-2-0.jpg?alt=media&token=c19eaeec-ed4b-44c3-bf48-6c6d9671def5";
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await dispatch(fetchCategories());
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeeMore = async (tag) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await dispatch(resetProductsByTags());
    await dispatch(fetchProductsByTags(tag, 1));
    router.push("/home/homeScreen");
  };

  const renderAdsItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.adsSlide, { transform: [{ scale }] }]}>
        <Image
          source={{ uri: getAdsImageUrl(item) }}
          style={styles.adsImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.adsGradient}
        />
      </Animated.View>
    );
  };

  const renderCategoryCard = ({ item }) => {
    const products = Array.isArray(item.products) ? item.products : [];
    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{item.first_tag}</Text>
          <TouchableOpacity
            onPress={() => handleSeeMore(item.first_tag)}
            style={styles.seeMoreButton}
          >
            <Text style={styles.seeMoreText}>View All</Text>
            <Feather name="chevron-right" size={18} color="#5d4ee0" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {products.slice(0, 4).map((product, index) => (
            <TouchableOpacity
              key={`${item.first_tag}-${product.product_id}-${index}`}
              style={styles.productCard}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                // Add navigation to product detail here
              }}
            >
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: getProductImageUrl(product) }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              {product.name && (
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
              )}
              {product.price && (
                <Text style={styles.productPrice}>${product.price}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5d4ee0" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color="#ff4757" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5d4ee0" />

      {/* Header with Search */}
      <LinearGradient colors={["#5d4ee0", "#6a5de0"]} style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity
          onPress={handelGo}
          style={styles.searchContainer}
          activeOpacity={0.8}
        >
          <Feather name="search" size={20} color="#888" />
          <Text style={styles.searchPlaceholder}>Search for products...</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5d4ee0"]}
            tintColor="#5d4ee0"
            progressBackgroundColor="#ffffff"
            title="Refreshing..."
            titleColor="#5d4ee0"
          />
        }
      >
        {/* Featured Ads Slider */}
        {adsData?.length > 0 && (
          <View style={styles.adsContainer}>
            <Animated.FlatList
              ref={sliderRef}
              data={adsData}
              renderItem={renderAdsItem}
              keyExtractor={(item) => `ad-${item.id}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(newIndex);
              }}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
            <View style={styles.pagination}>
              {adsData.map((_, index) => (
                <View
                  key={`indicator-${index}`}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* First Two Categories (rendered individually) */}
        {categories.slice(0, 1).map((category, index) => (
          <View
            key={`category-${category.first_tag}-${index}`}
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.first_tag}</Text>
              <TouchableOpacity
                onPress={() => handleSeeMore(category.first_tag)}
                style={styles.seeMoreButton}
              >
                <Text style={styles.seeMoreText}>View All</Text>
                <Feather name="chevron-right" size={18} color="#5d4ee0" />
              </TouchableOpacity>
            </View>

            <View style={styles.productsGrid}>
              {category.products.slice(0, 4).map((product, productIndex) => (
                <TouchableOpacity
                  key={`${category.first_tag}-${product.product_id}-${productIndex}`}
                  style={styles.productCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.selectionAsync();
                    // Add navigation to product detail here
                  }}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: getProductImageUrl(product) }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>
                  {product.name && (
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                  )}
                  {product.price && (
                    <Text style={styles.productPrice}>${product.price}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.randomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity
              onPress={() => handleSeeMore("Featured")}
              style={styles.seeMoreButton}
            >
              <Text style={styles.seeMoreText}>View All</Text>
              <Feather name="chevron-right" size={18} color="#5d4ee0" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={random.slice(0, 10)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.randomProductCard}
                activeOpacity={0.8}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={styles.randomProductImageContainer}>
                  <Image
                    source={{
                      uri: item.images?.[0]?.image_url || "default_image_url",
                    }}
                    style={styles.randomProductImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.3)"]}
                    style={styles.randomProductGradient}
                  />
                </View>
                <View style={styles.randomProductInfo}>
                  <Text style={styles.randomProductName} numberOfLines={1}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.randomProductPrice}>
                    ${item.variants?.[0].price}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `random-${item.product_id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.randomProductsContainer}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </View>
        {categories.slice(1, 2).map((category, index) => (
          <View
            key={`category-${category.first_tag}-${index}`}
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.first_tag}</Text>
              <TouchableOpacity
                onPress={() => handleSeeMore(category.first_tag)}
                style={styles.seeMoreButton}
              >
                <Text style={styles.seeMoreText}>View All</Text>
                <Feather name="chevron-right" size={18} color="#5d4ee0" />
              </TouchableOpacity>
            </View>

            <View style={styles.productsGrid}>
              {category.products.slice(0, 4).map((product, productIndex) => (
                <TouchableOpacity
                  key={`${category.first_tag}-${product.product_id}-${productIndex}`}
                  style={styles.productCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.selectionAsync();
                    // Add navigation to product detail here
                  }}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: getProductImageUrl(product) }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>
                  {product.name && (
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                  )}
                  {product.price && (
                    <Text style={styles.productPrice}>${product.price}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.randomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Picks</Text>
            <TouchableOpacity
              onPress={() => handleSeeMore("Popular")}
              style={styles.seeMoreButton}
            >
              <Text style={styles.seeMoreText}>View All</Text>
              <Feather name="chevron-right" size={18} color="#5d4ee0" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={random.slice(10, 20)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.randomProductCard}
                activeOpacity={0.8}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={styles.randomProductImageContainer}>
                  <Image
                    source={{
                      uri: item.images?.[0]?.image_url || "default_image_url",
                    }}
                    style={styles.randomProductImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.3)"]}
                    style={styles.randomProductGradient}
                  />
                </View>
                <View style={styles.randomProductInfo}>
                  <Text style={styles.randomProductName} numberOfLines={1}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.randomProductPrice}>
                    ${item.variants?.[0].price}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `popular-${item.product_id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.randomProductsContainer}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </View>
        {/* Remaining Categories in FlatList */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Categories</Text>
          <FlatList
            data={categories.slice(2)}
            renderItem={renderCategoryCard}
            keyExtractor={(item, index) => `${item.first_tag}-${index}`}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#5d4ee0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    paddingTop: 2,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: "#888",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  adsContainer: {
    height: CARD_HEIGHT,
    marginTop: 20,
    marginBottom: 10,
  },
  adsSlide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: (width - CARD_WIDTH) / 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adsImage: {
    width: "100%",
    height: "100%",
  },
  adsGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  categoriesList: {
    paddingBottom: 40,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    color: "#5d4ee0",
    fontWeight: "600",
    marginRight: 4,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    marginBottom: 16,
  },
  productImageContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    overflow: "hidden",
    aspectRatio: 1,
    marginBottom: 8,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5d4ee0",
  },
  randomSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  randomProductsContainer: {
    paddingLeft: 4,
    paddingRight: 16,
  },
  randomProductCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  randomProductImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  randomProductImage: {
    width: "100%",
    height: "100%",
  },
  randomProductGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  randomProductInfo: {
    padding: 10,
  },
  randomProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  randomProductPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5d4ee0",
  },
  separator: {
    width: 12,
  },
});

export default Home;
