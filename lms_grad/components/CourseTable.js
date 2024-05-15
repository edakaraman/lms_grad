import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import {
  deleteCourse,
  idToCourse,
  publishCourse,
  updateCourse,
} from "../services";
import EditCourse from "./EditCourse";

const CourseTable = ({ data }) => {
  const [courseList, setCourseList] = useState(null);
  const [editing, setEditing] = useState(false);
  const [courseData, setCourseData] = useState(data); // Yeni oluşturulan dizi
  const [courseId,setCourseId] = useState(null);

  const handleDelete = (courseId) => {
    console.log("course id:", courseId);
    deleteCourse(courseId).then(() => {
      Alert.alert("Silme İşlemi Başarılı!", "Kurs silindi.");
    });
  };
 // console.log("sdkskdf",courseList);

  const openToModal = (courseId) => {
    setEditing(true);
    idToCourse(courseId).then((resp) => {
      setCourseList(resp.courseList);
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
            <Button title="Sil" onPress={() => handleDelete(course.id)} />
            <Button title="Düzenle" onPress={() => openToModal(course.id)} />
          </View>
        </View>
      ))}
      {editing && courseList && <EditCourse id={courseId} courseInfos={courseList} />}
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
