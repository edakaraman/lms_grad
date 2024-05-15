import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";

const ProfileEditScreen = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0]?.emailAddress);

  useEffect(() => {
    if (!user) {
      return;
    }
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  // Update Clerk user data
  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName: firstName,
        lastName: lastName,
      });
      alert("Bilgileriniz Güncellendi.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text className="text-center text-3xl text-[#1F41BB] font-bold">
        Profili Düzenle
      </Text>
      <Text style={styles.label}> Ad </Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.inputField}
      />
      <Text style={styles.label}> Soyad </Text>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputField}
      />
      <Text style={styles.label}> E Mail </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
      />
      <TouchableOpacity onPress={onSaveUser} style={styles.btn}>
        <Text className="text-white text-center text-xl">Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#F1F4FF",
    color: "gray",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: "#1F41BB",
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileEditScreen;
