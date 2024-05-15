import { View, Text, TouchableOpacity} from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { CompleteChapterContext } from "../../context/CompleteChapterContext";
import Toast from 'react-native-toast-message';

export default function ChapterSection({ chapterList, userEnrolledCourse }) {

  const {isChapterComplete,setIsChapterComplete} = useContext(CompleteChapterContext);
  const navigation = useNavigation();
  //console.log("bölümler hakkında", userEnrolledCourse[0]?.completedChapter.map(chapter => chapter.chapterId));

  const OnChapterPress = (chapter) => {
    //console.log("Tıklanan Bölüm:", chapter); 
    if (userEnrolledCourse.length == 0) {
      Toast.show({
        type: 'error',
        text1: 'İşlem Başarısız!',
        text2: 'Lütfen Önce Kursa Kaydolun! 👋',
      });

      return;
    } else {
      setIsChapterComplete(false);
      navigation.navigate("ChapterContent",{
        content:chapter,
        chapterId:chapter.id,
        userCourseRecordId:userEnrolledCourse[0]?.id
      })
    }
  };

  const checkIsChapterCompleted = (chapterId) => {
    if (!userEnrolledCourse[0]?.completedChapter || userEnrolledCourse[0]?.completedChapter.length <= 0) {
      return false;
    }
    const resp = userEnrolledCourse[0].completedChapter.find(item => item.chapterId === chapterId);
    return resp;
  }

  
  return (
    chapterList && (
      <View className="p-2 bg-white mt-5 rounded-2xl">
        <Text className="text-[22px] text-center font-bold"> Bölümler </Text>
        {chapterList.map((item, index) => (
          <TouchableOpacity
          style={[checkIsChapterCompleted(item.id) ? styles.CompleteChapter : styles.inCompletedChapter]}
          onPress={() => OnChapterPress(item)}
          key={item.id}
         >
        
            <View className="flex flex-row items-center gap-2">
              <Text className="text-[27px] font-bold text-slate-500">
                {" "}
                {index + 1} -{" "}
              </Text>
              <Text className="text-[21px] text-slate-500"> {item.name}</Text>
            </View>
            {userEnrolledCourse.length == 0 ? (
              <Ionicons name="md-lock-closed" size={25} color="gray" />
            ) : (
              <Ionicons name="play" size={25} color="gray" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  inCompletedChapter:{
    display: "flex",
    flexDirection:"row",
    alignItems: "center",
    justifyContent:"space-between",
    padding:15,
    borderWidth:1,
    borderRadius:10,
    marginTop:10,
    borderColor:"gray",
  },
  CompleteChapter:{
    display: "flex",
    flexDirection:"row",
    alignItems: "center",
    justifyContent:"space-between",
    padding:15,
    borderWidth:1,
    borderRadius:10,
    marginTop:10,
    borderColor:"green",
    backgroundColor:"lightgreen",
  },
});