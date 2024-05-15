
import React, { useState, useEffect } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton";
import VideoPickerForm from "../components/VideoPickerForm";
import { useUser } from "@clerk/clerk-expo";
import { createCourse, GetCategory, publishCourse } from "../services";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";

const CreateCourses = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalChapters, setTotalChapters] = useState(0);
  const [price, setPrice] = useState("");
  const [free, setFree] = useState(false); 
  const [chapterName, setChapterName] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [chapterNo, setChapterNo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleSubmit = () => {
    const courseData = {
      name,
      description,
      totalChapters: parseInt(totalChapters),
      price,
      free,
      authorEmail: user.primaryEmailAddress.emailAddress,
      selectedCategory,
    };
  
    createCourse(courseData)
      .then((result) => {
        Alert.alert("Kurs Ekleme Başarılı!", "Kurs Eklendi!");
        console.log("Kurs eklendi:", result);
        publishCourse(result.createCourseList.id)
        .then((publishResult) => {
          console.log("Kurs yayınlandı:", publishResult);
        })
      })
      .catch((error) => {
        console.error("Kurs eklenirken bir hata oluştu:", error);
      });
  };
  
  const options = [
    { label: "Ücretli", value: false },
    { label: "Ücretsiz", value: true },
  ];

  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (
      !result ||
      result.cancelled ||
      !result.uri 
    ) {
      Alert.alert("Hata", "Lütfen bir fotoğraf seçin.");
      return;
    }
  
    setImage(result.uri);
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
            {image && <Image source={{ uri: image }} style={styles.image} />}
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
      <Input placeholder="99TL" label="Kurs Ücreti" onChangeText={setPrice} />
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
        <View>
          <Text style={styles.category}> Video </Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.photo}
              source={require("./.././images/photo.jpg")}
            />
            <View style={styles.videBtn}>
              <VideoPickerForm onChange={console.log} />
            </View>
          </View>
        </View>
        <Input
          placeholder="1"
          label="Bölüm No"
          onChangeText={setChapterNo}
          value={chapterNo}
        />
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
