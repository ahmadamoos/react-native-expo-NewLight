import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
} from "react-native";

const UpdateProductCard = ({
  data: {
    id,
    name = "",
    price = 0,
    description = "",
    images = {},
    variations = {},
    tags = {},
  },
  handleChange,
  handleSaveChanges,
  handleAddField,
  handleRemoveField,
}) => {
  const imageUrls = Object.values(images || {});
  const variationKeys = Object.keys(variations || {});
  const tagKeys = Object.keys(tags || {});

  return (
    <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <FlatList
        data={imageUrls}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            className="w-72 h-64 rounded-lg mr-4"
            resizeMode="contain"
          />
        )}
      />
      <Text className="text-sm font-semibold text-gray-700 mt-4">Name:</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
        defaultValue={name}
        onChangeText={(text) => handleChange(id, "name", text)}
        placeholder="Enter product name"
      />

      <Text className="text-sm font-semibold text-gray-700 mt-4">Price:</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
        defaultValue={String(price || "")}
        keyboardType="numeric"
        onChangeText={(text) => handleChange(id, "price", Number(text))}
        placeholder="Enter price"
      />

      <Text className="text-sm font-semibold text-gray-700 mt-4">
        Description:
      </Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
        defaultValue={description || ""}
        onChangeText={(text) => handleChange(id, "description", text)}
        placeholder="Enter description"
        multiline
        numberOfLines={4}
      />

      <Text className="text-sm font-semibold text-gray-700 mt-4">
        Variations:
      </Text>
      {variationKeys.map((key) => {
        const variation = variations[key];
        return (
          <View key={key} className="mb-4">
            <Text className="text-sm font-semibold text-gray-700">{`Variation ${key}`}</Text>

            <TextInput
              className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
              defaultValue={variation?.color || ""}
              onChangeText={(text) =>
                handleChange(id, `variations.${key}.color`, text)
              }
              placeholder="Enter color"
            />

            <TextInput
              className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
              defaultValue={String(variation?.size || "")}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleChange(id, `variations.${key}.size`, Number(text))
              }
              placeholder="Enter size"
            />

            <Text className="text-sm font-semibold text-gray-700">
              In Stock:
            </Text>
            <Switch
              value={variation?.instock || false}
              onValueChange={(value) =>
                handleChange(id, `variations.${key}.instock`, value)
              }
            />

            <Text className="text-sm font-semibold text-gray-700 mt-4">
              Quantity:
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
              defaultValue={String(variation?.quantity || "")}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleChange(id, `variations.${key}.quantity`, Number(text))
              }
              placeholder="Enter quantity"
            />

            <TouchableOpacity
              onPress={() => handleRemoveField(id, `variations.${key}`)}
              className="bg-red-500 p-2 rounded-md mt-2"
            >
              <Text className="text-white text-center">Remove Variation</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      <TouchableOpacity
        onPress={() => handleAddField(id, "variations")}
        className="bg-blue-500 p-2 rounded-md mt-2"
      >
        <Text className="text-white text-center">Add Variation</Text>
      </TouchableOpacity>

      <Text className="text-sm font-semibold text-gray-700 mt-4">Tags:</Text>
      {tagKeys.map((key) => (
        <View key={key} className="mb-4">
          <Text className="text-sm font-semibold text-gray-700">{`Tag ${key}`}</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2 text-gray-800 mb-3"
            defaultValue={tags[key] || ""}
            onChangeText={(text) => handleChange(id, `tags.${key}`, text)}
            placeholder={`Update tag ${key}`}
          />
          <TouchableOpacity
            onPress={() => handleRemoveField(id, `tags.${key}`)}
            className="bg-red-500 p-2 rounded-md mt-2"
          >
            <Text className="text-white text-center">Remove Tag</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => handleAddField(id, "tags")}
        className="bg-blue-500 p-2 rounded-md mt-2"
      >
        <Text className="text-white text-center">Add Tag</Text>
      </TouchableOpacity>

      <Button
        title="Save Changes"
        onPress={() => handleSaveChanges(id)}
        color="#1D4ED8"
      />
    </View>
  );
};

export default UpdateProductCard;
