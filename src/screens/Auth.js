import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { appTheme, icons } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
const login_background = require("../assets/images/system/login-background.png");

const LoginState = (navigation) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigation.replace("Home");
      console.log("user logged in");
    } else {
      console.log("no user logged in");
    }
  });
};

const Auth = ({ navigation, route }) => {
  useEffect(() => {
    LoginState(navigation);
  }, []);

  const renderHeader = () => {
    return (
      <View style={{ height: appTheme.SIZES.height > 700 ? "65%" : "60%" }}>
        <ImageBackground
          source={login_background}
          style={{ flex: 1, justifyContent: "flex-end" }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,1)"]}
          style={{
            position: "absolute",
            justifyContent: "flex-end",
            left: 0,
            right: 0,
            bottom: 0,
            height: 240,
          }}
        >
          <Text
            style={{
              color: "white",
              width: "80%",
              ...appTheme.FONTS.largeTitle,
              fontFamily: "sans-serif",
              lineHeight: 45,
              padding: "2%",
              fontWeight: "bold",
            }}
          >
            Join the platform made for chefs!!
          </Text>
          <Text
            style={{
              color: appTheme.COLORS.gray,
              paddingHorizontal: appTheme.SIZES.padding,
              ...appTheme.FONTS.body3,
              fontFamily: "sans-serif",
            }}
          >
            Share and Explore your favorate recipes and get noticed by millions
            of customers and chefs
          </Text>
        </LinearGradient>
      </View>
    );
  };

  const renderDetail = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: appTheme.SIZES.padding,
        }}
      >
        <CustomButton
          text="LOGIN"
          color={appTheme.COLORS.darkGreen}
          onPress={() => {
            console.log("clicked");
            navigation.replace("Login");
          }}
          icon=<FontAwesome5 name="user-check" size={24} color="black" />
        />
        <CustomButton
          text="SIGNUP"
          color={appTheme.COLORS.darkLime}
          onPress={() => {
            console.log("signup clicked");
            navigation.replace("Signup", route.params);
          }}
          icon=<FontAwesome5 name="user-plus" size={24} color="black" />
        />
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: appTheme.COLORS.black }}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      {renderHeader()}
      {/* Detail */}
      {renderDetail()}
    </View>
  );
};

export default Auth;
