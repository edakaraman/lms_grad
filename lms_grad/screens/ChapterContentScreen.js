import { ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Content from './ChapterContent/Content'
import {useRoute} from "@react-navigation/native"
import { MarkChapterCompleted } from '../services';
import { CompleteChapterContext } from '../context/CompleteChapterContext';
import Toast from 'react-native-toast-message';

export default function ChapterContentScreen() {
  const param = useRoute().params;
  const {isChapterComplete,setIsChapterComplete} = useContext(CompleteChapterContext);

  useEffect(() => {
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
