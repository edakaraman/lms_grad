import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  addChapter,
  GetTotalChapters,
  publishAsset,
  publishCourse,
  totalChaptersCounter,
} from "../services";
import * as ImagePicker from "expo-image-picker";
import Input from "./Input";
import Button from "./Button";

const AddChapter = ({ id }) => {
  const [chapterName, setChapterName] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [chapterNum, setChapterNum] = useState("");
  const [videoUri, setVideoUri] = useState(null);

  const HYGRAPH_URL =
    "https://api-eu-west-2.hygraph.com/v2/clskpqlt63wpg01uplm4n0t71/master";
  const HYGRAPH_ASSET_TOKEN =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MTYxMjcwNTgsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2xza3BxbHQ2M3dwZzAxdXBsbTRuMHQ3MS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiNTg3OGUxZDMtNWJjMy00YzZkLTgwMzMtZDgyMWI2MmI5ZDhkIiwianRpIjoiY2x3ZGxxcGF2ajRobTA4anQ0MDZpYWxobSJ9.f1tncbqNT1xDpQgxtYhOlUAY3liLKUoaYAGVc6xxT7Su-0a6bmB3uKGULbPCcHKxocva8HfGtDnMczGpC1LZvoIQy9FrVftHHI5RublU2ZSOWpHnLGPxN9_QfC6reSSSWBgCCdIiq2sUblunM8DtGDmkTIpo75fYpoizeZGXNywXrg3tGk4vJVoBbSVBePM8Qx7fVF2rc7bYOCyGufgpnVo5-Rv_ZDtj-_0TTk2br4Vf6fKH92oBrKKBOUQOjU2IVyux7FOQQANCDaSmnVyqsbx6-zc1y5izKkC545hg9zMuoqhpTgfVwfJJekEGzDpXBSt4rqUACFVsbz_Xr0utvroQrEJQ97GMk8m-twOxSCeO00PJlDDupT3USDN7pADX5XCs_vLy0_9AMFxmv3ID4XvGggtp2d-a-TeQKtkT-DRg8x4O-ZaaT4w7L7Bg_Y9nh-ibVpFk9gtg5C9mtIt9bFHzgKFrblO24f-Tk-8MB2P1FLrnaJy9EMnU8WCcIDdQh8-notWa5AE4Xj6hcWxCUX269WOLVlp2i2_s4bXg1ClsopdYJ6LgeKzHkmIT2U1ZJcoDAa_WOd6o4_B8K_UqH8p64XiaOlR-LefJDmPbD59b26q2laqpf4BUsjBEbcH8s-TnFHRNqTWOOJq-c5i6ziGNAN6EprV53kX99S-r6iU";

  const handleSubmit = async () => {
    try {
      let coverVideoId = null;
      if (videoUri) {
        const form = new FormData();
        form.append("fileUpload", {
          uri: videoUri,
          name: videoUri.split("/").pop(),
          type: "video/mp4",
        });

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
        coverVideoId = responseData.id;

        const publishAssetResult = await publishAsset(coverVideoId);
        console.log("Asset yayınlandı:", publishAssetResult);
      }

      const courseData = {
        courseId: id,
        chapterName,
        chapterDesc,
        chapterNum: parseFloat(chapterNum),
        videoUri: coverVideoId,
      };

      const result = await addChapter(courseData);
      Alert.alert("Bölüm Ekleme Başarılı!", "Bölüm Eklendi!");

      const publishResult = await publishCourse(result.updateCourseList.id);
      console.log("Kurs yayınlandı:", publishResult);

      //total chapter
      const resp = await GetTotalChapters(id);
      let counterEnrollValue = resp.courseList.totalChapters;
      counterEnrollValue = counterEnrollValue + 1;
      const updateResult = await totalChaptersCounter(id, counterEnrollValue);
      console.log("Sonuçlar: ", updateResult);
    } catch (error) {
      console.error("Kurs eklenirken bir hata oluştu:", error);
      Alert.alert("Hata", "Bölüm eklenirken bir hata oluştu!");
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled !== true) {
      Alert.alert("Video eklendi!");
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
      //onChange(result.assets[0].uri);
    }
  };

  return (
    <View>
      <View>
        <View style={styles.flx}>
          <Text style={styles.header}> Bölüm Ekle </Text>
        </View>
        <Input
          label="Bölüm Adı"
          onChangeText={setChapterName}
          value={chapterName}
        />
        <Input
          label="Bölüm Hakkında Kısa Açıklama"
          onChangeText={setChapterDesc}
          value={chapterDesc}
        />
        <Input
          label="Bölüm Numarası"
          onChangeText={setChapterNum}
          value={chapterNum}
        />
        <View>
          <Text style={styles.category}> Video </Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.photo}
              source={require("./.././images/photo.jpg")}
            />
            <View>
              <Button text="Video Ekle" onPress={pickVideo} />
            </View>
          </View>
        </View>
      </View>
      <Button text="Bölüm Ekle" onPress={handleSubmit} />
    </View>
  );
};

export default AddChapter;

const styles = StyleSheet.create({
  header: {
    fontSize: 33,
    marginTop: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  flx: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    marginTop: 20,
    marginLeft: 12,
    fontSize: 17,
  },
  photo: {
    height: 70,
    width: 70,
    borderRadius: 12,
    marginLeft: 12,
    marginTop: 11,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
