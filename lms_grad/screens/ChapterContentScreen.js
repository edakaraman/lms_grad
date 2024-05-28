import { ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Content from './ChapterContent/Content'
import {useRoute} from "@react-navigation/native"
import { MarkChapterCompleted } from '../services';
import {useNavigation} from "@react-navigation/native"
import { CompleteChapterContext } from '../context/CompleteChapterContext';
import Toast from 'react-native-toast-message';


export default function ChapterContentScreen() {
  const param = useRoute().params;
  //console.log("Gelen İçerik:", param.content); 
  const navigation = useNavigation();
  const {isChapterComplete,setIsChapterComplete} = useContext(CompleteChapterContext);


  useEffect(() => {
    //console.log("ChapterId",param.chapterId);
   // console.log("RecordId",param.userCourseRecordId);
  },[param])

  const onChapterFinish = () =>{
     MarkChapterCompleted(param.chapterId,param.userCourseRecordId,true).then(resp => {
      if(resp){
        Toast.show({
          type: 'success',
          text1: 'İşlem Başarılı!',
          text2: 'Tebrikler bölümü tamamladınız! 👋',
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 16 }
        });
        setIsChapterComplete(true);
        //navigation.goBack();
      }
     })
  }
  return (
    <ScrollView>
      <Content content={param.content}
       onChapterFinish={() => onChapterFinish()}
      />
    </ScrollView>
  )
}
