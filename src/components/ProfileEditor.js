import React, { useState, useEffect } from "react";
import { View, Text, Switch, Modal, KeyboardAvoidingView } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { appTheme } from "../constants";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { Feather, AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import * as Notifications from "expo-notifications";

const ProfileEditor = ({
  data,
  modalVisible,
  SetmodalVisible,
  Setvalidate = undefined,
}) => {
  //console.log("token:", t);
  const [username, Setusername] = data.username
    ? useState(data.username)
    : useState("");
  const [professional, Setprofessional] = data.professional
    ? useState(data.professional)
    : useState(false);
  const [cuisine, Setcuisine] = data.cuisine
    ? useState(data.cuisine)
    : useState("");
  const [starter, Setstarter] = data.starter
    ? useState(data.starter)
    : useState("");
  const [location, Setlocation] = data.location
    ? useState(data.location)
    : useState("");
  const [tokens, Settokens] = data.tokens
    ? useState(data.tokens)
    : useState("");

  const [validator, Setvalidator] = useState("");
  const toggleSwitch = () => Setprofessional(!professional);
  //console.log("Tokens:", tokens);

  const validate = () => {
    if (!username.length || !cuisine.length || !starter.length) {
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
        starter: starter,
        user_ref: data.user_ref ? data.user_ref : id,
        followers: data.followers ? data.followers : [],
        following: data.following ? data.following : [],
        cuisines: cuisine,
        location: location,
        Servings: data.Servings ? data.Servings : [],
        tokens: data.tokens ? data.tokens : tokens,
      });
      Setvalidate(true);
      SetmodalVisible(false);
    } else {
      console.log("invalid inputs");
      Setvalidator("Please check fields again");
    }
  };

  useEffect(() => {
    Notifications.getExpoPushTokenAsync()
      .then((d) => {
        //console.log("data", d.data);
        Settokens({ PushToken: d.data });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        SetmodalVisible(!modalVisible);
      }}
      style={{
        border: "solid",
        height: "100%",
        width: "100%",
      }}
    >
      <View
        style={{
          backgroundColor: "black",
          justifyContent: "center",
          width: "100%",
          height: "1%",
        }}
      >
        <View></View>
      </View>
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
                //marginBottom: "3%",
                fontSize: 16,
              }}
              title="Username"
              placeholder="Username"
              val={username}
              onChange={(text) => {
                //console.log(text);
                Setusername(text);
              }}
            />
            <CustomInput
              customstyle={{ color: appTheme.COLORS.darkLime }}
              title="Bio"
              placeholder="Your starter"
              val={starter}
              type={true}
              //numberOfLines={4}
              onChange={(text) => {
                Setstarter(text);
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
            {professional && (
              <CustomInput
                customstyle={{ color: appTheme.COLORS.darkLime }}
                title="Restaurant Location"
                placeholder="Location Link"
                val={location}
                onChange={(text) => {
                  Setlocation(text);
                }}
              />
            )}
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
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Modal>
  );
};

export default ProfileEditor;
