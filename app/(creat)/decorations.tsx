import ImageAdsUiUx from "@/components/NewLightFolder/imageAdsUiUx";
import { icons } from "@/constants";
import root from "@/lib/apihttp";
import { deleteImageforads } from "@/lib/firebase";
import uploadAdsimage from "@/lib/uploadAdsImage";
import { getads, getadsreset } from "@/store/Actions/getads";
import axios from "axios";
import { set } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const SPACING = 16;
const CARD_HEIGHT = 400;
const Decorations = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]); // State for storing images
  const [name, setName] = useState(""); // State for storing the product name
  const [chosenImage, setchosenImage] = useState([]); // State for selected image IDs
  const [mainimages, setmainimages] = useState([]);
  const [apper, setapper] = useState(false);
  const [mainimages2, setmainimages2] = useState([]);
  const [deletAds, setdeletAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const { ads, hasMore, page, loading } = useSelector((state) => state.fullads);
  const onRefresh = async () => {
    setRefreshing(true);

    setdeletAds([]);
    sorteddata = [];
    await dispatch(getadsreset());
    await dispatch(getads(1));

    setRefreshing(false);
  };
  let sorteddata = [];
  useEffect(() => {
    dispatch(getads(1));
  }, []);
  const EndReache = async () => {
    if (hasMore) {
      dispatch(getads(page));
    } else {
      console.log("no more ads");
    }
  };
  useEffect(() => {
    // Filter out duplicates by creating a Map with id as key
    const uniqueAds = ads.reduce((acc, current) => {
      // If we haven't seen this id before, add it to our map
      if (!acc.has(current.id)) {
        acc.set(current.id, current);
      }
      return acc;
    }, new Map());

    // Convert the Map values back to an array
    setmainimages2(Array.from(uniqueAds.values()));
  }, [ads]);
  useEffect(() => {
    sorteddata = mainimages2.sort((a, b) => a.number - b.number);
    setmainimages(sorteddata.filter((item) => item.number <= 10));
  }, [mainimages2]);

  const toggledeletAds = (item) => {
    if (deletAds.some((ad) => ad.id === item.id)) {
      setdeletAds(deletAds.filter((ad) => ad.id !== item.id));
    } else {
      setdeletAds((prev) => [...prev, item]); // Add the whole item object
    }
  };
  const chosennumber = (idd, numberr) => {
    setmainimages2((prev) =>
      prev.map((item) =>
        item.id === idd ? { ...item, number: numberr } : item
      )
    );
  };
  const deletAdsimage = async () => {
    try {
      // First ensure deletAds is not empty and has valid items
      if (!deletAds || !Array.isArray(deletAds) || deletAds.length === 0) {
        console.error("No ads selected for deletion");
        return;
      }

      // Delete images first
      await deleteImageforads(deletAds);

      // Extract IDs safely
      const ids = deletAds
        .map((item) => item?.id)
        .filter((id) => id !== undefined);
      console.log("ids:", ids);
      if (ids.length === 0) {
        console.error("No valid IDs found in deletAds");
        return;
      }

      const response = await axios.delete(`http://${root}:3000/delete-ads`, {
        data: { ids }, // Changed from adIds to ids to match backend expectation
      });

      console.log("Deletion successful:", response.data);
      // Add any success handling here (e.g., refresh the ads list)
    } catch (error) {
      console.error("Error deleting ads:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    }
  };
  const addtoadspage = async () => {
    try {
      const promises = mainimages2.map((item) =>
        axios.put(`http://${root}:3000/update-ad-number/${item.id}`, {
          number: item.number,
        })
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        if (response.data) {
          console.log("Ad number updated successfully:", response.data.message);
        } else {
          console.error("Failed to update ad number:", response.data.error);
        }
      });
      Alert.alert("Success", "Ad numbers updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update ad number");
      console.error("Error updating ad number:", error);
    }
  };

  // Toggle selected images
  const togglechosenImage = (imageId) => {
    if (chosenImage.includes(imageId)) {
      // If the image is already selected, remove it
      setchosenImage(chosenImage.filter((id) => id !== imageId));
    } else {
      // If the image is not selected, add it
      setchosenImage((prevImage) => [...prevImage, imageId]);
    }
  };
  const toggleapper = () => {
    if (apper === true) {
      setapper(false);
    } else {
      setapper(true);
    }
  };
  // Open image picker
  const openPicker = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true, // Allow multiple image selection
      });

      if (result && result.length > 0) {
        // Extract paths from the selected images
        const newImages = result.map((image) => image.path);
        setImages((prevImages) => [...prevImages, ...newImages]); // Add new images to the existing ones
      } else {
        Alert.alert("Error", "Please select at least one image.");
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  // Clear an image
  const clearImage = (uri) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  // Save product name and images
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a product name.");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Please select at least one image.");
      return;
    }

    try {
      const data = {
        name: name,
        images: images,
      };
      uploadAdsimage(data);
      console.log("Data to be saved:", data);

      Alert.alert("Success", "Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product.");
    }
  };
  const rendercontent = (item) => {
    return (
      <View key={`ad-${item.id}`} style={styles.adsImage}>
        <Image
          source={{ uri: item.publicUrl }}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    );
  };

  return (
    <FlatList
      className="flex-1 bg-[#d5d7da] p-4"
      data={[{}]} // Dummy data to make FlatList work
      onEndReached={EndReache}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={() => (
        <>
          {/* Image Upload Section */}
          <View className="mt-7 space-y-2">
            <View className="items-center">
              <Text className="text-base font-pmedium text-black text-center">
                صور المنتج
              </Text>
            </View>
            <TouchableOpacity onPress={openPicker}>
              {images.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-2">
                    {images.map((imageUri, index) => (
                      <View key={index} className="relative">
                        <Image
                          source={{ uri: imageUri }}
                          className="w-60 h-60 rounded-2xl"
                          style={{
                            width: 200,
                            height: 200,
                            borderRadius: 16,
                            marginRight: 10,
                          }}
                          resizeMode="cover"
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
                </ScrollView>
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

          {/* Product Name Input Section */}
          <View className="mt-6">
            <View className="items-center">
              <Text className="text-base font-pmedium text-black text-center">
                اسم المنتج
              </Text>
              <TextInput
                onChangeText={setName}
                placeholder="اسم المنتج"
                className="w-full h-12 px-4 mt-2 bg-[#313f5a] rounded-lg text-white font-psemibold"
                value={name}
                placeholderTextColor="#a0a0a0"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="w-full h-12 mt-6 bg-blue-500 rounded-lg justify-center mb-3 items-center"
          >
            <Text className="text-white text-lg font-pmedium ">Save</Text>
          </TouchableOpacity>

          {/* Ads List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="bg-[#d5d7da] p-4"
          >
            {mainimages.length > 0 && mainimages.map(rendercontent)}
          </ScrollView>
          <ImageAdsUiUx
            ads={mainimages2}
            imageselcted={chosenImage}
            togglechosenImage={togglechosenImage}
            mainAds={mainimages}
            apper={apper}
            toggleapper={toggleapper}
            chosennumber={chosennumber}
            toggledeletAds={toggledeletAds}
            deletAds={deletAds}
          />

          <TouchableOpacity
            onPress={addtoadspage}
            className="w-full h-12 mt-3 mb-5 bg-blue-500 rounded-lg justify-center items-center"
          >
            <Text className="text-white text-lg font-pmedium">update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={deletAdsimage}
            className="w-full h-12 mt-3 mb-7 bg-red-500 rounded-lg justify-center items-center"
            disabled={deletAds.length === 0}
          >
            <Text className="text-white text-lg font-pmedium">Delet</Text>
          </TouchableOpacity>
        </>
      )}
      keyExtractor={() => "main"}
    />
  );
};
const styles = StyleSheet.create({
  adsImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginRight: 10,
  },
});

export default Decorations;
