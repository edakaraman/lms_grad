import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import DetailSection from "./DetailSection";
import ChapterSection from "./ChapterSection";
import { counterEnroll, enrollCourse, GetCounter, getLeaderTable, getUserEnrolledCourse } from "../../services";
import { useUser } from "@clerk/clerk-expo";
import { CompleteChapterContext } from "../../context/CompleteChapterContext";
import Toast from "react-native-toast-message";
import { useStripe } from "@stripe/stripe-react-native";

export default function CourseDetailScreen() {
  const params = useRoute().params;
  const {user} = useUser();
  const stripe = useStripe();
  const {isChapterComplete,setIsChapterComplete} = useContext(CompleteChapterContext);
  const [userEnrolledCourse,setUserEnrolledCourse] = useState([]);
  const [coursePrice, setCoursePrice] = useState(params.course?.price);

  useEffect(() => {
    if (user) {
      getLeaderTable().then((data) => {
        const firstUserEmail = data.userInfos[0]?.email;
        if (user.primaryEmailAddress.emailAddress === firstUserEmail) {
          setCoursePrice((prevPrice) => prevPrice * 0.5);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && params.course) {
      getUserEnrolledCourse(params.course.id, user.primaryEmailAddress.emailAddress)
        .then((resp) => {
          setUserEnrolledCourse(resp.userEnrollCourses);
        });
    }
  }, [params.course, user]);

  useEffect(() => {
    if (isChapterComplete) {
      getUserEnrolledCourse(params.course.id, user.primaryEmailAddress.emailAddress)
        .then((resp) => {
          setUserEnrolledCourse(resp.userEnrollCourses);
        });
    }
  },[isChapterComplete]);


  const handleEnrollCourse = () => {
    enrollCourse(params.course.id, user.primaryEmailAddress.emailAddress)
      .then((resp) => {
        if(resp){
          Toast.show({
            type: 'success',
            text1: 'İşlem Başarılı!',
            text2: 'Kursa Kaydoldunuz! 👋',
            text1Style: { fontSize: 18 },
            text2Style: { fontSize: 16 },
          });

          GetCounter(params.course.id).then((resp) => {
            const counterEnrollValue = resp.courseList.counterEnroll + 1;
            counterEnroll(params.course.id, counterEnrollValue).then((resp) => {
              console.log(resp);
            });
          });
        }
      });
  };

  const handleStripeEnrollCourse = async () => {
    try {
      const response = await fetch("http://192.168.1.45:3000/pay", {
        method: "POST",
        body: JSON.stringify({ courseName: params.course?.name, coursePrice }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert("Ödeme işlemi iptal edildi!");
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        paymentIntentClientSecret: clientSecret,
      });
      if (initSheet.error) return Alert.alert("Ödeme işlemi iptal edildi!");

      const presentSheet = await stripe.presentPaymentSheet({ clientSecret });
      if (presentSheet.error) return Alert.alert("Ödeme işlemi iptal edildi!");

      Alert.alert("Ödeme Başarıyla Tamamlandı!");
      handleEnrollCourse();
    } catch (err) {
      console.error(err);
      Alert.alert("Bir şeyler yanlış gitti! Lütfen sonra tekrar deneyin...");
    }
  };

  return params.course && (
    <ScrollView className="p-2">
      <DetailSection 
        stripeEnrollCourse={handleStripeEnrollCourse} 
        course={params.course} 
        enrollCourse={handleEnrollCourse} 
        userEnrolledCourse={userEnrolledCourse} 
      />
      <ChapterSection 
        chapterList={params.course.chapter} 
        userEnrolledCourse={userEnrolledCourse} 
      />
    </ScrollView>
  );
}
