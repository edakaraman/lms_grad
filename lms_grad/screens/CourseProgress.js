import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GetAllProgressCourse } from "../services";
import { useUser } from "@clerk/clerk-expo";
import CourseItem from "./CourseItem";
import {useNavigation} from "@react-navigation/native"

export default function CourseProgress() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [progressCourseList,setProgressCourseList] = useState();

  useEffect(() => {
    user && GetAllProgressCourseList();
  }, [user,progressCourseList,progressCourseList.tags]);

  const GetAllProgressCourseList = () => {
    GetAllProgressCourse(user.primaryEmailAddress.emailAddress).then((resp) => {
      setProgressCourseList(resp.userEnrollCourses);
    });
  };

  return (
    <View>
      <Text className="font-bold text-2xl text-center"> Kurslarım </Text>
      <FlatList
        data={progressCourseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
           onPress={() => navigation.navigate("CourseDetail",{
            course:item.courseList
          })}
        >
          <CourseItem progress={true} item={item.courseList} 
          completedChapter={item?.completedChapter?.length} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
