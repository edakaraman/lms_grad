import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { completedChapterInfo, getChapterCompletionStatus } from "../../services";

export default function Content({ content, onChapterFinish }) {
  const video = React.useRef(null);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [status, setStatus] = useState({});
  const [view,setView] = useState(true);

  const {user} = useUser();

  useEffect(() => {
    
    const checkCompletedStatus = async () => {
      const completedChaptersString = await AsyncStorage.getItem('completedChapters');
     //await AsyncStorage.clear();
      if (completedChaptersString) {
        const completedChaptersArray = JSON.parse(completedChaptersString);
        setCompletedChapters(completedChaptersArray);
        if (completedChaptersArray.includes(content.id)) {
          setChapterCompleted(true);
          setView(false);
        }
      }
    };
    checkCompletedStatus();
  }, []);

  
  const chapterComplete = async () => {
    setChapterCompleted(true);
    setCompletedChapters([...completedChapters, content.id]);
    onChapterFinish();
    await AsyncStorage.setItem('completedChapters', JSON.stringify([...completedChapters, content.id]));
  }

  const handleVideoEnd = (newStatus) => {
    if (newStatus.didJustFinish) {
      Alert.alert('Video Tamamlandı', 'Bölümü tamamladınız! 👋');
    }
  };
 
  return (
    <View>
      <Text className="text-2xl font-bold m-2">{content.name}</Text>
      <Text className="text-base m-2 ">{content.shortDesc}</Text>
      <Video
        ref={video}
        className="w-[300px] h-[300px] m-auto"
        source={{
          uri: content?.video?.url,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        //isLooping
        onPlaybackStatusUpdate={(newStatus) => {
          setStatus(newStatus);
          handleVideoEnd(newStatus);
        }}
      />
      {
        view && <TouchableOpacity
        disabled={chapterCompleted}
        className="m-4"
        style={[styles.button, chapterCompleted && styles.disabledButton]}
        onPress={() => chapterComplete()}
      >
        <Text style={{ color: "white", fontSize: 18,fontWeight:"bold" }}> Bölümü Tamamla </Text>
      </TouchableOpacity>
      }  

    </View>
  );
}

const styles = {
  button: {
    backgroundColor: "#1F41BB",
    margin: "auto",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
};