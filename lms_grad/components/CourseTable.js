import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  deleteCourse,
  idToCourse,
} from "../services";
import EditCourse from "./EditCourse";
import { AntDesign } from "@expo/vector-icons";
import AddChapter from "./AddChapter";

const CourseTable = ({ data }) => {
  const [courseList, setCourseList] = useState(null);
  const [editing, setEditing] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [chapterEditing,setChapterEditing] = useState(false);

  const handleDelete = (courseId) => {
    deleteCourse(courseId).then(() => {
      setEditing(false);
      Alert.alert("Silme İşlemi Başarılı!", "Kurs silindi.");
    });
  };

  const openToModal = (courseId) => {
    setEditing(true);
    idToCourse(courseId).then((resp) => {
      setCourseList(resp.courseList);
      setCourseId(courseId);
    });
  };

  const addChapter = (courseId) => {
    setEditing(false);
    setChapterEditing(true);
    idToCourse(courseId).then((resp) => {
      setCourseId(courseId);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kurs Adı</Text>
        <Text style={styles.headerText}>İşlem</Text>
      </View>
      {data.map((course, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.courseName}>{course.name}</Text>
          <View style={styles.row2}>
            <TouchableOpacity onPress={() => handleDelete(course.id)}>
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openToModal(course.id)}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addChapter(course.id) }>
              <AntDesign name="addfile" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {editing && courseList && (
        <EditCourse id={courseId} courseInfos={courseList} />
      )}
      {chapterEditing && (
        <AddChapter id = {courseId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 50,
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  row2: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    gap: 8,
  },
  courseName: {
    fontSize: 16,
  },
});

export default CourseTable;