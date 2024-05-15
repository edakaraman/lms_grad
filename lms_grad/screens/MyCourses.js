import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { GetAllProgressCourse,getUserEnrolledCourse } from "../services";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import CourseProgressItem from "./MyCourse/CourseProgressItem";

const MyCourses = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [progressCourseList, setProgressCourseList] = useState();

  useEffect(() => {
    user && GetAllProgressCourseList();
  }, [user, progressCourseList,getUserEnrolledCourse]);

  const GetAllProgressCourseList = () => {
    GetAllProgressCourse(user.primaryEmailAddress.emailAddress).then((resp) => {
      setProgressCourseList(resp.userEnrollCourses);
    });
  };

  return (
    <FlatList
    data={progressCourseList}
    showsHorizontalScrollIndicator={false}
    ListHeaderComponent={
      <View className="h-[140px] bg-blue-400 p-7">
        <Text className="text-3xl text-center text-white pt-6 font-semibold">
          KURSLARIM
        </Text>
      </View>
    }
    renderItem={({ item }) => (
      <TouchableOpacity
        className="m-2 p-1"
        onPress={() =>
          navigation.navigate("CourseDetail", {
            course: item.courseList,
          })
        }
      >
        <CourseProgressItem
          progress={true}
          item={item.courseList}
          completedChapter={item?.completedChapter?.length}
        />
      </TouchableOpacity>
    )}
  />
  
  );
};

export default MyCourses;
