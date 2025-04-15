import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CostomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-blue-500 rounded-lg px-4 py-2 text-center justify-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading} >
          <Text className={`text-primary font-psemibold text-lg text-center justify-center ${textStyles}`}>{ title}</Text>
    </TouchableOpacity>
  )
}

export default CostomeButton