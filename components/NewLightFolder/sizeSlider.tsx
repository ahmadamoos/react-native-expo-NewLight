import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const SizeFilterSlider = ({ onFilterChange }) => {
  const [sizeRange, setSizeRange] = useState([30, 290]); // Initial range

  const handleValueChange = (values) => {
    setSizeRange(values);
    if (onFilterChange) {
      onFilterChange({ minSize: values[0], maxSize: values[1] });
    }
  };

  return (
    <View className="p-4 bg-[#021b36] rounded-lg">
      <Text className="text-white text-lg font-bold">Size Range</Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-white">{sizeRange[0]} cm</Text>
        <Text className="text-white">{sizeRange[1]} cm</Text>
      </View>
      <MultiSlider
        values={sizeRange}
        onValuesChange={handleValueChange}
        min={20} // Minimum size value
        max={300} // Maximum size value
        step={5} // Step value
        allowOverlap={false}
        snapped
        sliderLength={300} // Adjust slider length to fit your design
        markerStyle={{
          height: 20,
          width: 20,
          borderRadius: 10,
          backgroundColor: '#4CAF50',
        }}
        selectedStyle={{
          backgroundColor: '#5D4EE0',
        }}
        unselectedStyle={{
          backgroundColor: '#D3D3D3',
        }}
      />
    </View>
  );
};

export default SizeFilterSlider;
