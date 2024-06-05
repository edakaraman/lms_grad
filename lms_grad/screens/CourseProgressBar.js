import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function CourseProgressBar({ totalChapter, completedChapter }) {
  const percentageCompleted = (completedChapter / totalChapter) * 100;
  const width = percentageCompleted > 100 ? 100 : percentageCompleted; 

  return (
    <>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${width}%` }]} />
      </View>
      {percentageCompleted > 0 ? (
        <Text style={styles.progressText}> % {percentageCompleted.toFixed(2)} Tamamlandı </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    height: 7,
    backgroundColor: '#333',
    borderRadius: 99,
  },
  progress: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 99,
  },
  progressText: {
    fontSize: 14,
  },
});
