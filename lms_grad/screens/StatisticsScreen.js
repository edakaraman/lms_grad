import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
  BarChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { GetIstatisticCourse } from "../services";
import { useUser } from "@clerk/clerk-expo";
import CourseTable from "../components/CourseTable";

export default function StatisticsScreen() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    getCourses();
  }, [courseList, totalIncome]);

  const getCourses = () => {
    GetIstatisticCourse(user.primaryEmailAddress.emailAddress).then((resp) => {
      if (resp && resp.courseLists) {
        setCourseList(resp.courseLists);
      }
    });
  };

  const courseNamelabels = courseList.map((course) => course.name);
  const courseCounterdata = courseList.map((course) => course.counterEnroll);
  const coursePriceData = courseList.map((course) => course.price);
  const courseFreeData = courseList.map((course) => course.free);
  //console.log(courseFreeData); //[true,true]

  const totalCourses = courseList.length;
  const totalPaidCourses = courseList.filter((course) => course.free).length;
  const totalFreeCourses = totalCourses - totalPaidCourses;

  const percentagePaidCourses = (totalPaidCourses / totalCourses) * 100;
  const percentageFreeCourses = (totalFreeCourses / totalCourses) * 100;

  const data2 = {
    labels: ["Ücretli", "Ücretsiz"],
    data: [percentagePaidCourses / 100, percentageFreeCourses / 100],
  };

  const totalEnrollments = courseCounterdata.reduce(
    (total, count) => total + count,
    0
  );
  const coursePercentages = courseCounterdata.map(
    (count) => count / totalEnrollments
  );

  const data = {
    labels: courseNamelabels,
    data: coursePercentages,
  };

  const totalIncome = coursePriceData.reduce((total, price, index) => {
    return total + price * courseCounterdata[index];
  }, 0);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text className="font-bold text-xl ml-4 mt-6 text-center">
          {" "}
          Yayınladığım Kurslar{" "}
        </Text>
        <CourseTable data={courseList} />
        <Text className="text-center font-bold text-xl mt-6">
          🔥 KURS İSTATİSTİKLERİ 🔥
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text className="font-bold text-lg ml-4 ">
            {" "}
            Kursa Kayıtlı Kişi Sayısı
          </Text>
          <BarChart
            data={{
              labels: courseNamelabels,
              datasets: [
                {
                  data: courseCounterdata,
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={250}
            yAxisInterval={1}
            yAxisSuffix=" kişi"
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 14,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "4",
                stroke: "#000000",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 14,
              marginBottom: 20,
            }}
          />
          <Text className="font-bold text-lg ml-4">
            {" "}
            Kurs Kazanç İstatistiği{" "}
          </Text>
          <BarChart
            data={{
              labels: courseNamelabels,
              datasets: [
                {
                  data: coursePriceData.map(
                    (price, index) => price * courseCounterdata[index]
                  ),
                },
              ],
            }}
            width={Dimensions.get("window").width} 
            height={250}
            yAxisInterval={1} 
            yAxisSuffix="₺"
            chartConfig={{
              backgroundColor: "#87CEEB",
              backgroundGradientFrom: "#87CEEB",
              backgroundGradientTo: "#87CEEB",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 14,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "4",
                stroke: "#000000",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 14,
            }}
          />
          <Text className="font-bold m-4 mt-0 text-lg text-green-400">
            {" "}
            💸 Toplam Kazanç: {totalIncome} ₺
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
