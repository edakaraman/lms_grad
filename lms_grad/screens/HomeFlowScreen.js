import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React,{useState,useContext} from "react";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import SearchCourses from "./SearchCourses";
import CourseList from "./CourseList";
import { UserRoleContext } from "../context/UserRoleContext";
import { SafeAreaView } from "react-native-safe-area-context";
const HomeFlowScreen = () => {
  const { user } = useUser();
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const {userRole} = useContext(UserRoleContext);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const formattedFirstName = user?.firstName
    ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    : "";

  const firstLetterUsername = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";

  const handleSignOut = async () => {
    try {
      await window.Clerk.signOut();
      navigation.navigate("Home");
    } catch (error) {
      //console.error("Sign out error:", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-row justify-between m-2">
          <View className="justify-center">
            <Text>Merhaba </Text>
            <Text className="font-bold">{formattedFirstName}</Text>
            <Text className="text-center text-red-500">
              {userRole === "öğretmen" && "(Öğretmen modundasınız)"}
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={handleSignOut}
              className="items-center justify-center m-2"
            >
              <Text className="font-bold text-lg">Çıkış</Text>
            </TouchableOpacity>
            <View className="bg-red-100 rounded-full w-14 text-center h-14 justify-center items-center ">
              <Text className="text-center font-bold">
                {firstLetterUsername}
              </Text>
            </View>
          </View>
        </View>
        <SearchCourses onSearch={handleSearch} />
        <Image
          source={require("../assets/images/image1.png")}
          style={{ width: width, height: 130,borderRadius:5,marginLeft:3 }}
        />
        <ScrollView>
          <CourseList searchText={searchText} />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeFlowScreen;
