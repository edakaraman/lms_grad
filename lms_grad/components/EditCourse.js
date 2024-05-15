import React, { useState } from "react";
import { Alert, ScrollView, Text, View,StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton";
import { updateCourse, publishCourse } from "../services";
import DropdownCategory from "./DropdownCategory";

const EditCourse = ({ courseInfos,id }) => {
  const options = [
    { label: "Ücretli", value: false },
    { label: "Ücretsiz", value: true },
  ];

  const [name, setName] = useState(courseInfos.name);
  const [description, setDescription] = useState(courseInfos.description);
  const [totalChapters, setTotalChapters] = useState(String(courseInfos.totalChapters));
  const [price, setPrice] = useState(String(courseInfos.price));
  const [selectedCategory, setSelectedCategory] = useState(courseInfos.tag ? courseInfos.tag.join(", ") : "");
  const [free, setFree] = useState(courseInfos.free);

  const handleUpdate = () => {
    const courseData = {
      courseId: id,
      name: name,
      description: description,
      totalChapters: parseInt(totalChapters),
      price: parseFloat(price),
      selectedCategory: selectedCategory,
      free: free,
    };

    updateCourse(courseData)
      .then((updateResult) => {
        Alert.alert("Kurs Başarıyla Güncellendi!");
        publishCourse(id)
          .then((publishResult) => {
            console.log("Kurs yayınlandı:", publishResult);
          })
          .catch((publishError) => {
            console.error("Kurs yayınlanırken bir hata oluştu:", publishError);
          });
      })
      .catch((error) => {
        console.error("Kurs güncellenirken bir hata oluştu:", error);
      });
  };

  const changeCategory = (categoryText) => {
    setSelectedCategory(categoryText);
  }
  

  return (
    <View>
      <ScrollView>  
        <View style={styles.cnt}>
          <Text style={styles.header}>Kursu Düzenle</Text>
        </View>
        <Input label="Kurs Adı" value={name} onChangeText={setName} />
        <Input label="Kurs Açıklaması" value={description} onChangeText={setDescription} />
        <Input
          label="Toplam Bölüm Sayısı"
          value={totalChapters}
          onChangeText={setTotalChapters}
          keyboardType="numeric"
        />
        <Text style={styles.txt}>Ücretli / Ücretsiz</Text>
        <RadioButton options={options} value={free} onSelect={(value) => setFree(value)} />
        <Input
          placeholder="99TL"
          label="Kurs Ücreti"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Input
          placeholder="Ör: mobile"
          label="Kurs Kategorisi"
          value={selectedCategory}
          onChangeText={(categoryText) => changeCategory(categoryText)}

        />
        <Button text="Güncelle" onPress={handleUpdate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 33,
    marginTop: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom:10,
    textDecorationLine:"underline",
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
  btn:{
    fontSize: 18,
    marginTop:55,
    color: "red",
  },
  cnt:{
    flexDirection: "row",
    justifyContent:"space-between",
  },
  txt:{
    fontSize:18,
    marginBottom:10,
    marginLeft:12,
  }
});
export default EditCourse;
