import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { UserRoleContext } from "../context/UserRoleContext";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { userRole,setUserRole } = useContext(UserRoleContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // Şifreleri karşılaştır
      if (password !== confirmPassword) {
        console.error("Şifreler eşleşmiyor.");
        return;
      }
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onUserRole = (role) => {
    setUserRole(role);
    setActiveIndex(role); 
  };

  //console.log(userRole);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-[#1F41BB] text-4xl font-bold mb-2 text-center">
        Hesap Oluştur
      </Text>
      
      <View className="flex flex-col mb-3">
        <Text className="font-bold text-xl m-3 "> Kullanıcı Grubu </Text>
        <View className="flex flex-row gap-4 ml-[2px]">
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

      {!pendingVerification && (
        <View className="w-11/12 mb-4 ml-3">
          <View className="flex-row mb-4">
            <View className="w-1/2 mr-3">
              <Text style={styles.label}> Ad </Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={firstName}
                onChangeText={(firstName) => setFirstName(firstName)}
              />
            </View>
            <View className="w-1/2">
              <Text style={styles.label}> Soyad </Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={lastName}
                onChangeText={(lastName) => setLastName(lastName)}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text style={styles.label}> E Mail </Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>

          <View className="mb-4">
            <Text style={styles.label}> Şifre </Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholderTextColor="#000"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <View className="mb-4">
            <Text style={styles.label}> Şifreyi Onayla </Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
            />
          </View>

          <TouchableOpacity
            className="bg-[#1F41BB] p-[10px] items-center rounded-md"
            onPress={onSignUpPress}
          >
            <Text className="text-white text-lg p-1 font-semibold">
              Devam Et
            </Text>
          </TouchableOpacity>
          <View className="flex-row">
            <Text className="text-lg text-[#494949] font-semibold">
              Hesap Oluşturduysan {" "}
            </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text className="text-[#1F41BB] font-bold text-lg">
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {pendingVerification && (
        <View className="w-4/5">
          <View className="mb-4">
          <Text style={styles.label}> Doğrulama Kodu </Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity className="bg-[#1F41BB] p-[10px] items-center rounded-md" onPress={onPressVerify}>
            <Text className="text-white text-lg p-1 font-semibold">Emaili Doğrula </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    backgroundColor: "#F1F4FF",
    padding: 15,
    borderRadius: 10,
    fontSize:18,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});
