import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from "react-native";

const SearchCourses = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={{ backgroundColor: 'white', padding: 2, marginTop: 1, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 20 }}>
     <TextInput
        className="pl-3"
        placeholder="Kurs Arayın.."
        placeholderTextColor={"gray"}
        onChangeText={handleSearch}
      />
      <Ionicons name="search-circle" size={50} color="black" onPress={() => handleSearch(searchText)} />
    </View>
  );
};

export default SearchCourses;
