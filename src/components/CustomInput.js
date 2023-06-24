import React from "react";
import { View, Text, TextInput } from "react-native";
import { appTheme } from "../constants";
const CustomInput = (props) => {
  return (
    <View style={{ width: "100%" }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "sans-serif",
          marginBottom: "1%",
          ...props.customstyle,
          fontWeight: "bold",
        }}
      >
        {props.title}
      </Text>
      <TextInput
        placeholder={props.placeholder}
        onChangeText={props.onChange}
        value={props.val}
        style={{
          width: "100%",
          padding: "1%",
          //borderRadius: 20,
          borderColor: appTheme.COLORS.transparentBlack7,
          borderBottomWidth: 2,
          marginBottom: "10%",
          ...props.customstyle,
          color: "black",
        }}
        multiline={props.type}
        numberOfLines={props.numberOfLines}
      />
    </View>
  );
};

export default CustomInput;
