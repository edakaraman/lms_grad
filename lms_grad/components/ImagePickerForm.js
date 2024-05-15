import { useState } from 'react';
import { Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import * as FileSystem from 'expo-file-system';

export default function ImagePickerForm() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.cancelled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      
      try {
        const photoUrl = await FileSystem.getContentUriAsync(selectedAsset.uri);
        onImageSelect(photoUrl);
      } catch (error) {
        Alert.alert("Hata", "Seçilen fotoğrafın URL'si alınamadı. Lütfen tekrar deneyin.");
      }
    } else {
      Alert.alert("Hata", "Lütfen bir fotoğraf seçin.");
    }
  };

  return (
    <View style={styles.container}>
      <Button text="Fotoğraf Yükle" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  image: {
    width: 200,
    height: 200,
  },
});
