import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton"; // RadioButton bileşenini içeri aktarın
import { updateCourse, publishCourse,GetCategory } from "../services";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const EditCourse = ({ courseInfos,id }) => {
  
  const [name, setName] = useState("") ;
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [free, setFree] = useState(""); 

  const [categories, setCategories] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value.value);
  };
  
  useEffect(( ) => {
    setName(courseInfos.name === null ? "": courseInfos.name) ;
    setDescription(courseInfos.description === null ? "": courseInfos.description);
    setPrice(String(courseInfos.price === null ? "": courseInfos.price));
    setSelectedCategory(courseInfos.tag ? courseInfos.tag.join(", ") : "");
    setFree(courseInfos.free); 
},[id]);

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

  const handleUpdate = () => {
    const courseData = {
      courseId: id,
      name: name,
      description: description,
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
          label="Kurs Ücreti"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Text style={styles.label}> Kurs Kategorisi </Text>
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
        placeholder={"Kategoriler"}
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
    marginLeft:10,
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
});
export default EditCourse;
