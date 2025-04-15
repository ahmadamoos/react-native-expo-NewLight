import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import root from "../../lib/apihttp";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDataForUpdate,
  resetallDataForUpdate,
} from "@/store/Actions/updateProducts";
import RenderProduct from "@/components/NewLightFolder/updateData";
import EmptyState from "@/components/NewLightFolder/EmptyState";
import axios from "axios";
import { deleteImage, uploadFile } from "@/lib/firebase";
import { icons } from "@/constants";
import Icon from "react-native-vector-icons/Ionicons";
import {
  fetchProductsByTags,
  resetProductsByTags,
} from "@/store/Actions/fetchProductsByTags";
import { useRouter } from "expo-router";

const UpdateProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // New state
  const [newFetch, setnewFetch] = useState(false);
  const [selectedDelete, setselectedDelete] = useState([]);
  const [selectedDeleteImage, setselectedDeleteImage] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const {
    items, // Array to store your products
    loadingg,
    error,
    page,
    hasmoredataa,
  } = useSelector((state) => state.updateProducts);
  const { itemm, tagssss, hasmoredata, hasmoredatatow, pageone, pagetow } =
    useSelector((state) => state.productbytagss);
  let isFetching = false;
  let isFetchingMore = false;
  const onRefresh = async () => {
    if (refreshing || isFetching) return; // Prevent multiple refreshes simultaneously
    setRefreshing(true);

    try {
      setProducts([]);
      setselectedDeleteImage([]);
      setProductImages([]);
      setselectedDelete([]);
      setSelectedProducts([]);
      await dispatch(resetProductsByTags());

      await dispatch(resetallDataForUpdate(1)); // Reset Redux state and page number
      await dispatch(getAllDataForUpdate(1)); // Fetch the first page of products
      setIsInitialLoadComplete(true); // Mark initial load as complete after refresh
    } catch (error) {
      console.error("Error during refresh:", error);
      Alert.alert("Error", "Failed to refresh products.");
    } finally {
      setRefreshing(false);
    }
  };
  const handleApplyTag = async () => {
    setProducts([]);
    setselectedDeleteImage([]);
    setProductImages([]);
    setselectedDelete([]);
    setSelectedProducts([]);
    await dispatch(resetallDataForUpdate(1));
    await dispatch(resetProductsByTags());
    await dispatch(fetchProductsByTags(query, 1));
  };

  const handleGoBack = async () => {
    setProducts([]);
    setselectedDeleteImage([]);
    setProductImages([]);
    setselectedDelete([]);
    await dispatch(resetallDataForUpdate(1));
    setSelectedProducts([]);
    await dispatch(resetProductsByTags());
    router.push("/home/homeScreen");
  };
  useEffect(() => {
    fetchProducts(); // Trigger initial data fetch
  }, []);

  useEffect(() => {
    if (items != null && items.length > 0) {
      setProducts(items);
      setIsInitialLoadComplete(true); // Mark initial load as complete
      // console.log("items", items);
    } else {
      setIsInitialLoadComplete(true); // Mark initial load as complete
      setProducts(itemm);
      // console.log("itemm", itemm);
    }
  }, [items, itemm]);
  const fetchProducts = async () => {
    if (isFetching) return; // Prevent multiple fetches simultaneously

    setLoading(true);
    isFetching = true;

    try {
      setProducts([]);
      await dispatch(resetallDataForUpdate(1));
      await dispatch(getAllDataForUpdate(1));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  const handleEndReached = async () => {
    // Ensure that no fetch happens before initial data is loaded
    if (
      !isInitialLoadComplete ||
      isFetchingMore ||
      loading ||
      newFetch ||
      !hasmoredataa ||
      items.length === 0
    )
      return;

    setIsEndReached(true);
    isFetchingMore = true;
    setnewFetch(true);

    try {
      if (hasmoredataa) {
        await dispatch(getAllDataForUpdate(page)); // Fetch the next page
      } else {
        console.log("No more data to fetch");
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      isFetchingMore = false;
      setIsEndReached(false);
      setnewFetch(false);
    }
  };
  const handleSelectedDelete = (productId) => {
    if (selectedDelete.includes(productId)) {
      setselectedDelete((prev) => prev.filter((id) => id !== productId));
    } else {
      setselectedDelete((prev) => [...prev, productId]);
    }
  };
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      setselectedDelete((prev) => prev.filter((id) => id !== productId));
      setselectedDeleteImage((prev) =>
        prev.filter((ima) => ima.product_id !== productId)
      );
      setProductImages((prev) =>
        prev.filter((ima) => ima.product_id !== productId)
      );
      console.log(selectedDelete);
    } else {
      setSelectedProducts((prev) => [...prev, productId]);
    }
  };

  const handleUpdate = async () => {
    try {
      // Map selectedProducts to get both `updates` and `updataetow`

      const updates = selectedProducts.map((productId) => {
        const product = products.find((p) => p.product_id === productId);
        return {
          id: product.product_id,
          name: product.product_name,
          description: product.product_description,
          tags: product.tags,
          variants: product.variants,
        };
      });

      const updataetow = selectedProducts.map((productId) => {
        if (items.length > 0) {
          const itemproduct = items.find((p) => p.product_id === productId);
          return {
            id: itemproduct.product_id,
            name: itemproduct.product_name,
            description: itemproduct.product_description,
            tags: itemproduct.tags,
            variants: itemproduct.variants,
          };
        } else {
          const itemproduct = itemm.find((p) => p.product_id === productId);
          return {
            id: itemproduct.product_id,
            name: itemproduct.product_name,
            description: itemproduct.product_description,
            tags: itemproduct.tags,
            variants: itemproduct.variants,
          };
        }
      });
      // Iterate through updates to find changes
      for (const update of updates) {
        const previousState = updataetow.find((p) => p.id === update.id);

        if (!previousState) continue; // Skip if no previous state found

        // Find added variants and tags
        const addedVariants = update.variants.filter(
          (variant) =>
            !previousState.variants.some(
              (v) => v.variant_id === variant.variant_id
            )
        );
        const addedTags = update.tags.filter(
          (tag) => !previousState.tags.some((t) => t.tag_id === tag.tag_id)
        );

        // Find deleted variants and tags
        const deletedVariants = previousState.variants.filter(
          (variant) =>
            !update.variants.some((v) => v.variant_id === variant.variant_id)
        );
        const deletedTags = previousState.tags.filter(
          (tag) => !update.tags.some((t) => t.tag_id === tag.tag_id)
        );

        // Remove deleted/added variants and tags from update
        const updateddatanew = {
          ...update,
          tags: update.tags.filter(
            (tag) => !addedTags.some((t) => t.tag_id === tag.tag_id)
          ),
          variants: update.variants.filter(
            (variant) =>
              !addedVariants.some((v) => v.variant_id === variant.variant_id)
          ),
        };
        if (selectedDelete.length > 0) {
          for (const productId of selectedDelete) {
            try {
              const response = await axios.delete(
                `http://${root}:3000/delete-product/${productId}`
              );

              const images = response.data.images; // Already parsed array of objects
              for (const image of images) {
                const { gsUrl } = image; // Use gsUrl directly
                await deleteImage(gsUrl); // Delete image from Firebase
              }
            } catch (error) {
              console.error("Error deleting product or images:", error);
            }
          }
        }

        if (addedVariants.length > 0 || addedTags.length > 0) {
          // Perform add operations if there are new variants or tags
          await axios.put(
            `http://${root}:3000/product/${update.id}/add`,
            { tags: addedTags, variants: addedVariants },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log("Added Variants:", addedVariants);
          console.log("Added Tags:", addedTags);
        }
        if (productImages.length > 0) {
          // Step 1: Upload all images in parallel and get the uploaded URLs
          const imageUrii = await Promise.all(
            productImages.map(async (image, index) => {
              const { image_gs, product_id } = image;
              const uploadedFile = await uploadFile(
                image_gs,
                "images",
                product_id
              ); // Upload file and get the URL
              return uploadedFile; // Return the public URL after upload
            })
          );

          // Step 2: Send image URLs to the backend, associating them with their productId
          for (let i = 0; i < productImages.length; i++) {
            const { product_id } = productImages[i];
            console.log("Product ID:", product_id);
            console.log("Image URL:", imageUrii[i]);
            await axios.put(
              `http://${root}:3000/addimage`,
              {
                imageUrls: imageUrii[i], // Send the respective image URL
                productid: product_id,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        }
        if (deletedVariants.length > 0 || deletedTags.length > 0) {
          // Perform delete operations if there are removed variants or tags
          await axios.delete(
            `http://${root}:3000/product/${update.id}/delete`,
            {
              headers: { "Content-Type": "application/json" },
              data: {
                tagIds: deletedTags.map((tag) => tag.tag_id),
                variantIds: deletedVariants.map(
                  (variant) => variant.variant_id
                ),
              },
            }
          );
          console.log("Deleted Variants:", deletedVariants);
          console.log("Deleted Tags:", deletedTags);
        }
        if (selectedDeleteImage.length > 0) {
          for (const image of selectedDeleteImage) {
            const { image_gs, image_id, product_id } = image;
            deleteImage(image_gs);
            await axios.delete(`http://${root}:3000/delete-image`, {
              headers: { "Content-Type": "application/json" },
              data: {
                imageid: image_id,
                productId: product_id,
              },
            });
          }
        }
        if (updateddatanew.length > 0) {
          // Update the product details using updateddatanew
          await axios.put(
            `http://${root}:3000/productupdate/${updateddatanew.id}`,
            updateddatanew,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }

      // Success message
      alert("Products updated successfully!");
      setSelectedProducts([]); // Clear selected products
    } catch (error) {
      console.error("Error updating products:", error);
      alert("Failed to update products.");
    }
  };

  // (img) => img !== image.image_gs;
  const handleselectedDeleteImage = (image, productid) => {
    console.log("Image clicked:", image, productid);

    setselectedDeleteImage((prev) => {
      // Check if the image with the specific product ID is already selected
      if (
        prev.some(
          (ima) =>
            ima.image_id === image.image_id && ima.product_id === productid
        )
      ) {
        // Remove the image from the selection
        const updatedSelection = prev.filter(
          (ima) =>
            !(ima.image_id === image.image_id && ima.product_id === productid)
        );
        console.log("Updated selection (after removal):", updatedSelection);
        return updatedSelection;
      } else {
        // Add the image along with the product ID to the selection
        const updatedSelection = [...prev, { ...image, product_id: productid }];
        console.log("Updated selection (after addition):", updatedSelection);
        return updatedSelection;
      }
    });
  };
  const handleImageUpdate = (updatedImages) => {
    setProductImages(updatedImages); // Update state with new images
    console.log("Updated images:", updatedImages, productImages);
  };

  const updateProductField = (productId, field, action) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.product_id === productId) {
          let updatedField = product[field];

          if (Array.isArray(updatedField)) {
            // Handle array-based fields (e.g., variants, tags)
            switch (action.type) {
              case "add":
                updatedField = [...updatedField, action.payload];
                break;
              case "delete":
                updatedField = updatedField.filter(
                  (_, index) => index !== action.index
                );
                break;
              case "update":
                updatedField = updatedField.map((item, index) =>
                  index === action.index ? { ...item, ...action.payload } : item
                );
                break;
              default:
                console.warn("Unknown action type:", action.type);
            }
          } else {
            // Handle direct updates for non-array fields
            updatedField = action.payload;
          }

          return { ...product, [field]: updatedField };
        }
        return product;
      })
    );
  };

  const renderFooter = () =>
    (isEndReached || loading) && (
      <View className="flex justify-center items-center py-4">
        <ActivityIndicator size="large" color="#00f" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="w-full h-14 justify-center items-center px-4 flex-row">
        <TouchableOpacity className="pr-1" onPress={() => handleGoBack()}>
          <Icon name="chevron-back-circle-outline" size={32} color="black" />
        </TouchableOpacity>
        <View className="w-11/12 h-12 border border-[#2217bd] rounded-lg justify-center items-center px-4 bg-[#0c3ea1] flex-row">
          <TextInput
            className="text-base flex-1 text-white font-psemibold"
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity onPress={handleApplyTag}>
            <Image source={icons.search} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <Text className="text-center text-gray-500">Loading products...</Text>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) =>
          item && (
            <View>
              <RenderProduct
                item={item}
                handleSelectProduct={handleSelectProduct}
                selectedProducts={selectedProducts}
                updateProductField={updateProductField}
                handleSelectedDelete={handleSelectedDelete}
                selectedDelete={selectedDelete}
                handleselectedDeleteImage={handleselectedDeleteImage}
                selectedDeleteImage={selectedDeleteImage}
                onImageUpdate={handleImageUpdate}
              />
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyState title="No Products Found" />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
      {selectedProducts.length > 0 && (
        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-blue-600 p-4 mt-4 rounded-lg"
        >
          <Text className="text-center text-white font-semibold">
            Update Selected Products
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UpdateProducts;
