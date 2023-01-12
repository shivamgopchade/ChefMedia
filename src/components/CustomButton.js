import { TouchableOpacity, Text, View } from "react-native";
import React from "react";

const CustomButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: props.color,
        margin: "4%",
        borderRadius: 20,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        ...props.customstyle,
      }}
      onPress={props.onPress}
    >
      {props.icon}
      <Text
        style={{
          padding: "2%",
          textAlign: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
