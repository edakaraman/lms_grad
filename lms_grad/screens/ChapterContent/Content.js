import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "@clerk/clerk-expo";
import { updateRegisterCounter, getUserInfoCounter, creategisterCounter } from "../../services";

export default function Content({ content, onChapterFinish }) {
  const video = React.useRef(null);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [status, setStatus] = useState({});
  const [view, setView] = useState(true);
  const [registerCounter, setRegisterCounter] = useState(0);

  const { user } = useUser();

  useEffect(() => {
    const checkCompletedStatus = async () => {
      const completedChaptersString = await AsyncStorage.getItem('completedChapters');
      if (completedChaptersString) {
        const completedChaptersArray = JSON.parse(completedChaptersString);
        setCompletedChapters(completedChaptersArray);
        if (completedChaptersArray.includes(content.id)) {
          setChapterCompleted(true);
          setView(false);
        }
      }
      try {
        const counterData = await getUserInfoCounter(user.primaryEmailAddress.emailAddress);
        if (counterData?.userInfo) {
          setRegisterCounter(counterData.userInfo.completedChapterCounter || 0);
        } else {
          await creategisterCounter({ authorEmail: user.primaryEmailAddress.emailAddress });
          setRegisterCounter(0);
        }
      } catch (error) {
        console.error("Error fetching user info counter:", error);
      }
    };
    checkCompletedStatus();
  }, [content.id, user.primaryEmailAddress.emailAddress]);

  const chapterComplete = async () => {
    setChapterCompleted(true);
    const newCompletedChapters = [...completedChapters, content.id];
    setCompletedChapters(newCompletedChapters);
    onChapterFinish();
    await AsyncStorage.setItem('completedChapters', JSON.stringify(newCompletedChapters));

    const newRegisterCounter = registerCounter + 1;
    setRegisterCounter(newRegisterCounter);

    await updateRegisterCounter({
      authorEmail: user.primaryEmailAddress.emailAddress,
      completedChapterCounter: newRegisterCounter,
    });
  };

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
        source={{ uri: content?.video?.url }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
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
          onPress={chapterComplete}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}> Bölümü Tamamla </Text>
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
