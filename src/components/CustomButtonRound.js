import { TouchableOpacity, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { appTheme } from "../constants";
import React from "react";

const CustomButtonRound = (props) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: props.color,
        margin: "5%",
        borderRadius: 50,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
      onPress={props.onPress}
    >
      {props.icon}
    </TouchableOpacity>
  );
};

export default CustomButtonRound;
