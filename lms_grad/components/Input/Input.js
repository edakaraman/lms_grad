import { View, Text ,TextInput,SafeAreaView} from 'react-native'
import React from 'react'
import styles from "./Input.style"


const Input = ({label,placeholder,onChangeText,value}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}> {label}</Text>
      <View style={styles.input_container}>
        <TextInput placeholder={placeholder}  onChangeText={onChangeText} value={value} />
      </View>
    </SafeAreaView>
  )
}

export default Input