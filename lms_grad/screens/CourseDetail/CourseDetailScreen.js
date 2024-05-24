import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import DetailSection from "./DetailSection";
import ChapterSection from "./ChapterSection";
import { counterEnroll, enrollCourse, GetCounter, getUserEnrolledCourse } from "../../services";
import {useUser} from "@clerk/clerk-expo"
import { CompleteChapterContext } from "../../context/CompleteChapterContext";
import Toast from "react-native-toast-message";
import { useStripe } from "@stripe/stripe-react-native";
import { Alert } from "react-native";

export default function CourseDetailScreen() {
  const params = useRoute().params;
  const {user} = useUser();
  const stripe = useStripe();
  const {isChapterComplete,setIsChapterComplete} = useContext(CompleteChapterContext);
  const [userEnrolledCourse,setUserEnrolledCourse] = useState([]); 

  useEffect(() => {
    if(user && params.course){
       GetUserEnrolledCourse();
    }
  }, [params.course,user]);

  //console.log("params kurs:",params.course.price);

  useEffect(() => {
   isChapterComplete && GetUserEnrolledCourse();

  },[isChapterComplete])


  const UserEnrollCourse = () => {
    enrollCourse(params.course.id,user.primaryEmailAddress.emailAddress)
    .then(resp => {
     if(resp){
      Toast.show({
        type: 'success',
        text1: 'İşlem Başarılı!',
        text2: 'Kursa Kaydoldunuz! 👋',
      });

      GetCounter(params.course.id).then(resp => {
        let counterEnrollValue = resp.courseList.counterEnroll;
        counterEnrollValue = counterEnrollValue + 1 ;
        counterEnroll(params.course.id,counterEnrollValue).then(resp => {
            console.log(resp);
          });
      })
     }
    })
  }
  
  const courseName = params.course.name;
  const coursePrice = params.course.price;

  const stripeEnrollCourse = async () => {
    try {
      const response = await fetch("http://192.168.1.39:3000/pay", {
        method: "POST",
        body: JSON.stringify({ courseName, coursePrice }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        paymentIntentClientSecret: clientSecret,
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error){
        return Alert.alert(presentSheet.error.message);
      }
      else{
        Alert.alert("Ödeme Başarıyla Tamamlandı!");
        UserEnrollCourse();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Bir şeyler yanlış gitti! Lütfen sonra tekrar deneyin...");
    }
  };
  

  const GetUserEnrolledCourse = () => {
    getUserEnrolledCourse(params.course.id,user.primaryEmailAddress.emailAddress)
    .then(resp => {
      //console.log("---",resp.userEnrollCourses);
      setUserEnrolledCourse(resp.userEnrollCourses);
    })
  }

  return params.course && (
    <ScrollView className="p-2">
      <DetailSection stripeEnrollCourse={stripeEnrollCourse} course={params.course} enrollCourse={() => UserEnrollCourse()} userEnrolledCourse={userEnrolledCourse} />
      <ChapterSection chapterList={params.course.chapter} userEnrolledCourse={userEnrolledCourse}/>
    </ScrollView>
  );
}
