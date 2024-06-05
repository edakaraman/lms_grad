import {View, Text,TouchableOpacity,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/HomeScreen.style"


const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  }
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  }
  
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
    </SafeAreaView>
  );
};

export default HomeScreen;


