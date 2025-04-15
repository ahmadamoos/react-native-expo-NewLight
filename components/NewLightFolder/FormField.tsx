import { View, Text, TextInput, Image } from "react-native";
import { useState } from "react";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import icons from "../../constants/icons";

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-80 h-16 border border-[#dd6f6f] rounded-lg justify-center items-center px-4 bg-[#0d1d3a] flex-row">
        <TextInput
          className="text-base flex-1 text-white font-psemibold"
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="white"
          keyboardType={keyboardType}
          secureTextEntry={title === "Password" && !showPassword}
          {...props} // Spread additional props to the TextInput
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-9 h-9"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
