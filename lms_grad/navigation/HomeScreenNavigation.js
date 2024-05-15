

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeFlowScreen from '../screens/HomeFlowScreen';
import CourseDetailScreen from '../screens/CourseDetail/CourseDetailScreen';
import ChapterContentScreen from '../screens/ChapterContentScreen';
 import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const HomeScreenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Anasayfa"
        component={HomeFlowScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={() => ({
          title: 'Kurs Detayı',
        })}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChapterContent" component={ChapterContentScreen} 
        options={() => ({
          title: 'Bölüm İçeriği',
        })} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigation;
