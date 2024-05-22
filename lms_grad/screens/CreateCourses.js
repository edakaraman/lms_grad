
import React, { useState, useEffect } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton";
import { useUser } from "@clerk/clerk-expo";
import { createCourse, GetCategory, publishAsset, publishCourse } from "../services";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";

const CreateCourses = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalChapters, setTotalChapters] = useState(0);
  const [price, setPrice] = useState("");
  const [free, setFree] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  
  //chapter
  const [chapterName,setChapterName] = useState("");
  const [chapterDesc,setChapterDesc] = useState("");
  const [chapterNum,setChapterNum] = useState("");
  const [videoUri, setVideoUri] = useState(null);
 
  const HYGRAPH_ASSET_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MTYxMjcwNTgsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2xza3BxbHQ2M3dwZzAxdXBsbTRuMHQ3MS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiNTg3OGUxZDMtNWJjMy00YzZkLTgwMzMtZDgyMWI2MmI5ZDhkIiwianRpIjoiY2x3ZGxxcGF2ajRobTA4anQ0MDZpYWxobSJ9.f1tncbqNT1xDpQgxtYhOlUAY3liLKUoaYAGVc6xxT7Su-0a6bmB3uKGULbPCcHKxocva8HfGtDnMczGpC1LZvoIQy9FrVftHHI5RublU2ZSOWpHnLGPxN9_QfC6reSSSWBgCCdIiq2sUblunM8DtGDmkTIpo75fYpoizeZGXNywXrg3tGk4vJVoBbSVBePM8Qx7fVF2rc7bYOCyGufgpnVo5-Rv_ZDtj-_0TTk2br4Vf6fKH92oBrKKBOUQOjU2IVyux7FOQQANCDaSmnVyqsbx6-zc1y5izKkC545hg9zMuoqhpTgfVwfJJekEGzDpXBSt4rqUACFVsbz_Xr0utvroQrEJQ97GMk8m-twOxSCeO00PJlDDupT3USDN7pADX5XCs_vLy0_9AMFxmv3ID4XvGggtp2d-a-TeQKtkT-DRg8x4O-ZaaT4w7L7Bg_Y9nh-ibVpFk9gtg5C9mtIt9bFHzgKFrblO24f-Tk-8MB2P1FLrnaJy9EMnU8WCcIDdQh8-notWa5AE4Xj6hcWxCUX269WOLVlp2i2_s4bXg1ClsopdYJ6LgeKzHkmIT2U1ZJcoDAa_WOd6o4_B8K_UqH8p64XiaOlR-LefJDmPbD59b26q2laqpf4BUsjBEbcH8s-TnFHRNqTWOOJq-c5i6ziGNAN6EprV53kX99S-r6iU';
  const HYGRAPH_URL = "https://api-eu-west-2.hygraph.com/v2/clskpqlt63wpg01uplm4n0t71/master";

  const { user } = useUser();

  useEffect(() => {
    GetCategory()
      .then((resp) => {
        if (resp && resp.courseLists) {
          const filteredCategories = resp.courseLists.reduce(
            (uniqueCategories, newCategory) => {
              if (
                !uniqueCategories.some(
                  (existingCategory) =>
                    existingCategory.tag === newCategory.tag[0]
                )
              ) {
                uniqueCategories.push({ tag: newCategory.tag[0] });
              }
              return uniqueCategories;
            },
            []
          );
          setCategories(filteredCategories);
        } else {
          console.error("Geçersiz kategori yanıtı:", resp);
        }
      })
      .catch((error) => {
        console.error("Kategori alınırken bir hata oluştu:", error);
      });
  }, []); 

const handleSubmit = async () => {
    try {
      let coverPhotoId = null;
      if (coverPhoto) {
        const form = new FormData();
        form.append('fileUpload', {
          uri: coverPhoto,
          name: coverPhoto.split('/').pop(),
          type: 'image/jpeg',
        });
  
        const uploadResponse = await fetch(`${HYGRAPH_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HYGRAPH_ASSET_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          body: form,
        });
  
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }
  
        const responseData = await uploadResponse.json();
        coverPhotoId = responseData.id;
  
        const publishAssetResult = await publishAsset(coverPhotoId);
        console.log("Asset yayınlandı:", publishAssetResult);
      }

        let coverVideoId = null;
        if (videoUri) {
          const form = new FormData();
          form.append('fileUpload', {
            uri: videoUri,
            name: videoUri.split('/').pop(),
            type: 'video/mp4', 
          });
          
          const uploadResponse = await fetch(`${HYGRAPH_URL}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HYGRAPH_ASSET_TOKEN}`,
              'Content-Type': 'multipart/form-data',
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
        name,
        description,
        totalChapters: parseInt(totalChapters),
        price: parseFloat(price), 
        free: Boolean(free),
        authorEmail: user.primaryEmailAddress.emailAddress,
        selectedCategory, 
        coverPhoto: coverPhotoId,
        chapterName,
        chapterDesc,
        chapterNum: parseFloat(chapterNum),
        videoUri: coverVideoId,
      };
  
      const result = await createCourse(courseData);
      Alert.alert("Kurs Ekleme Başarılı!", "Kurs Eklendi!");
      console.log("Kurs eklendi:", result);
  
      const publishResult = await publishCourse(result.createCourseList.id);
      console.log("Kurs yayınlandı:", publishResult);
    } catch (error) {
      console.error("Kurs eklenirken bir hata oluştu:", error);
      Alert.alert("Hata", `Kurs eklenirken bir hata oluştu: ${error.message}`);
    }
  };
  
  const options = [
    { label: "Ücretli", value: false },
    { label: "Ücretsiz", value: true },
  ];

  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState([]);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
    if( result.canceled !== true){
      Alert.alert("Kapak görseli eklendi!");
    }
  
    if (
      !result ||
      result.canceled ||
      !result.uri 
    ) {
      Alert.alert("Uyarı", "Lütfen bir fotoğraf seçin.");
      return;
    }
  
    setCoverPhoto(result.uri);
  };
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if(result.canceled !== true){
      Alert.alert("Video eklendi!");
    }

    if (!result.canceled) {
      setVideoUri(result.uri);
      onChange(result.uri);
    }
  };
  

  const handleCategoryChange = (value) => {
    setSelectedCategory(value.value);
  };

  return (
    <ScrollView>
      <Text style={styles.header}> Kurs Ekle </Text>
      <Input
        placeholder="React Native.."
        label="Kurs Adı"
        onChangeText={setName}
        value={name}
      />
      <Input
        placeholder="Lorem ipsum.."
        label="Kurs Açıklaması"
        onChangeText={setDescription}
        value={description}
      />
      <View>
        <Text style={styles.category}> Kurs Kapak Fotoğrafı </Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.photo}
            source={require("./.././images/photo.jpg")}
          />
          <View style={styles.videBtn}>
            {/* <ImagePickerForm /> */}
            <Button text="Fotoğraf Yükle" onPress={pickImage} />
          </View>
        </View>
      </View>
      <Input
        label="Toplam Bölüm Sayısı"
        onChangeText={setTotalChapters}
        value={totalChapters}
      />
      <Text className="ml-3 text-lg"> Ücretli / Ücretsiz</Text>
      <RadioButton
        options={options}
        onSelect={(option) => setFree(option.value)}
        value={free}
      />
      <Input label="Kurs Ücreti" onChangeText={setPrice} />
      <Text className="ml-3 text-lg"> Kurs Kategorisi </Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories.map((category) => ({
          label: category.tag,
          value: category.tag,
        }))}
        search
        searchPlaceholder="Ara..."
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Kategorilerimiz"}
        value={selectedCategory}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleCategoryChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
      <Input
        placeholder="Ör:mobile"
        label="Kurs kategorisi"
        value={selectedCategory}
      />
      <View>
        <Text style={styles.header}> Kurs Bölümleri Ekle </Text>
        <Input
          placeholder="React Native Giriş.."
          label="Bölüm Adı"
          onChangeText={setChapterName}
          value={chapterName}
        />
        <Input
          placeholder="Lorem ipsum.."
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
            <View style={styles.videBtn}>
              <Button text="Video Yükle" onPress={pickVideo} />
            </View>
          </View>
        </View>
      </View>
      <Button text="Kursu Yükle" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 33,
    marginTop: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    width: "90%",
    marginBottom: 16,
    marginLeft: 17,
    backgroundColor: "#FFFFFF",
    padding: 7,
  },
  selectedValue: {
    marginTop: 20,
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
  image: {
    width: 200,
    height: 200,
  },
});

export default CreateCourses;
