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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import CustomNote from "../components/CustomNote";
import signup from "../assets/illustations/signup3.jpg";

const Signup = ({ navigation }) => {
  const [email, Setemail] = useState("");
  const [pass, Setpass] = useState("");
  const [status, Setstatus] = useState("");

  const HandleLogin = () => {
    console.log(email, pass);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, pass)
      .then((credentials) => {
        const user = credentials.user;
        console.log("user signed in:", user.email);
        navigation.replace("ProfileSetter");
      })
      .catch((err) => {
        if (
          err == "FirebaseError: Firebase: Error (auth/email-already-in-use)."
        ) {
          Setstatus("User already exists");
        }
        //console.log(err);
        else Setstatus("Invalid email or password");
      });
    console.log("done");
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <ImageBackground
        source={signup}
        imageStyle={{ opacity: 0.5 }}
        resizeMode="cover"
        style={{ flex: 1 }}
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
            }}
          >
            SignUp
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              //console.log(text);
              Setemail(text);
            }}
            style={{
              border: "solid",
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
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => Setpass(text)}
            style={{
              border: "solid",
              width: "80%",
              padding: 15,
              borderRadius: 20,
              borderColor: appTheme.COLORS.transparentBlack7,
              borderWidth: 2,
              marginBottom: "5%",
              fontWeight: "bold",
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

export default Signup;
