import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Checkbox from "expo-checkbox";
import TagInputComponent from "./TagInputComponent";
import icons from "@/constants/icons";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "react-native-image-crop-picker";
const RenderProduct = ({
  item,
  handleSelectProduct,
  selectedProducts,
  updateProductField,
  selectedDelete,
  handleSelectedDelete,
  handleselectedDeleteImage,
  selectedDeleteImage,
  onImageUpdate,
}) => {
  const [newImage, setNewImage] = useState([]);
  const [toggledImages, setToggledImages] = useState([]);
  const [pro, setPro] = useState([]);

  const openPicker = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true, // Allow selecting multiple images
      });

      console.log(result); // Check the structure of the result

      if (result && Array.isArray(result) && result.length > 0) {
        const newImages = result.map(
          (asset) => asset.path // Image URI
          // Associate with current product_id
        );

        setNewImage((prevImage) => [...prevImage, ...newImages]); // Add new images to the state
      } else {
        Alert.alert("Error", "Please select image files.");
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };
  const clearImage = (uri) => {
    setNewImage((prevState) => prevState.filter((image) => image !== uri));
  };
  useEffect(() => {
    if (newImage.length > 0) {
      const updatedImages = newImage.map((image) => ({
        image_gs: image,
        product_id: item.product_id,
      }));

      if (onImageUpdate) {
        onImageUpdate(updatedImages); // Pass updated images to the parent
      }
    }
  }, [newImage, item]);

  const handleInputChange = (field, value) => {
    updateProductField(item.product_id, field, {
      type: "update",
      payload: value,
    });
  };
  const handleImageToggle = (image) => {
    const isToggled = toggledImages.includes(image.image_gs);

    if (isToggled) {
      // If image is toggled, restore image_gs to the product
      setToggledImages((prev) => prev.filter((img) => img !== image.image_gs));
      updateProductField(item.product_id, "images", {
        type: "update",
        payload: item.images.map((img) =>
          img.image_gs === image.image_gs
            ? { ...img, image_gs: image.image_gs }
            : img
        ),
      });
    } else {
      // If image is not toggled, remove image_gs from the product
      setToggledImages((prev) => [...prev, image.image_gs]);
      updateProductField(item.product_id, "images", {
        type: "update",
        payload: item.images.map((img) =>
          img.image_gs === image.image_gs ? { ...img, image_gs: null } : img
        ),
      });
    }
  };
  const addNewVariant = () => {
    const newVariant = {
      color: "",
      size: "",
      price: 0,
      quantity: 0,
      in_stock: true,
    };
    updateProductField(item.product_id, "variants", {
      type: "add",
      payload: newVariant,
    });
  };
  const addNewTag = () => {
    const newTag = {
      tags_name: "",
    };

    updateProductField(item.product_id, "tags", {
      type: "add",
      payload: newTag,
    });
  };
  if (!item.product_id) {
    return null; // Handle the case where item is undefined
  } else {
    return (
      <View>
        <View
          className={`${
            selectedDelete.includes(item.product_id || item.images)
              ? "bg-red-500"
              : "bg-white"
          } p-4 mb-4 rounded-lg shadow flex-col`}
        >
          {/* Checkbox Row */}
          <View className="flex-row items-start">
            <Checkbox
              value={selectedProducts.includes(item.product_id)}
              onValueChange={() => handleSelectProduct(item.product_id)}
              className="mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {item.product_name}
              </Text>
            </View>
          </View>

          {/* Editable Product Fields */}
          {selectedProducts.includes(item.product_id) && (
            <View className="mt-4">
              <View className="flex-row items-center mb-5">
                <Checkbox
                  value={selectedDelete.includes(item.product_id)}
                  onValueChange={() => handleSelectedDelete(item.product_id)}
                  className="mr-4 "
                />
                <Text>🗑️</Text>
              </View>
              {/* Image Section */}
              <View className="flex-row flex-wrap ">
                {item.images.map((image, index) => {
                  const isSelected = selectedDeleteImage.some(
                    (ima) =>
                      ima.image_id === image.image_id &&
                      ima.product_id === item.product_id
                  );

                  return (
                    <View
                      className={`p-2 ${
                        isSelected ? "bg-red-500" : "bg-gray-200"
                      } rounded-lg mb-2`}
                      key={`${item.product_id}-image-${index}`}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          handleselectedDeleteImage(image, item.product_id)
                        }
                      >
                        <Image
                          source={{ uri: image.image_url }}
                          className="w-36 h-40 object-cover"
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              <View className="mt-7 space-y-2">
                <Text className="text-base font-pmedium text-black">
                  Upload Images
                </Text>
                <TouchableOpacity onPress={openPicker}>
                  {newImage.length > 0 ? (
                    <View className="space-x-2">
                      {newImage.map((imageUri, index) => (
                        <View key={index} className="relative">
                          <Image
                            source={{ uri: imageUri }}
                            className="w-36 h-40 rounded-2xl"
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 16,
                              marginBottom: 20,
                            }}
                            resizeMode="contain"
                          />
                          <TouchableOpacity
                            onPress={() => clearImage(imageUri)}
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              borderRadius: 20,
                              padding: 5,
                            }}
                          >
                            <Icon name="close-circle" size={30} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="w-full h-64 px-4 bg-[#313f5a] border border-dashed border-gray-400 rounded-3xl justify-center items-center">
                      <View className="w-14 h-14 border border-dashed border-stone-200 justify-center items-center">
                        <Image
                          source={icons.upload}
                          className="w-1/2 h-1/2"
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <Text>اسم المنتج: </Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-2"
                value={item.product_name}
                onChangeText={(text) => handleInputChange("product_name", text)}
                placeholder="Edit product name"
              />
              <Text>الوصف:</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-2"
                value={item.product_description}
                onChangeText={(text) =>
                  handleInputChange("product_description", text)
                }
                placeholder="Edit product description"
              />
              {/* tags Section */}
              <Text className="font-bold text-gray-800 mt-4">Tags:</Text>
              <View>
                {item.tags.map((tag, index) => (
                  <View
                    key={`${item.product_id}-tag-${index}`}
                    className="p-2 bg-gray-200 rounded-lg mb-2"
                  >
                    <TextInput
                      className="border border-gray-300 rounded p-2 mb-2"
                      value={tag.tags_name || ""}
                      onChangeText={(text) =>
                        updateProductField(item.product_id, "tags", {
                          type: "update",
                          index,
                          payload: { ...tag, tags_name: text }, // Use the correct property name
                        })
                      }
                      placeholder="Edit tag name"
                    />
                    {/* Delete Tag Button */}
                    <TouchableOpacity
                      onPress={() =>
                        updateProductField(item.product_id, "tags", {
                          type: "delete",
                          index,
                        })
                      }
                      className="bg-red-500 rounded p-2"
                    >
                      <Text className="text-white">Delete Tag</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={addNewTag}
                className="bg-blue-500 rounded p-2 mt-2"
              >
                <Text className="text-white">Add New Tag</Text>
              </TouchableOpacity>
              {/* Variants Section */}
              <Text className="font-bold text-gray-800 mt-4">Variants:</Text>
              <View>
                {item.variants.map((variant, index) => (
                  <View
                    key={`${item.product_id}-variant-${index}`}
                    className="p-2 bg-gray-200 rounded-lg mb-2"
                  >
                    <Text>اللون: </Text>
                    <TextInput
                      className="border border-gray-300 rounded p-2 mb-2"
                      value={variant.color || ""}
                      onChangeText={(text) =>
                        updateProductField(item.product_id, "variants", {
                          type: "update",
                          index,
                          payload: { ...variant, color: text },
                        })
                      }
                      placeholder="Edit variant color"
                    />
                    <Text>الحجم: </Text>
                    <TextInput
                      className="border border-gray-300 rounded p-2 mb-2"
                      value={variant.size || ""}
                      onChangeText={(text) =>
                        updateProductField(item.product_id, "variants", {
                          type: "update",
                          index,
                          payload: { ...variant, size: text },
                        })
                      }
                      placeholder="Edit variant size"
                    />
                    <Text>السعر: </Text>
                    <TextInput
                      className="border border-gray-300 rounded p-2 mb-2"
                      value={`${variant.price || ""}`}
                      onChangeText={(text) =>
                        updateProductField(item.product_id, "variants", {
                          type: "update",
                          index,
                          payload: {
                            ...variant,
                            price: parseFloat(text) || 0,
                          },
                        })
                      }
                      placeholder="Edit variant price"
                      keyboardType="numeric"
                    />
                    <Text>الكمية: </Text>
                    <TextInput
                      className="border border-gray-300 rounded p-2 mb-2"
                      value={`${variant.quantity || ""}`}
                      onChangeText={(text) =>
                        updateProductField(item.product_id, "variants", {
                          type: "update",
                          index,
                          payload: {
                            ...variant,
                            quantity: parseInt(text) || 0,
                          },
                        })
                      }
                      placeholder="Edit variant quantity"
                      keyboardType="numeric"
                    />
                    {/* Delete Variant Button */}
                    <TouchableOpacity
                      onPress={() =>
                        updateProductField(item.product_id, "variants", {
                          type: "delete",
                          index,
                        })
                      }
                      className="bg-red-500 px-4 py-2 rounded-md mt-2"
                    >
                      <Text className="text-white">Delete Variant</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Add Variant Button */}
              <TouchableOpacity
                onPress={addNewVariant}
                className="bg-blue-500 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-white">Add Variant</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
};

export default RenderProduct;
