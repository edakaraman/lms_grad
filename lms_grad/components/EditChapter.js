import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { deleteChapter, getChapterInfos, publishCourse } from "../services";
import { AntDesign } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";

const EditChapter = ({ courseId }) => {
  const video = React.useRef(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchChapterInfos = async () => {
      try {
        const result = await getChapterInfos(courseId);
        if (result && result.courseList && result.courseList.chapter) {
          setChapters(result.courseList.chapter);
        } else {
          setChapters([]);
        }
      } catch (error) {
        console.error("Bölüm bilgileri yüklenemedi..", error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterInfos();
  }, [courseId,chapters]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  // const handleDelete = (chapterId) => {
  //   deleteChapter({ courseId, chapterId }).then(() => {
  //     setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  //     Alert.alert("Silme İşlemi Başarılı!", "Bölüm silindi.");
  //   });
  // };

  const handleDelete = (chapterId) => {
    deleteChapter({ courseId, chapterId })
      .then(() => {
        setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
        Alert.alert("Silme İşlemi Başarılı!", "Bölüm silindi.");
        return publishCourse(courseId);
      })
      .then((publishResult) => {
        console.log("Kurs yayınlandı:", publishResult);
      })
      .catch((error) => {
        console.error(
          "Silme veya yayınlama işlemi sırasında bir hata oluştu:",
          error
        );
        Alert.alert(
          "Hata",
          "Silme veya yayınlama işlemi sırasında bir hata oluştu."
        );
      });
  };

  return (
    <ScrollView style={styles.container}>
      {chapters.map((chapter, index) => (
        <View key={index} style={styles.chapterContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.chapterTitle}>Bölüm {index + 1}</Text>
            <View>
              <TouchableOpacity onPress={() => handleDelete(chapter.id)}>
                <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>Bölüm Adı:</Text>
          <TextInput
            style={styles.input}
            value={chapter.name}
            onChangeText={(text) => {
              // Bölüm adını güncelleme işlemleri
            }}
          />
          <Text style={styles.label}>Kısa Açıklama:</Text>
          <TextInput
            style={styles.input}
            value={chapter.shortDesc}
            onChangeText={(text) => {
              // Kısa açıklamayı güncelleme işlemleri
            }}
          />
          <Text style={styles.label}>Bölüm Numarası:</Text>
          <TextInput
            style={styles.input}
            value={chapter.chapterNumber.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              // Bölüm numarasını güncelleme işlemleri
            }}
          />
          <Text style={styles.label}> Bölüm Videosu:</Text>
          {chapter.video && chapter.video.url ? (
            <Video
              ref={video}
              style={styles.chapterVideo}
              source={{
                uri: chapter.video.url,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Text>Video bulunamadı.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chapterContainer: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "blue",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  chapterVideo: {
    width: 300,
    height: 300,
  },
});

export default EditChapter;
