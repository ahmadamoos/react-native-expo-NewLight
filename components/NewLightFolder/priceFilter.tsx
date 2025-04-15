import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const PriceFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([100, 1900]); // Initial range

  const handleValueChange = (values) => {
    setPriceRange(values);
    if (onFilterChange) {
      onFilterChange({ minprice: values[0], maxprice: values[1] });
    }
  };

  return (
    <View className="p-4 bg-[#021b36] rounded-lg">
      <Text className="text-white text-lg font-bold">Price Range</Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-white">${priceRange[0]}</Text>
        <Text className="text-white">${priceRange[1]}</Text>
      </View>
      <MultiSlider
        values={priceRange}
        onValuesChange={handleValueChange}
        
        min={0}
        max={2000}
        step={25}
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

export default PriceFilter;
