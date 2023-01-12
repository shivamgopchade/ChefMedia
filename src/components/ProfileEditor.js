import React, { useState } from "react";
import { View, Text, Switch, Modal, KeyboardAvoidingView } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { appTheme } from "../constants";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { Feather, AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native";

const ProfileEditor = ({
  data,
  modalVisible,
  SetmodalVisible,
  Setvalidate = undefined,
}) => {
  const [username, Setusername] = data.username
    ? useState(data.username)
    : useState("");
  const [professional, Setprofessional] = data.professional
    ? useState(data.professional)
    : useState(false);
  const [cuisine, Setcuisine] = data.cuisine
    ? useState(data.cuisine)
    : useState("");
  const [city, Setcity] = data.City ? useState(data.City) : useState("");
  const [Country, SetCountry] = data.Country
    ? useState(data.Country)
    : useState("");

  const [starter, Setstarter] = data.starter
    ? useState(data.starter)
    : useState("");
  const [validator, Setvalidator] = useState("");

  const toggleSwitch = () => Setprofessional(!professional);

  const validate = () => {
    if (
      !username.length ||
      !cuisine.length ||
      !city.length ||
      !Country.length ||
      !starter.length
    ) {
      return false;
    }
    return true;
  };

  const HandleSubmit = () => {
    if (validate()) {
      const db = getDatabase();
      const auth = getAuth();
      const user = auth.currentUser;
      const id = user.uid;
      set(ref(db, `Profiles/+ ${id}`), {
        username: username,
        professional: professional,
        cuisine: cuisine,
        City: city,
        Country: Country,
        starter: starter,
        user_ref: data.user_ref ? data.user_ref : id,
        followers: data.followers ? data.followers : [id],
        following: data.following ? data.following : [id],
        cuisines: cuisine,
      });
      Setvalidate(true);
      SetmodalVisible(false);
    } else {
      console.log("invalid inputs");
      Setvalidator("Please check fields again");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        SetmodalVisible(!modalVisible);
      }}
      style={{ border: "solid", height: "100%", width: "100%" }}
    >
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: appTheme.COLORS.transparentBlack7,
        }}
      >
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: appTheme.SIZES.padding,
              backgroundColor: appTheme.COLORS.gray2,
              borderTop: 5,
              borderColor: appTheme.COLORS.transparentBlack7,
              //borderTopWidth: "1%",
              borderRadius: 8,
            }}
          >
            <CustomInput
              customstyle={{
                color: appTheme.COLORS.darkLime,
                marginBottom: "3%",
                fontSize: 16,
              }}
              title="Enter your username"
              placeholder="Username"
              val={username}
              onChange={(text) => {
                //console.log(text);
                Setusername(text);
              }}
            />
            <CustomInput
              customstyle={{ color: appTheme.COLORS.darkLime }}
              title="Describe yourself in short"
              placeholder="Your starter"
              val={starter}
              type={true}
              numberOfLines={4}
              onChange={(text) => {
                Setstarter(text);
              }}
            />
            <CustomInput
              customstyle={{ color: appTheme.COLORS.darkLime }}
              title="Enter your current working city"
              placeholder="Working city"
              val={city}
              onChange={(text) => {
                Setcity(text);
              }}
            />
            <CustomInput
              customstyle={{ color: appTheme.COLORS.darkLime }}
              title="Enter your current working country"
              placeholder="Working country"
              val={Country}
              onChange={(text) => {
                SetCountry(text);
              }}
            />

            <CustomInput
              customstyle={{ color: appTheme.COLORS.darkLime }}
              title="What type of cuisine you are interested in and love to serve"
              placeholder="Fav Cuisine"
              val={cuisine}
              onChange={(text) => {
                Setcuisine(text);
              }}
            />

            {professional && <Text>Professional</Text>}
            {!professional && <Text>Non-Professional</Text>}
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={professional ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={professional}
              style={{ height: "5%" }}
            />
            <Text>{validator}</Text>
            <CustomButton
              onPress={() => HandleSubmit()}
              text="SUBMIT"
              color={appTheme.COLORS.transparentBlack9}
              customstyle={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            {/* <CustomButton
              onPress={() => SetmodalVisible(false)}
              //color={appTheme.COLORS.transparentBlack9}
              icon={
                <Feather
                  name="chevrons-down"
                  size={28}
                  color={appTheme.COLORS.transparentBlack9}
                />
              }
              //customstyle={{ width: "100%", border: "solid" }}
            /> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Modal>
  );
};

export default ProfileEditor;
