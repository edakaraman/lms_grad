import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from "react";
import { GetCategory } from "../services";
import { StyleSheet, View } from "react-native";
import Button from './Button';

const DropdownCategory = () => { 
  const [categoryValue, setCategoryValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategory();
  }, [categories]);

  const getCategory = () => {
    GetCategory().then((resp) => {
      if (resp && resp.courseLists) {
        const filteredCategories = resp.courseLists.reduce((uniqueCategories, newCategory) => {
          if (!uniqueCategories.some((existingCategory) => existingCategory.tag === newCategory.tag[0])) {
            uniqueCategories.push({ tag: newCategory.tag[0] });
          }
          return uniqueCategories;
        }, []);
        setCategories(filteredCategories);
      } else {
        console.error("Geçersiz kategori yanıtı:", resp);
      }
    }).catch((error) => {
      console.error("Kategori alınırken bir hata oluştu:", error);
    });
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories.map(category => ({ label: category.tag, value: category.tag }))}
        search
        searchPlaceholder="Ara..."
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Kategori Seç'}
        value={categoryValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setCategoryValue(item.value); // Seçilen kategori değerini set et
          setIsFocus(false);
          onSelectCategory(item.value.tag); // Kategori değerini string formatına dönüştürerek setSelectedCategory fonksiyonunu çağır
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
      <Button title={"Kategori Ekle"} onPress={handleAddCategory} /> {/* Buton eklendi */}
    </View>
  );
};

export default DropdownCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    marginBottom: 20,
    marginLeft: 50,
  },
  icon: {
    marginRight: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
