import { getUniqueSizes } from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SizeFilterB = ({onSizeSelect}) => {
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
    let sizea = [];
if (selectedSizes.includes(size)) {
    sizea = selectedSizes.filter((selectedSize) => selectedSize !== size);
  } else {
    sizea = [...selectedSizes, size];
  }
    setSelectedSizes(sizea);
    if(onSizeSelect) {
        onSizeSelect(sizea);
        console.log(sizea);

    }
    
  };

  return (
    <View>
      <Text>Select Sizes:</Text>
      <View className='flex-row items-center flex-wrap p-4 justify-start bg-[#021b36] rounded-lg '>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            onPress={() => handleSizeSelect(size)}
            style={{
              borderWidth: 2,
              borderColor: selectedSizes.includes(size) ? 'gold' : 'gray',
               // Highlight selected sizes
              margin: 5,
              padding: 8,
              borderRadius: 5,
            }}
          >
            <Text className='text-white text-base '>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SizeFilterB;
