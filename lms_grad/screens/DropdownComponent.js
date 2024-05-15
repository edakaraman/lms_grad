import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const DropdownComponent = ({ categories, handleCategoryPress,courseList,setCourseList }) => { 
  const [categoryValue, setCategoryValue] = useState(null);
  const [priceValue, setPriceValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const filteredFreeCourses = courseList.filter(course => course.free === true);
  const filteredPaidCourses = courseList.filter(course => course.free === false);
   
  const handlePriceFilter = (price) => {
    let filteredList = [];
    if (price === 'free') {
      filteredList = filteredFreeCourses;
    } else if (price === 'paid') {
      filteredList = filteredPaidCourses;
    } else {
      filteredList = courseList;
    }
    setCourseList(filteredList);
  };
  

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories.map(category => ({ label: category.tag, value: category.tag }))} // Kategorileri drop-down menüsüne uygun formata dönüştür
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Kategori Seç'}
        searchPlaceholder="Ara..."
        value={categoryValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setCategoryValue(item.value);
          setIsFocus(false);
          const index = categories.findIndex(category => category.tag === item.value);
          handleCategoryPress(categories[index], index); 
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
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: 'Ücretsiz', value: 'free' },
          { label: 'Ücretli', value: 'paid' },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Fiyat Kategorisi Seç'}
        searchPlaceholder="Ara..."
        value={priceValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setPriceValue(item.value);
          setIsFocus(false);
          handlePriceFilter(item.value);
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
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
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

