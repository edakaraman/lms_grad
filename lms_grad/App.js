import React, { useState } from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import AppNavigation from "./navigation/appNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import ProfileEditScreen from "./screens/ProfileEditScreen";
import MyCourses from "./screens/MyCourses";
import HomeScreenNavigation from "./navigation/HomeScreenNavigation";
import StatisticsScreen from "./screens/StatisticsScreen";
import { CompleteChapterContext } from "./context/CompleteChapterContext";
import {
  UserRoleContext,
} from "./context/UserRoleContext";
import Toast from 'react-native-toast-message';
import { StripeProvider } from "@stripe/stripe-react-native";
import CreateCourses from "./screens/CreateCourses";

const Tab = createBottomTabNavigator();

export default function App() {
  
  const [isChapterComplete,setIsChapterComplete] = useState(false);
  const [userRole, setUserRole] = useState("");
  const publishableKey = "pk_test_51P4SvbDGuEEhG3oSGvo4AJIvABZhmsci064QamNTqpsfnrBe8Mc9uncFvCc6hXdeOXEB8XR2ISssDpeuDv1LpgEm00x9GWQLjN"
  return (
     <StripeProvider
     publishableKey={publishableKey}
     >
    <ClerkProvider
      publishableKey={"pk_test_YXJyaXZpbmctcmFjZXItOTIuY2xlcmsuYWNjb3VudHMuZGV2JA"}
    >
      <UserRoleContext.Provider value={{ userRole, setUserRole }}>
        <CompleteChapterContext.Provider value={{isChapterComplete,setIsChapterComplete}}>
          <SignedIn>
            <NavigationContainer>
              <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen
                  name="Öne Çıkanlar"
                  component={HomeScreenNavigation}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome name="star" color={color} size={size} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Öğrenim İçeriğim"
                  component={MyCourses}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome
                        name="play-circle-o"
                        color={color}
                        size={size}
                      />
                    ),
                  }}
                />
                    {/* <Tab.Screen
                      name="İstatistik"
                      component={StatisticsScreen}
                      options={{
                        tabBarIcon: ({ color, size }) => (
                          <FontAwesome
                            name="bar-chart"
                            color={color}
                            size={size}
                          />
                        ),
                      }}
                    />   
                    <Tab.Screen
                      name="Kurs Ekle"
                      component={CreateCourses}
                      options={{
                        tabBarIcon: ({ color, size }) => (
                          <FontAwesome name="book" color={color} size={size} />
                        ),
                      }}
                    /> */}
                {userRole === "öğretmen" && (
                  <>
                    <Tab.Screen
                      name="İstatistik"
                      component={StatisticsScreen}
                      options={{
                        tabBarIcon: ({ color, size }) => (
                          <FontAwesome
                            name="bar-chart"
                            color={color}
                            size={size}
                          />
                        ),
                      }}
                    />
                    <Tab.Screen
                      name="Kurs Ekle"
                      component={CreateCourses}
                      options={{
                        tabBarIcon: ({ color, size }) => (
                          <FontAwesome name="book" color={color} size={size} />
                        ),
                      }}
                    />
                  </>
                )}
                <Tab.Screen
                  name="Profil"
                  component={ProfileEditScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome name="user" color={color} size={size} />
                    ),
                  }}
                />          
                
              </Tab.Navigator>
              <Toast />
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            <AppNavigation />
          </SignedOut>
        </CompleteChapterContext.Provider>
      </UserRoleContext.Provider>
    </ClerkProvider>
     </StripeProvider>
    
  );
}
