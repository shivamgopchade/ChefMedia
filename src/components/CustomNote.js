import { View, Text } from "react-native";
import React from "react";
import { appTheme } from "../constants";

const CustomNote = ({ text, text_color, bg_color }) => {
  return (
    <View
      style={{
        backgroundColor: bg_color,
        paddingVertical: 16,
        //border: "solid",
        justifyContent: "center",
        alignItems: "center",
        //borderWidth: 1,
        //maxWidth: "80%",
        width: "80%",

        borderRadius: 20,
        //borderColor: appTheme.COLORS.transparentBlack3,
        opacity: 0.6,
      }}
    >
      <Text
        style={{
          ...appTheme.FONTS.h3,
          color: { text_color },
          fontFamily: "sans-serif",
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default CustomNote;
