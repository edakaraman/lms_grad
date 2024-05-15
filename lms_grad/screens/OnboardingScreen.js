import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { setItem } from "../utils/asyncStorage";

const { height, width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate("Home");
    setItem("onboarded", "1");
  };

  return (
    <View className="flex-1">
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={{ paddingHorizontal: 15 }}
        skipLabel={"Atla"}
        nextLabel={"Devam Et"}
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require("../assets/animations/boost.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Misyonumuz",
            subtitle:'Misyonumuz, herkesin kendini geliştirebileceği, kolay erişilebilir ve kullanıcı dostu bir öğrenme platformu oluşturmak. Bu platform, kullanıcıların her yerden ve her cihazdan erişebileceği bir öğrenme ortamı sağlamayı hedefliyor.'
          },
          {
            backgroundColor: "#fff",
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require("../assets/animations/resources.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Eğitmen Olabilirsiniz!",
            subtitle:'Bilgi ve deneyimlerinizi paylaşmak için harika bir fırsat! Platformumuz, eğitmen olmak isteyen herkese açık. Kendi kursunuzu oluşturabilir, öğrencilere bilgi ve becerilerinizi aktarabilirsiniz.'
          },
          {
            backgroundColor: "#fff",
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require("../assets/animations/work.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Öğrenci Olabilirsiniz!",
            subtitle:'Öğrenme yolculuğunuza bizimle başlayın! Platformumuz, çeşitli konularda kurslar sunarak herkesin kendini geliştirmesine yardımcı olmayı hedefliyor.'
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  lottie: {
    height: width,
    width: width * 0.9,
  },
});
