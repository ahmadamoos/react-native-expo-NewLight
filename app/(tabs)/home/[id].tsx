import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  allDataWithoutTag,
  fetchProductsByTags,
  resetProductsByTags,
} from "@/store/Actions/fetchProductsByTags";
import Icon from "react-native-vector-icons/Ionicons";
import SquareProductsCardd from "@/components/NewLightFolder/squareproducts";
import { useNavigation } from "@react-navigation/native";
import root from "@/lib/apihttp";
import axios from "axios";
import {
  getSelectedItem,
  resetSelectedItem,
} from "@/store/Actions/selectedItemAction";
import { useCart } from "@/context/CartGlobalProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.8;
const SelectedItemCard = () => {
  const { addToCart } = useCart();
  const item = useSelector((state) => state.selectedItem.item);
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
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tagss, setTagss] = useState([]);
  const router = useRouter();
  const variations = item?.variants ? Object.values(item.variants) : [];
  const imagesUrl = item?.images || [];
  const dispatch = useDispatch();
  const { isLoggedIn, user, setIsLoggedIn } = useGlobalContext();
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    setSelectedVariation(null);
    setQuantity(1);
  }, [item]);
  useEffect(() => {
    if (tagssss && tagssss !== tagss) {
      setTagss(tagssss);
      console.log("Updated tagssss", tagssss);
    } else {
      console.log("tagssss is empty or unchanged");
    }
  }, [tagssss, tagss]); // Make sure tagss is included as a dependency

  // useEffect(() => {
  //   dispatch(resetProductsByTags());
  //   dispatch(fetchProductsByTags(item.tags[0], 1));
  // }, []);
  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) {
      setSelectedVariation(variations[0]);
      setQuantity(1);
    }
  }, [item, variations]);
  const handlegotosignup = () => {
    router.push("../../(auth)/sign-up");
  };

  const handleVariationSelect = (variation) => {
    setSelectedVariation(variation);
    setQuantity(1);
  };

  const fallbackImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/newlightnew-82e5f.firebasestorage.app/o/mySQL-images%2F%D8%AB%D8%B1%D9%8A%D9%87%20%D9%83%D9%84%D8%A7%D8%B3%D9%83%20%D9%83-2-0.jpg?alt=media&token=c19eaeec-ed4b-44c3-bf48-6c6d9671def5";

  const handleQuantityChange = (operation) => {
    setQuantity((prev) => {
      const newValue = operation === "increment" ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newValue, selectedVariation?.quantity || 1));
    });
  };

  const isSelected = (variation) =>
    selectedVariation?.variant_id === variation.variant_id;

  const handleAddToCart = async () => {
    if (!selectedVariation) return;

    setIsLoading(true);

    try {
      const userid = await auth.currentUser.uid;
      const respouns = await axios.post(`http://${root}:3000/create-cart`, {
        user_id: userid,
      });
      const cart_id = respouns.data.cart_id;
      console.log("Cart cart_id:", cart_id);
      // Validate required image
      if (!item.images || item.images.length === 0) {
        throw new Error("Product image is missing");
      }

      const cartItem = {
        cart_id: cart_id,
        product_id: selectedVariation.product_id,
        variant_id: selectedVariation.variant_id,
        color: selectedVariation.color,
        size: selectedVariation.size,
        quantity: selectedVariation.quantity, // Available stock
        chosenQuantity: quantity, // User-selected quantity
        product_price: selectedVariation.price,
        product_name: item.product_name,
        cart_image: item.images[0].image_url,
        product_total_price: selectedVariation.price * quantity,
      };

      addToCart(cartItem);
      // Save updated cart

      console.log("Cart updated successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(
        "There was an error adding the item to your cart. Please try again."
      );
      // Consider re-throwing if you need to handle this error elsewhere
      // throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleBayNow = async () => {
    if (!selectedVariation) return;

    setIsLoading(true);

    try {
      const userid = await auth.currentUser.uid;
      const respouns = await axios.post(`http://${root}:3000/create-cart`, {
        user_id: userid,
      });
      const cart_id = respouns.data.cart_id;
      console.log("Cart cart_id:", cart_id);
      // Validate required image
      if (!item.images || item.images.length === 0) {
        throw new Error("Product image is missing");
      }

      const cartItem = {
        cart_id: cart_id,
        product_id: selectedVariation.product_id,
        variant_id: selectedVariation.variant_id,
        color: selectedVariation.color,
        size: selectedVariation.size,
        quantity: selectedVariation.quantity, // Available stock
        chosenQuantity: quantity, // User-selected quantity
        product_price: selectedVariation.price,
        product_name: item.product_name,
        cart_image: item.images[0].image_url,
        product_total_price: selectedVariation.price * quantity,
      };

      addToCart(cartItem);
      // Save updated cart

      console.log("Cart updated successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(
        "There was an error adding the item to your cart. Please try again."
      );
      // Consider re-throwing if you need to handle this error elsewhere
      // throw error;
    } finally {
      setIsLoading(false);
      router.push("../cart/chickOut");
    }
  };
  const handleAddToCartTow = async (productid, tagss) => {
    dispatch(resetProductsByTags());
    dispatch(resetSelectedItem());
    dispatch(getSelectedItem(productid));
    dispatch(fetchProductsByTags(tagss, 1));
  };
  const handleEndReached = async () => {
    try {
      if (hasmoredata && !loading) {
        // Make sure we don't skip a page

        console.log("Fetching by tags, pageone:", pageone);
        await dispatch(fetchProductsByTags(tagss, pageone)); // Fetch data for the next page
      } else if (!hasmoredata && hasmoredatatow && !loading) {
        // Continue to fetch without tags

        console.log("Fetching without tags, pagetow:", pagetow);
        await dispatch(allDataWithoutTag(tagss, pagetow)); // Fetch data for the next page
      } else {
        console.log("No more data to fetch");
      }
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      setIsFetching(false); // Ensure `isFetching` is reset even if an error occurs
    }
  };
  if (!item || variations.length === 0 || !selectedVariation) {
    return (
      <View className="flex-1 justify-center items-center bg-[#c1c6cc]">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2">Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Back Button */}
      <LinearGradient
        colors={["#1a3a6e", "#0d2b56"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {item.product_name}
        </Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <FlatList
        data={itemm}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Enhanced Image Carousel with Zoom Effect */}
            <View style={styles.carouselContainer}>
              <Animated.FlatList
                horizontal
                data={imagesUrl}
                keyExtractor={(image) => `image-${image.image_id}`}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: image, index }) => {
                  const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                  ];

                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1, 0.8],
                    extrapolate: "clamp",
                  });

                  return (
                    <Animated.View
                      style={[styles.imageSlide, { transform: [{ scale }] }]}
                    >
                      <Image
                        source={{ uri: image.image_url || fallbackImageUrl }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  );
                }}
                pagingEnabled
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / width
                  );
                  setCurrentImageIndex(index);
                }}
              />

              {/* Enhanced Pagination Dots */}
              <View style={styles.pagination}>
                {imagesUrl.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Product Details Section with Beautiful Cards */}
            <View style={styles.detailsContainer}>
              {/* Price and Selected Variant Card */}
              <View style={[styles.card, styles.priceVariantCard]}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    ${selectedVariation.price}
                  </Text>
                  {selectedVariation.originalPrice && (
                    <Text style={styles.originalPriceText}>
                      ${selectedVariation.originalPrice}
                    </Text>
                  )}
                </View>

                <View style={styles.selectedVariantBadge}>
                  <Text style={styles.selectedVariantText}>
                    <Text style={styles.badgeLabel}>Selected:</Text>{" "}
                    {selectedVariation.color} - {selectedVariation.size}cm
                  </Text>
                  <View
                    style={[
                      styles.stockBadge,
                      selectedVariation.quantity <= 0 && styles.outOfStockBadge,
                    ]}
                  >
                    <Text style={styles.stockText}>
                      {selectedVariation.quantity > 0
                        ? `${selectedVariation.quantity} available`
                        : "Out of stock"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Quantity Selector Card */}
              <View style={[styles.card, styles.quantityCard]}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity <= 1 && styles.disabledButton,
                    ]}
                    onPress={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                  >
                    <Ionicons name="remove" size={20} color="white" />
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{quantity}</Text>

                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity >= selectedVariation.quantity &&
                        styles.disabledButton,
                    ]}
                    onPress={() => handleQuantityChange("increment")}
                    disabled={quantity >= selectedVariation.quantity}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Variant Selection Card */}
              <View style={[styles.card, styles.variantsCard]}>
                <Text style={styles.sectionTitle}>Available Options</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.variantsScroll}
                >
                  {variations.map((variation) => (
                    <TouchableOpacity
                      key={`variant-${variation.variant_id}`}
                      onPress={() => handleVariationSelect(variation)}
                      style={[
                        styles.variantButton,
                        isSelected(variation) && styles.selectedVariantButton,
                        variation.quantity <= 0 && styles.outOfStockVariant,
                      ]}
                    >
                      <Text
                        style={[
                          styles.variantText,
                          isSelected(variation) && styles.selectedVariantText,
                          variation.quantity <= 0 && styles.outOfStockText,
                        ]}
                      >
                        {variation.color}
                      </Text>
                      <Text style={styles.variantSizeText}>
                        {variation.size}cm
                      </Text>
                      <Text
                        style={[
                          styles.variantPriceText,
                          variation.quantity <= 0 && styles.outOfStockText,
                        ]}
                      >
                        ${variation.price}
                      </Text>
                      {variation.quantity <= 0 && (
                        <View style={styles.soldOutOverlay}>
                          <Text style={styles.soldOutText}>Sold Out</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Product Description Card */}
              {item.product_description && (
                <View style={[styles.card, styles.descriptionCard]}>
                  <Text style={styles.sectionTitle}>Product Details</Text>
                  <ScrollView style={styles.descriptionScroll}>
                    <Text style={styles.descriptionText}>
                      {item.product_description}
                    </Text>
                  </ScrollView>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                {isLoggedIn && !user.isAnonymous ? (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.cartButton,
                        (isLoading || selectedVariation.quantity === 0) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleAddToCart}
                      disabled={isLoading || selectedVariation.quantity === 0}
                    >
                      <Ionicons name="cart-outline" size={22} color="white" />
                      <Text style={styles.actionButtonText}>
                        {isLoading ? "Adding..." : "Add to Cart"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.buyButton,
                        (isLoading || selectedVariation.quantity === 0) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleBayNow}
                      disabled={isLoading || selectedVariation.quantity === 0}
                    >
                      <Ionicons name="flash-outline" size={22} color="white" />
                      <Text style={styles.actionButtonText}>
                        {isLoading ? "Processing..." : "Buy Now"}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handlegotosignup}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="log-in-outline" size={22} color="white" />
                    <Text style={styles.signInButtonText}>
                      Sign In to Purchase
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Related Products Section */}
            <View style={styles.relatedProductsHeader}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item: product }) => (
          <View style={styles.relatedProductContainer}>
            <SquareProductsCardd
              data={product}
              handleAddToCart={handleAddToCartTow}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.relatedProductsRow}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2c5282"
              style={styles.loader}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dad7d7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  carouselContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  imageSlide: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  productImage: {
    width: "90%",
    height: "90%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#ffffff",
    width: 20,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  priceVariantCard: {
    paddingVertical: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e40af",
  },
  originalPriceText: {
    fontSize: 18,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginLeft: 8,
    marginBottom: 4,
  },
  selectedVariantBadge: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  badgeLabel: {
    fontWeight: "600",
    color: "#64748b",
  },
  selectedVariantText: {
    fontSize: 16,
    color: "#1e293b",
  },
  stockBadge: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  outOfStockBadge: {
    backgroundColor: "#fee2e2",
  },
  stockText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0369a1",
  },
  quantityCard: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  quantityButton: {
    backgroundColor: "#1e40af",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#cbd5e1",
    shadowColor: "transparent",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    minWidth: 60,
    textAlign: "center",
  },
  variantsCard: {
    paddingVertical: 16,
  },
  variantsScroll: {
    paddingRight: 16,
  },
  variantButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    minWidth: 100,
    alignItems: "center",
    position: "relative",
    height: 100,
    justifyContent: "center",
  },
  selectedVariantButton: {
    borderColor: "#1e40af",
    backgroundColor: "#eff6ff",
  },
  outOfStockVariant: {
    opacity: 0.7,
  },
  variantText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
  },
  selectedVariantText: {
    color: "#1e40af",
    fontWeight: "600",
  },
  variantSizeText: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  variantPriceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
    marginTop: 8,
  },
  outOfStockText: {
    color: "#94a3b8",
  },
  soldOutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  soldOutText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
    textTransform: "uppercase",
  },
  descriptionCard: {
    paddingVertical: 16,
  },
  descriptionScroll: {
    maxHeight: 150,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cartButton: {
    backgroundColor: "#1e40af",
  },
  buyButton: {
    backgroundColor: "#2563eb",
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  signInButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  relatedProductsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  relatedProductContainer: {
    flex: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  relatedProductsRow: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  loader: {
    marginVertical: 24,
  },
});

export default SelectedItemCard;
