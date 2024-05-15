import {View, Text,TouchableOpacity,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useNavigation } from "@react-navigation/native";
/** kaldırılacak */
import { removeItem } from '../utils/asyncStorage';
import styles from "../styles/HomeScreen.style"


const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  }
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  }

  // //kaldırılacak.
  // const handleReset = async ()=>{
  //   await removeItem('onboarded');
  //   navigation.push('Onboarding');
  // }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View style={styles.lottie}>
        <Image
          className="rounded-lg mt-12"
          source={require("../assets/images/home.jpg")}
        />
      </View>
      <Text style={styles.text}>
         Online Öğrenme Dünyasına 
         Hoş Geldiniz! 
      </Text>
      <Text className="ml-4 text-lg">
        Kaydol, sen de online öğrenme dünyasına bir bilet al.
      </Text>
      <View style={styles.endContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.routeText}>Kaydol / </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.routeText}>Giriş Yap </Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity onPress={handleReset}>
        <Text>Reset</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default HomeScreen;


