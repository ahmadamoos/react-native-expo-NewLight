import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Dimensions,
  Text,
  Animated,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 4 - 20;

const ImageAdsUiUx = ({
  ads,
  imageselcted,
  togglechosenImage,
  mainAds,
  apper,
  toggleapper,
  chosennumber,
  toggledeletAds,
  deletAds,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mainNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleNumberSelect = (number, itemId) => {
    chosennumber(itemId, number);
    fadeOut();
    setTimeout(() => toggleapper(), 200);
  };

  const renderNumberSelector = () => (
    <Modal
      transparent={true}
      visible={apper}
      animationType="fade"
      onRequestClose={() => {
        toggleapper();
        fadeOut();
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => {
            toggleapper();
            fadeOut();
          }}
        />
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            },
          ]}
        >
          <Text style={styles.modalTitle}>Select Slot</Text>
          <View style={styles.numbersContainer}>
            {mainNumbers.map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumberSelect(number, selectedItem)}
                style={styles.numberButton}
                activeOpacity={0.7}
              >
                <Text style={styles.numberText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderAdItem = ({ item }) => (
    <View>
      <View>
        <View
          className={`absolute top-2 left-0.2 border rounded-full ${
            deletAds.includes(item)
              ? "border-red-500 bg-red-600"
              : "border-transparent bg-white"
          }  `}
        >
          <TouchableOpacity onPress={() => toggledeletAds(item)}>
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        key={item.id}
        className="mx-2 items-center mb-4"
        style={{
          width: screenWidth / 3 - 26,
          position: "relative",
          minHeight: 200,
        }}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            onPressIn={animatePress}
            onPress={() => {
              togglechosenImage(item.id);
              setSelectedItem(item.id);
            }}
            activeOpacity={0.7}
          >
            <View
              className={`border-2 rounded-xl p-1 ${
                imageselcted.includes(item.id)
                  ? "border-amber-400 bg-amber-100"
                  : "border-slate-600 bg-slate-800"
              }`}
              style={{
                width: imageSize,
                height: imageSize,
                shadowColor: imageselcted.includes(item.id)
                  ? "#F59E0B"
                  : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Image
                source={{ uri: item.publicUrl }}
                className="rounded-lg"
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text
          className="text-white font-medium mt-2 text-center"
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSelectedItem(item.id);
            toggleapper();
            fadeIn();
          }}
          className={`mt-1 px-3 py-1 rounded-full ${
            item.number ? "bg-emerald-600" : "bg-slate-600"
          }`}
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold">
            {item.number ? `Slot ${item.number}` : "Assign Slot"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMainAdItem = (item) => (
    <View key={item.id} className="mx-2 items-center">
      <TouchableOpacity activeOpacity={0.8}>
        <View
          className="border-2 border-amber-500 bg-amber-50 rounded-xl p-1"
          style={{
            width: imageSize,
            height: imageSize,
            shadowColor: "#F59E0B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Image
            source={{ uri: item.publicUrl }}
            className="rounded-lg"
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      <Text className="text-white font-medium mt-2 text-center">
        {item.name}
      </Text>
      <View className="mt-1 px-3 py-1 bg-amber-500 rounded-full">
        <Text className="text-white font-bold">Slot {item.number}</Text>
      </View>
    </View>
  );

  return (
    <View className="bg-slate-900 rounded-md">
      {/* Premium Slots Section */}
      <View className="p-4 pb-0">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-amber-400">
            Premium Slots
          </Text>
          <View className="bg-amber-500 px-2 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">
              Numbers 1-9 Reserved
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {mainAds.map(renderMainAdItem)}
        </ScrollView>
      </View>

      {/* Available Slots Section */}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-emerald-400">
            Available Slots
          </Text>
          <View className="bg-emerald-600 px-2 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">
              {ads.length - mainAds.length} Items Available
            </Text>
          </View>
        </View>
        <FlatList
          data={ads}
          renderItem={renderAdItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ paddingRight: 20 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {renderNumberSelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    width: screenWidth - 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  numberButton: {
    width: 48,
    height: 48,
    margin: 8,
    backgroundColor: "#334155",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ImageAdsUiUx;
