import { View, Text ,Image,TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import CourseProgressBar from "./CourseProgressBar";

export default function CourseItem({ item,completedChapter,progress }) {
  return (
    <View className="p-2 bg-white mr-3 rounded-2xl">
      <Image
        source={{ uri: item?.banner?.url }}
        className="w-[210px] h-32 rounded-2xl"
      />
      <View className="p-2 pb-0">
        <Text className="text-lg"> {item.name} </Text>
      </View>
      <View className="p-2 pt-0">
        <Text className="text-base font-bold text-blue-800"> {item.tag} </Text>
      </View>
      <View className="flex flex-row items-center gap-1 mt-1 ml-2">
        <Ionicons name="book-outline" size={18} color="black" />
        <Text className="text-base"> {item?.chapter?.length} Bölüm </Text>
      </View>
      <View className="flex flex-row items-center gap-1 mt-1 ml-2 justify-between">
        <Text className="text-base">
          {item?.free == true ? "Ücretsiz" : "Ücretli"}{" "}
        </Text>
        {
          progress  ? null : <TouchableOpacity
          style={{
            backgroundColor: item?.free ? "green" : "red",
            borderRadius: 8,
            padding: 7,
          }}
        >
          <Text className="text-base text-white">
            {item?.free ? "Kaydol" : "Satın Al"}
          </Text>
        </TouchableOpacity>
        }
      </View>
      {completedChapter != undefined? 
      <CourseProgressBar
       totalChapter={item?.chapter?.length}
       completedChapter={completedChapter}
      /> 
      : null }
    </View>
  );
}
