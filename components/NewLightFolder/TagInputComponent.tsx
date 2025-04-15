import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const TagInputComponent = ({ tags = [], setTags, name = [], tagdata = [] }) => {
    const [text, setText] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [pendingNames, setPendingNames] = useState([...name]); // Hold `name` values until "Add" is pressed

    // Add unique tags or edit existing tags
    const addTag = (newTag = text.trim()) => {
        if (newTag && !tags.includes(newTag)) {
            const updatedTags = [...tags];
            if (editIndex !== null) {
                updatedTags[editIndex] = newTag;
                setEditIndex(null);
            } else {
                updatedTags.push(newTag);
            }
            setTags(updatedTags); // Update parent state
            setText(''); // Clear input field
        }
    };

    // Remove tag from the list
    const removeTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags); // Update parent state
    };

    // Start editing a tag
    const editTag = (index) => {
        setText(tags[index]);
        setEditIndex(index);
    };

    // Add pending names when "Add" is pressed
    const addPendingNames = () => {
        setPendingNames([...name]);
        const uniqueNames = pendingNames.filter((n) => !tags.includes(n));
        if (uniqueNames.length > 0) {
            setTags([...tags, ...uniqueNames]);
        }
        
    };

    return (
        <View className="flex-1 p-4 bg-gray-800">
            {/* Render current tags */}
            <FlatList
                data={tags}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        className="flex-row items-center bg-blue-600 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                        <TouchableOpacity onPress={() => editTag(index)}>
                            <Text className="text-white text-sm">{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeTag(index)}>
                            <Text className="text-white text-sm ml-2">X</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Input field for new tags */}
            <View className="flex-row items-center space-x-2 mt-4">
                <TextInput
                    className="flex-1 bg-gray-700 text-white p-3 rounded-md"
                    placeholder="Add a tag"
                    placeholderTextColor="#A9A9A9"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={() => addTag(text)}
                />
                <TouchableOpacity
                    onPress={() => addTag(text)}
                    className="bg-green-500 px-4 py-3 rounded-md"
                >
                    <Text className="text-white text-sm font-semibold">
                        {editIndex !== null ? 'Update' : 'Add'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Display tagdata for quick selection */}
            <View  className="flex-row flex-wrap mt-4">
    {tagdata.map((tag, index) =>
        tag.tagsMain.map((tagItem, subIndex) => ( // Loop through each item in tagsMain
            <TouchableOpacity
                key={`${index}-${subIndex}`} // Unique key for each item
                onPress={() => addTag(tagItem)} // Add individual tag
                className="bg-blue-600 px-3 py-1 rounded-full mr-2 mb-2"
            >
                <Text className="text-white text-sm">{tagItem}</Text>
            </TouchableOpacity>
        ))
    )}
</View>

            {/* Add pending names */}
            <View className="mt-4">
                <TouchableOpacity
                    onPress={addPendingNames}
                    className="bg-yellow-500 px-4 py-3 rounded-md"
                >
                    <Text className="text-white text-sm font-semibold">Add Names</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TagInputComponent;
