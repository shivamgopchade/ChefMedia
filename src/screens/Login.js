import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { appTheme } from "../constants";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import CustomButtonRound from "../components/CustomButtonRound";
import { auth } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CustomNote from "../components/CustomNote";
import login from "../assets/illustations/login.jpg";

const Login = ({ navigation }) => {
  const [email, Setemail] = useState("");
  const [pass, Setpass] = useState("");
  const [status, Setstatus] = useState("");

  const HandleLogin = () => {
    console.log(email, pass);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, pass)
      .then((credentials) => {
        const user = credentials.user;
        console.log("user logged in:", user.email);
        navigation.replace("Home");
      })
      .catch((err) => {
        Setstatus("Invalid email or password");
      });
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <ImageBackground
        source={login}
        resizeMode="cover"
        style={{ flex: 1, opacity: 1 }}
        imageStyle={{ opacity: 0.5 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              width: "100%",
              flexDirection: "row",
              top: 0,
            }}
          >
            <CustomButtonRound
              color={appTheme.COLORS.transparentBlack9}
              onPress={() => navigation.replace("Auth")}
              icon={
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={appTheme.COLORS.white}
                />
              }
            />
          </View>
          <Text
            style={{
              ...appTheme.FONTS.body1,
              padding: 5,
              fontFamily: "sans-serif",
              opacity: 1,
              zIndex: 1,
            }}
          >
            Login
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              //console.log(text);
              Setemail(text);
            }}
            style={{
              //border: "solid",
              width: "80%",
              padding: 15,
              borderRadius: 20,
              borderColor: appTheme.COLORS.transparentBlack7,
              borderWidth: 2,
              marginBottom: "5%",
              fontWeight: "bold",
            }}
          />
          <TextInput
            value={pass}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => Setpass(text)}
            style={{
              //border: "solid",
              width: "80%",
              padding: 15,
              borderRadius: 20,
              borderColor: appTheme.COLORS.transparentBlack7,
              borderWidth: 2,
              marginBottom: "5%",
            }}
          />
          {status.length != 0 && (
            <CustomNote
              text={status}
              text_color="black"
              bg_color={appTheme.COLORS.lightGray}
            />
          )}
        </View>

        <View style={{ flex: 0.8 }}>
          <CustomButton
            color={appTheme.COLORS.transparentBlack9}
            onPress={HandleLogin}
            icon={
              <FontAwesome5
                name="arrow-alt-circle-right"
                size={30}
                color="white"
              />
            }
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
