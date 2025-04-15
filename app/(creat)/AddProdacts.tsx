import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";
import FormFieldw from "@/components/NewLightFolder/formfieldw";
import CostomeButton from "@/components/NewLightFolder/CostomeButton";
import TagInputComponent from "@/components/NewLightFolder/TagInputComponent";
import icons from "@/constants/icons";
import uploadProduct from "../../lib/aploadImage";

const AddProducts = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    images: [],
    stock: 0,
    tags: [],
    variations: [],
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 60;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [20, headerHeight],
    outputRange: [10, -headerHeight],
    extrapolate: "clamp",
  });

  // Open image picker
  const openPicker = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true,
      });

      if (result && result.length > 0) {
        const newImages = result.map((asset) => asset.path);
        setForm((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...newImages],
        }));
      } else {
        Alert.alert("Error", "Please select image files.");
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  // Clear an image
  const clearImage = (uri) => {
    setForm((prevState) => ({
      ...prevState,
      images: prevState.images.filter((image) => image !== uri),
    }));
  };

  // Add a new variation
  const addVariation = () => {
    setForm((prevState) => ({
      ...prevState,
      variations: [
        ...prevState.variations,
        { color: "", size: "", price: null, quantity: null, inStock: true },
      ],
    }));
  };

  // Handle variation field changes
  const handleVariationChange = (index, field, value) => {
    setForm((prevState) => {
      const updatedVariations = [...prevState.variations];
      updatedVariations[index][field] = value;
      updatedVariations[index].inStock = true;
      return { ...prevState, variations: updatedVariations };
    });
  };

  // Submit the form
  const submit = async () => {
    if (
      !form.title ||
      !form.description ||
      form.images.length === 0 ||
      form.tags.length === 0 ||
      form.variations.length === 0
    ) {
      Alert.alert("Error", "Please fill in all fields and upload images.");
      return;
    }

    for (const variation of form.variations) {
      if (
        !variation.color ||
        !variation.size ||
        !variation.price ||
        !variation.quantity
      ) {
        Alert.alert(
          "Error",
          "Please ensure all variation fields are filled, including price."
        );
        return;
      }
    }

    const productData = {
      name: form.title,
      description: form.description,
      images: form.images,
      tags: form.tags,
      variations: form.variations.map((variation) => ({
        ...variation,
        price: parseFloat(variation.price),
        quantity: parseInt(variation.quantity, 10) || 10,
      })),
    };

    try {
      console.log("Submitting product data:", productData);
      await uploadProduct(productData);
      Alert.alert("Success", "Product added successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error", "There was an issue creating the product.");
    }
  };

  // Render variation fields
  const renderVariation = ({ item, index }) => (
    <View key={index} className="space-y-4 mt-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-100">تفاصيل {index + 1}</Text>
        <TouchableOpacity
          onPress={() => {
            setForm((prevState) => ({
              ...prevState,
              variations: prevState.variations.filter((_, i) => i !== index),
            }));
          }}
          style={{ padding: 5, backgroundColor: "#FF6B6B", borderRadius: 8 }}
        >
          <Text className="text-white">حذف</Text>
        </TouchableOpacity>
      </View>
      <FormFieldw
        title="اللون"
        value={item.color}
        placeholder="أدخل اللون"
        handleChangeText={(text) => handleVariationChange(index, "color", text)}
      />
      <FormFieldw
        title="الحجم"
        value={item.size}
        placeholder="أدخل الحجم"
        handleChangeText={(text) => handleVariationChange(index, "size", text)}
      />
      <FormFieldw
        title="السعر"
        value={item.price}
        placeholder="أدخل السعر"
        handleChangeText={(text) => handleVariationChange(index, "price", text)}
      />
      <FormFieldw
        title="الكمية"
        value={item.quantity}
        placeholder="أدخل الكمية"
        handleChangeText={(text) =>
          handleVariationChange(index, "quantity", parseInt(text, 10) || 0)
        }
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-[#1f2633] pb-2 h-full" dir="rtl">
      <StatusBar barStyle="light-content" backgroundColor="#5d4ee0" />

      {/* Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
          position: "absolute",
          top: 20,
          width: "100%",
          zIndex: 10,
          paddingHorizontal: 16,
          backgroundColor: "#5d4ee0",
          borderRadius: 12,
        }}
        className="flex-row items-center justify-between py-3 px-4"
      >
        <TouchableOpacity onPress={() => router.replace("/home")}>
          <Icon name="chevron-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <View className="items-center w-[86%]">
          <Text className="text-xl text-white text-center">
            إضافة منتج جديد
          </Text>
        </View>
      </Animated.View>

      {/* Main Content */}
      <FlatList
        data={[{ key: "content" }]} // Dummy data to render the content
        renderItem={() => (
          <View className="pt-10 px-4">
            {/* Product Name */}
            <FormFieldw
              title="اسم المنتج"
              value={form.title}
              placeholder="أدخل اسم المنتج"
              handleChangeText={(text) =>
                setForm((prevState) => ({ ...prevState, title: text }))
              }
              otherStyles="mt-10"
            />

            {/* Product Images */}
            <View className="mt-7 space-y-2 flex">
              <View className="items-center">
                <Text className="text-base font-pmedium text-gray-100 text-center">
                  صور المنتج
                </Text>
              </View>
              <TouchableOpacity onPress={openPicker}>
                {form.images.length > 0 ? (
                  <View className="space-x-2">
                    {form.images.map((imageUri, index) => (
                      <View key={index} className="relative">
                        <Image
                          source={{ uri: imageUri }}
                          className="w-60 h-60 rounded-2xl"
                          style={{
                            width: "100%",
                            height: 200,
                            borderRadius: 16,
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

            {/* Product Description */}
            <FormFieldw
              title="وصف المنتج"
              value={form.description}
              placeholder="أدخل وصف المنتج"
              handleChangeText={(text) =>
                setForm((prevState) => ({ ...prevState, description: text }))
              }
              otherStyles="mt-10"
            />

            {/* Product Variations */}
            <Text className="text-base text-gray-100 mt-6 text-center">
              تفاصيل المنتج
            </Text>
            <FlatList
              data={form.variations}
              renderItem={renderVariation}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* Add Variation Button */}
            <TouchableOpacity
              onPress={addVariation}
              className="bg-[#5d4ee0] py-3 mt-5 rounded-lg flex-row justify-center items-center"
            >
              <Text className="text-white text-base">إضافة تفاصيل</Text>
            </TouchableOpacity>

            {/* Tags Input */}
            <TagInputComponent
              tags={form.tags}
              onChange={(tags) =>
                setForm((prevState) => ({ ...prevState, tags }))
              }
              setTags={(updatedTags) =>
                setForm((prevState) => ({ ...prevState, tags: updatedTags }))
              }
              name={[form.title, "كهربائيات"]}
              placeholder="أدخل العلامات"
              title="وسوم المنتج"
              className="mt-7"
            />

            {/* Submit Button */}
            <CostomeButton
              title="إرسال"
              handlePress={submit}
              styleClass="mt-10"
            />
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

export default AddProducts;
