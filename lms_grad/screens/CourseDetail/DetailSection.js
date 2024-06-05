import { View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import React from "react";
import OptionItem from "./OptionItem";

export default function DetailSection({ course ,enrollCourse,userEnrolledCourse,stripeEnrollCourse}) {
  return (
    <View className="p-3 rounded-2xl bg-white">
      <Image
        source={{ uri: course?.banner?.url }}
        style={{
          width: Dimensions.get("screen").width * 0.9,
          height: 190,
          borderRadius: 15,
        }}
      />
      <Text className="text-xl mt-2"> {course.name} </Text>
      <View className="flex flex-row justify-between">
        <OptionItem
          icon={"book-outline"}
          value={course.chapter?.length + " Bölüm"}
        />
        <OptionItem
          icon={"logo-euro"}
          value={course.free ? "Ücretsiz" : "Ücretli"}
        />
      </View>
      <View className="mt-3 mb-3">
        <Text className="text-xl mt-3 leading-5 mb-2 "> Açıklama </Text>
        <Text className="italic"> {course?.description} </Text>
      </View>
      <View className="mt-3 gap-2 flex flex-row justify-evenly">
        {
          userEnrolledCourse?.length ==0 ? <TouchableOpacity onPress={() => enrollCourse()}  className={`p-4 w-1/2 rounded-2xl ${course.free ? 'bg-green-500' : 'bg-gray-300'}`} disabled={!course.free}>
          <Text className="text-center text-base font-bold" style={{ color: course.free ? 'white' : 'gray' }}>Ücretsiz Kaydol</Text>
        </TouchableOpacity>:null
        }
        {
          course.free || userEnrolledCourse?.length !==0  ? null : <TouchableOpacity onPress={() => stripeEnrollCourse()} className={`p-4 w-1/2 rounded-2xl ${course.free ? 'bg-gray-300' : 'bg-red-500'}`} disabled={course.free}>
          <Text className="text-center text-base font-bold" style={{ color: 'white' }}>Satın Al {""} {course?.price} ₺ </Text>
          </TouchableOpacity> 
        } 
      </View>
    </View>
  );
}
