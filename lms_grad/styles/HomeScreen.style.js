import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
      text: {
        fontSize: width * 0.1,
        marginTop:30,
        marginLeft:10,
        marginBottom:20,
      },
      routeText:{
        fontSize:width*0.05,
        fontWeight:"900"
      },
      endContainer: {
        position: "absolute",
        flexDirection: "row", // Metinleri yatayda sırala
        justifyContent: "flex-end", // Yatayda en sağa yerleştir
        alignItems: "flex-end", // Dikeyde en alta yerleştir
        bottom: width * 0.09,
        right: width * 0.009,
        marginBottom: 30,
        marginRight:20,
      },
});