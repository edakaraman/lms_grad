import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';

export default function VideoPickerForm({ onChange }) {
  const [videoUri, setVideoUri] = useState(null);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setVideoUri(result.uri);
      // onChange fonksiyonunu çağırarak seçilen video URL'sini ebeveyn bileşene iletiyoruz
      onChange(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <Video
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      ) : (
        <Button text="Video Yükle" onPress={pickVideo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
});
