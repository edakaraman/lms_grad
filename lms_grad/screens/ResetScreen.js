import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

const ResetScreen = () => {

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err) {
      alert("E-mail adresi eksik veya hatalı!");
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Şifreniz Güncellendi!");

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {!successfulCreation ? (
        <>
          <Text className="text-[#1F41BB] font-bold text-3xl text-center mb-4">
            {" "}
            Şifreyi Sıfırla{" "}
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="abc@def.dev"
            placeholderTextColor={"gray"}
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <Button onPress={onRequestReset} title="Gönder" color={"#1F41BB"} />
        </>
      ) : (
        <>
          <Text className="text-[#1F41BB] font-bold text-3xl text-center">
            Şifreyi Güncelle
          </Text>
          <TextInput
            value={code}
            placeholder="Kod..."
            style={styles.inputField}
            onChangeText={setCode}
          />
          <TextInput
            placeholder="Yeni Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />
          <TouchableOpacity
            className="h-12 bg-[#1F41BB] rounded-lg"
            onPress={onReset}
          >
            <Text className="flex-1 text-xl font-semibold text-white text-center	my-2">
              Güncelle
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    
  },
  inputField: {
    marginVertical: 10,
    height: 60,
    borderRadius: 6,
    padding: 15,
    backgroundColor: "#F1F4FF",
  },
});

export default ResetScreen;
