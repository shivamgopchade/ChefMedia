import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { appTheme } from "../constants";
import {
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as Fonts from "expo-font";

const customfonts = {
  DancingBold: require("../assets/fonts/DancingScript-Bold.ttf"),
};

const CustomTitleBar = (props) => {
  const [floaded, Setfloaded] = useState(false);

  const load_font = async () => {
    await Fonts.loadAsync(customfonts);
    Setfloaded(true);
  };
  useEffect(() => {
    load_font();
  }, []);

  const navigation = useNavigation();
  const auth = getAuth();
  const HandleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("signout successfull");
        props.navigation.replace("Auth");
      })
      .catch((err) => console.Console.log(err));
  };
  if (floaded)
    return (
      <View
        style={{
          height: "10%",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: 5,
          backgroundColor: appTheme.COLORS.transparentBlack9,

          shadowColor: "black",
          shadowRadius: 1,
          shadowOffset: { width: 5, height: 5 },
        }}
      >
        <Text
          style={{
            fontFamily: "DancingBold",
            fontSize: 30,
            color: appTheme.COLORS.darkGreen,
          }}
        >
          <MaterialCommunityIcons name="chef-hat" size={30} color="white" />
          ChefMedia
        </Text>
        <View
          style={{
            flexDirection: "row",
            border: "solid",
            width: "26%",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.replace("Create")}
            style={{
              padding: "1%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Octicons name="diff-added" size={26} color="rgb(160, 160, 160)" />
            <Text style={{ color: "white", fontSize: 10, padding: 1 }}>
              CREATE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => HandleLogout()}
            style={{ padding: "1%" }}
          >
            <MaterialIcons name="logout" size={26} color="rgb(171, 171, 171)" />
            <Text style={{ color: "white", fontSize: 10 }}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  else
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
};

export default CustomTitleBar;
