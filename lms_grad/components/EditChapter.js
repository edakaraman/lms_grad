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
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import Button from "./Button";
import {
  deleteChapter,
  getChapterInfos,
  GetTotalChapters,
  publishAsset,
  publishCourse,
  totalChaptersCounter,
  updateChapterInfos
} from "../services";

const EditChapter = ({ courseId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState(null);
  const [videoUri, setVideoUri] = useState(null);

  const HYGRAPH_ASSET_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MTYxMjcwNTgsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2xza3BxbHQ2M3dwZzAxdXBsbTRuMHQ3MS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiNTg3OGUxZDMtNWJjMy00YzZkLTgwMzMtZDgyMWI2MmI5ZDhkIiwianRpIjoiY2x3ZGxxcGF2ajRobTA4anQ0MDZpYWxobSJ9.f1tncbqNT1xDpQgxtYhOlUAY3liLKUoaYAGVc6xxT7Su-0a6bmB3uKGULbPCcHKxocva8HfGtDnMczGpC1LZvoIQy9FrVftHHI5RublU2ZSOWpHnLGPxN9_QfC6reSSSWBgCCdIiq2sUblunM8DtGDmkTIpo75fYpoizeZGXNywXrg3tGk4vJVoBbSVBePM8Qx7fVF2rc7bYOCyGufgpnVo5-Rv_ZDtj-_0TTk2br4Vf6fKH92oBrKKBOUQOjU2IVyux7FOQQANCDaSmnVyqsbx6-zc1y5izKkC545hg9zMuoqhpTgfVwfJJekEGzDpXBSt4rqUACFVsbz_Xr0utvroQrEJQ97GMk8m-twOxSCeO00PJlDDupT3USDN7pADX5XCs_vLy0_9AMFxmv3ID4XvGggtp2d-a-TeQKtkT-DRg8x4O-ZaaT4w7L7Bg_Y9nh-ibVpFk9gtg5C9mtIt9bFHzgKFrblO24f-Tk-8MB2P1FLrnaJy9EMnU8WCcIDdQh8-notWa5AE4Xj6hcWxCUX269WOLVlp2i2_s4bXg1ClsopdYJ6LgeKzHkmIT2U1ZJcoDAa_WOd6o4_B8K_UqH8p64XiaOlR-LefJDmPbD59b26q2laqpf4BUsjBEbcH8s-TnFHRNqTWOOJq-c5i6ziGNAN6EprV53kX99S-r6iU";  ;
  const HYGRAPH_URL = "https://api-eu-west-2.hygraph.com/v2/clskpqlt63wpg01uplm4n0t71/master";

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

  useEffect(() => {
    fetchChapterInfos();
  }, [courseId]);

  const handleDelete = async (chapterId) => {
    try {
      await deleteChapter({ courseId, chapterId });
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
      Alert.alert("Silme İşlemi Başarılı!", "Bölüm silindi.");

      const publishResult = await publishCourse(courseId);
      console.log("Kurs yayınlandı:", publishResult);

      const resp = await GetTotalChapters(courseId);
      let counterEnrollValue = resp.courseList.totalChapters;
      counterEnrollValue = counterEnrollValue - 1;
      const updateResult = await totalChaptersCounter(courseId, counterEnrollValue);
      console.log("Sonuçlar:", updateResult);

    } catch (error) {
      console.error("Silme veya yayınlama işlemi sırasında bir hata oluştu:", error);
      Alert.alert("Hata", "Silme veya yayınlama işlemi sırasında bir hata oluştu.");
    }
  };

  const handleEdit = (chapterId) => {
    const editedChapter = chapters.find(chapter => chapter.id === chapterId);
    setEditingChapter(editedChapter);
  };

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVideoUri(result.assets[0].uri);
        Alert.alert("Video yüklendi!");
      }
    } catch (error) {
      console.log("Video seçme hatası:", error);
    }
  };

  const handleSave = async () => {
    let newVideoUri = null;
    if (videoUri) {
      const form = new FormData();
      form.append("fileUpload", {
        uri: videoUri,
        name: videoUri.split("/").pop(),
        type: "video/mp4",
      });
  
      try {
        const uploadResponse = await fetch(`${HYGRAPH_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HYGRAPH_ASSET_TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
          body: form,
        });
  
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }
  
        const responseData = await uploadResponse.json();
        newVideoUri = responseData.id;
  
        const publishAssetResult = await publishAsset(newVideoUri);
        console.log("New video asset published:", publishAssetResult);
      } catch (error) {
        console.error("Video yükleme hatası:", error);
        Alert.alert("Hata", "Video yükleme sırasında bir hata oluştu.");
        return;
      }
    }
  
    try {
      await updateChapterInfos({
        courseId,
        chapterId: editingChapter.id,
        chapterNum: editingChapter.chapterNumber,
        chapterName: editingChapter.name,
        chapterDesc: editingChapter.shortDesc,
        videoUri: newVideoUri,
      });
  
      Alert.alert("Başarılı!", "Bölüm güncellendi.");
      setEditingChapter(null);
  
      const publishResult = await publishCourse(courseId);
      console.log("Kurs yayınlandı:", publishResult);
    } catch (error) {
      console.error("Bölüm güncelleme işlemi başarısız oldu:", error);
      Alert.alert("Hata", "Bölüm güncelleme işlemi başarısız oldu.");
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

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
              <TouchableOpacity onPress={() => handleEdit(chapter.id)}>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>Bölüm Adı:</Text>
          <TextInput
            style={styles.input}
            value={chapter.name}
            onChangeText={(text) => {
              const updatedChapters = [...chapters];
              updatedChapters[index].name = text;
              setChapters(updatedChapters);
            }}
          />
          <Text style={styles.label}>Kısa Açıklama:</Text>
          <TextInput
            style={styles.input}
            value={chapter.shortDesc}
            onChangeText={(text) => {
              const updatedChapters = [...chapters];
              updatedChapters[index].shortDesc = text;
              setChapters(updatedChapters);
            }}
          />
          <Text style={styles.label}>Bölüm Numarası:</Text>
          <TextInput
            style={styles.input}
            value={chapter.chapterNumber.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              const updatedChapters = [...chapters];
              updatedChapters[index].chapterNumber = parseInt(text);
              setChapters(updatedChapters);
            }}
          />
          <Text style={styles.label}>Bölüm Videosu:</Text>
          {chapter.video && chapter.video.url ? (
            <Video
              style={styles.chapterVideo}
              source={{ uri: chapter.video.url }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Text>Video bulunamadı.</Text>
          )}
          {editingChapter && editingChapter.id === chapter.id && (
            <>
              <Button text="Video Seç" onPress={pickVideo} />
              <Button text="Güncelle" onPress={handleSave} />
            </>
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
