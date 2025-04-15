import { View, Text , Image} from 'react-native'
import React from 'react'
import images from '@/constants/images'
import CostomeButton from './CostomeButton'

const EmptyState = ({titel}) => {
  return (
    <View className="flex-1 justify-center items-center px-4">
        <Image
        source={images.empty}
        className="w-[300px] h-[200px]"
        resizeMode="contain"
      />
      <Text className="text-white text-center text-lg font-bold mt-4">{titel}</Text>
    </View>
  )
}

export default EmptyState