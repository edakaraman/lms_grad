import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton"; // RadioButton bileşenini içeri aktarın
import { updateCourse, publishCourse } from "../services";

const EditCourse = ({ courseInfos,id }) => {
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
          onChangeText={setSelectedCategory}
        />
        <View style={styles.radioGroup}>
          <Text style={styles.label}>Ücretsiz mi?</Text>
          <RadioButton
            options={[
              { label: "Evet", value: true },
              { label: "Hayır", value: false },
            ]}
            initialSelectedValue={free}
            onSelect={setFree}
          />
        </View>
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
    textDecorationLine: "underline",
  },
  cnt: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioGroup: {
    marginTop: 16,
    marginLeft: 12, 
  },
  label: {
    marginBottom: 8,
    fontSize:18,
  },
});
export default EditCourse;
