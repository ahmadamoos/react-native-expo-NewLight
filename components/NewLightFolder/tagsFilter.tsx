import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const TagFilter = ({ onTagSelect }) => {
  const tagsMain = [
    "ثريات",
    "مفاتيح كهربائيه",
    "اضائه",
    "LID",
    "اسلاك",
    "خارجي",
    "up down",
  ];

  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    setSelectedTags(updatedTags);
    if (onTagSelect) {
      onTagSelect(updatedTags);
    }
  };

  return (
    <View className="p-4 bg-[#021b36] rounded-lg shadow-lg">
      <Text className="text-white text-xl font-semibold mb-4">Choose Type</Text>
      <View className="flex-row flex-wrap justify-start">
        {tagsMain.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={{
              margin: 5,
              borderWidth: selectedTags.includes(tag) ? 2 : 1,
              borderColor: selectedTags.includes(tag) ? "#FFD700" : "#6c6b6d",
              borderRadius: 10,
              backgroundColor: "#0C1A2A",
              paddingHorizontal: 10,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: selectedTags.includes(tag) ? "bold" : "normal",
                fontSize: 14,
              }}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TagFilter;
