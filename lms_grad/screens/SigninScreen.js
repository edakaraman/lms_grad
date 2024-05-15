import React, { useState, useContext } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { UserRoleContext } from "../context/UserRoleContext";
import { Alert } from "react-native";

export default function SignInScreen() {
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setUserRole } = useContext(UserRoleContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      Alert.alert("Giriş Bilgileriniz Hatalı!", "Lütfen giriş bilgilerinizi kontrol edin.");
      console.log(err);
    }
  };
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleResetPassword = () => {
    navigation.navigate("Reset");
  };
  const onUserRole = (role) => {
    setUserRole(role);
    setActiveIndex(role); // activeIndex değeri güncelleniyor
  };

  return (
    <View className="flex-1 justify-center bg-white">
      <Text className="text-[#1F41BB] font-bold text-3xl text-center">
        Giriş Yap
      </Text>
      <View className="flex flex-col mb-3">
        <Text className="font-bold text-xl m-3 ml-5"> Kullanıcı Grubu </Text>
        <View className="flex flex-row gap-4 ml-1">
          <TouchableOpacity
            onPress={() => onUserRole("öğrenci")}
            style={{
              backgroundColor: activeIndex === "öğrenci" ? "#1F41BB" : "gray",
              borderRadius: 8,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-lg"> Öğrenci </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onUserRole("öğretmen")}
            style={{
              backgroundColor: activeIndex === "öğretmen" ? "#1F41BB" : "gray",
              borderRadius: 8,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-lg"> Öğretmen </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-4">
        <Text className="ml-4 font-bold text-lg"> E Mail </Text>
        <TextInput
          className="h-16 p-3 rounded-xl bg-[#F1F4FF] m-4 text-lg"
          autoCapitalize="none"
          value={emailAddress}
          keyboardType="email-address"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
      <View className="mb-4">
        <Text className="ml-4 font-bold text-lg"> Şifre </Text>
        <View className="flex-row items-center">
          <TextInput
            className="h-16 w-[90%] p-3 rounded-xl bg-[#F1F4FF] m-4 mt-3 mr-0 text-lg  "
            value={password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Text className="text-xl">👁️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="m-2">
        <TouchableOpacity
          className="h-16 bg-[#1F41BB] rounded-lg"
          onPress={onSignInPress}
        >
          <Text className="flex-1 text-xl font-semibold text-white text-center	my-4">
            Devam Et
          </Text>
        </TouchableOpacity>
        <View className="flex-row mt-2">
          <Text className="text-lg text-[#494949] font-semibold">
            {" "}
            Hesabın Yok Mu?
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text className="text-[#1F41BB] font-bold text-lg"> Kaydol </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleResetPassword}>
          <Text className="text-[#1F41BB] font-bold text-lg">
            {" "}
            Şifreyi Unuttum
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
