import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SigninScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ResetScreen from '../screens/ResetScreen';
import { getItem } from '../utils/asyncStorage';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import MyCourses from '../screens/MyCourses';
import StatisticsScreen from '../screens/StatisticsScreen';
import CreateCourses from '../screens/CreateCourses';

const Stack = createStackNavigator();

export default function AppNavigation() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem('onboarded');
    setShowOnboarding(onboarded === 1 ? false : true);
  };

  if (showOnboarding === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={showOnboarding ? 'Onboarding' : 'Home'}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyCourses" component={MyCourses} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{headerTitle:""}}  />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerTitle:""}} />
        <Stack.Screen name="Reset" component={ResetScreen} options={{headerTitle:" "}} /> 
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{headerTitle:""}} />
        <Stack.Screen name='Istatistic' component={StatisticsScreen} options={{headerTitle:""}} />
        <Stack.Screen name='CreateCourses' component={CreateCourses} options={{headerTitle:" "}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
