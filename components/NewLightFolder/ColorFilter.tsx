import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ColorFilter = ({ onColorSelect }) => {
  const colors = [
    { name: "اسود", colo: "#000000" },
    { name: "ذهبي", colo: "#FFD700" },
    { name: "ابيض", colo: "#FFFFFF" },
    { name: "اصفر", colo: "#FFFF00" },
    { name: "احمر", colo: "#FF0000" },
    { name: "ازرق", colo: "#0000FF" },
    { name: "اخضر", colo: "#008000" },
    { name: "زهري", colo: "#800080" },
  ];

  const [selectedColors, setSelectedColors] = useState([]);

  const toggleColor = (colorName) => {
    let updatedColors;
    if (selectedColors.includes(colorName)) {
      updatedColors = selectedColors.filter((c) => c !== colorName);
    } else {
      updatedColors = [...selectedColors, colorName];
    }
    setSelectedColors(updatedColors);
    if (onColorSelect) {
      onColorSelect(updatedColors);
    }
  };

  return (
    <View className="p-4 bg-[#021b36] rounded-lg shadow-lg">
      <Text className="text-white text-xl font-semibold mb-4">
        Choose Colors
      </Text>
      <View className="flex-row flex-wrap justify-start">
        {colors.map((color) => (
          <TouchableOpacity
            key={color.name}
            onPress={() => toggleColor(color.name)}
            style={{
              margin: 5,
              borderWidth: selectedColors.includes(color.name) ? 2 : 1,
              borderColor: selectedColors.includes(color.name)
                ? color.colo
                : "#6c6b6d",
              borderRadius: 10,
              backgroundColor: "#0C1A2A",
              paddingHorizontal: 10,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: color.colo,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: selectedColors.includes(color.name)
                  ? "bold"
                  : "normal",
                fontSize: 14,
              }}
            >
              {color.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ColorFilter;
