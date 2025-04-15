import { View, Text, TextInput, Image } from "react-native";
import { useState } from "react";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import icons from "../../constants/icons";

const FormFieldw = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
  ...props
}) => {
  const [inputHeight, setInputHeight] = useState(40); // Default height for TextInput
  const [dynamicMarginTop, setDynamicMarginTop] = useState(4); // Initial margin-top

  // Adjust height dynamically based on content size
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setInputHeight(contentHeight); // Set height based on content height
    // Dynamically adjust the margin-top as content increases
    const newMarginTop = Math.min(4 + Math.floor(contentHeight / 10), 20); // Adjust margin-top as needed
    setDynamicMarginTop(newMarginTop); // Update margin-top
  };

  return (
    <View
      className={`space-y-2 w-full justify-center mt-${dynamicMarginTop} ${otherStyles}`}
    >
      <Text className="text-base text-gray-100 font-pmedium text-center justify-center py-4">
        {title}
      </Text>
      <View className="w-full h-16 border border-[#dd6f6f] rounded-lg justify-center items-center px-4 bg-[#0d1d3a] flex-row">
        <TextInput
          className="text-base w-full flex-1 text-white font-psemibold"
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="white"
          multiline // Allow for multiline input
          onContentSizeChange={handleContentSizeChange} // Adjust the size dynamically
          style={{ minHeight: inputHeight }} // Dynamically set the height
          {...props} // Spread other props
        />
      </View>
    </View>
  );
};

export default FormFieldw;
