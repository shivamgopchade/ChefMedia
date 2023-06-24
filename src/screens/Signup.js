import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { appTheme } from "../constants";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import CustomButtonRound from "../components/CustomButtonRound";
import { auth } from "../../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import CustomNote from "../components/CustomNote";
import signup from "../assets/illustations/signup3.jpg";
import * as Notifications from "expo-notifications";

const Signup = ({ navigation, route }) => {
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
            marginTop: "10%",
            //justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
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
          <View
            style={{
              height: "60%",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              //borderWidth: 1,
              marginTop: "5%",
              paddingHorizontal: "5%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 48,
                marginBottom: "10%",
                color: appTheme.COLORS.blue,
              }}
            >
              Sign Up
            </Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                //console.log(text);
                Setemail(text);
              }}
              style={{
                width: "100%",
                paddingBottom: "1%",
                borderColor: appTheme.COLORS.transparentBlack7,
                marginBottom: "10%",
                fontWeight: "bold",
                borderBottomWidth: 2,
              }}
            />
            <TextInput
              value={pass}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => Setpass(text)}
              style={{
                width: "100%",
                paddingBottom: "1%",
                borderColor: appTheme.COLORS.transparentBlack7,
                marginBottom: "10%",
                fontWeight: "bold",
                borderBottomWidth: 2,
              }}
            />
            {status.length != 0 && (
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: "red" }}>{status}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              borderWidth: 16,
              //width: "60%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: appTheme.COLORS.transparentBlack9,
              height: "10%",
            }}
          >
            <Text style={{ color: appTheme.COLORS.darkLime }}>
              Already Have an Account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={{ color: appTheme.COLORS.blue, fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{}}>
          <CustomButton
            color={appTheme.COLORS.transparentBlack9}
            onPress={HandleLogin}
            text="SIGNUP"
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Signup;
