import { getUniqueSizes } from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SizeFilterB = ({ onSizeSelect }) => {
  const [sizes, setSizes] = useState([]); // Store unique sizes
  const [selectedSizes, setSelectedSizes] = useState([]); // Track selected sizes as an array

  // Fetch unique sizes from Firestore when the component mounts
  useEffect(() => {
    const fetchSizes = async () => {
      const uniqueSizes = await getUniqueSizes();  // Fetch sizes from Firestore
      setSizes(uniqueSizes);  // Update state with unique sizes
    };
    
    fetchSizes();
  }, []);

  // Handle size button click to add or remove sizes from the selected array
  const handleSizeSelect = (size) => {
    setSelectedSizes((prevSelectedSizes) => {
      // If the size is already selected, remove it, otherwise add it
      if (prevSelectedSizes.includes(size)) {
        return prevSelectedSizes.filter((selectedSize) => selectedSize !== size);
      } else {
        return [...prevSelectedSizes, size];
      }
    });
  };

  // Notify parent about the selected sizes
  useEffect(() => {
    if (onSizeSelect) {
      onSizeSelect(selectedSizes);  // Send selected sizes to parent
    }
  }, [selectedSizes, onSizeSelect]);

  return (
    <View>
      <Text>Select Sizes:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            onPress={() => handleSizeSelect(size)}
            style={{
              backgroundColor: selectedSizes.includes(size) ? 'blue' : 'gray',
              margin: 5,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white' }}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SizeFilterB;
