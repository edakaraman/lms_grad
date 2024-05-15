import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from "./Button.style"

const Button = ({text,onPress}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.txt}> {text} </Text>
    </TouchableOpacity>
  )
}

export default Button