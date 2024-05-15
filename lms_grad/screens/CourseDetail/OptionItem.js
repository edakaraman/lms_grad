import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
export default function OptionItem({icon,value}) {
  return (
       <View className="flex flex-row items-center gap-1 mt-1 ml-2">
        <Ionicons name={icon} size={18} color="black" />
        <Text> {value} </Text>
      </View>
  )
}