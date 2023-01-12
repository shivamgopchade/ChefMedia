import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import * as Linking from "expo-linking";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import bg from "../assets/illustations/default2.jpg";
import { appTheme } from "../constants";
import { getDatabase, ref, onValue, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";

const UserProfile = ({ route, navigation }) => {
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);
  const [follow, Setfollow] = useState(false);
  const [image, Setimage] = useState(null);
  const [cdata, Setcdata] = useState(null);

  const storage = getStorage();

  const { id, cid } = route.params;
  //console.log(id);
  const auth = getAuth();

  const createTwoButtonAlert = () => {
    let s1, s2;
    if (!follow) {
      s1 = "Follow?";
      s2 =
        "You will get updates from the user.No other user can see your followings and followers too.\nLets keep privacy✌";
    } else {
      s1 = "Unfollow?";
      s2 = "You will stop getting updates from user!!";
    }
    return Alert.alert(s1, s2, [
      {
        text: "CANCEL",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => HandleFollow() },
    ]);
  };

  const get_image_url = () => {
    getDownloadURL(storage_ref(storage, `Profiles/${id}`))
      .then((url) => {
        Setimage(url);
        //console.log(image);
      })
      .catch((err) => console.log(err));
  };
  const db = getDatabase();
  useEffect(() => {
    const dataRef = ref(db, "Profiles/+ " + id);
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        Setdata(snapshot.val());
        let f = snapshot.val();
        //console.log(snapshot.val());
        if (f.followers.find((e) => e == auth.currentUser.uid)) {
          Setfollow(true);
        } else {
          Setfollow(false);
        }
        Setloading(false);
        //console.log(data);
      } else {
        console.log("no user found");
      }
    });
    const dataRef1 = ref(db, "Profiles/+ " + cid);
    onValue(dataRef1, (snapshot) => {
      if (snapshot.val()) {
        //console.log("cdata:", snapshot.val());
        Setcdata(snapshot.val());
      } else {
        console.log("no user found");
      }
    });
    get_image_url();
  }, []);

  const HandleFollow = () => {
    //console.log("follow pressed");
    let updates = {};
    if (!follow) {
      data.followers = [...data.followers, cid];
      cdata.following = [...cdata.following, id];
      //console.log("data:", data.followers);
      //console.log("cdata:", cdata.following);
      updates["/Profiles/+ " + id] = data;
      updates["/Profiles/+ " + cid] = cdata;
      update(ref(db), updates);
      Setfollow(true);
      console.log("updated");
    } else {
      data.followers = data.followers.filter((i) => i !== auth.currentUser.uid);
      cdata.following = cdata.following.filter((i) => i != id);
      //console.log(data.followers);
      //console.log("data:", data.followers);
      //console.log("cdata:", cdata.following);
      updates["/Profiles/+ " + id] = data;
      updates["/Profiles/+ " + cid] = cdata;
      update(ref(db), updates);
      Setfollow(false);
      console.log("updated");
    }
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          //marginBottom: "60%",
          width: "100%",
          height: "50%",
        }}
      >
        <Image
          source={image ? { uri: image } : bg}
          style={{
            height: "100%",
            width: "100%",
          }}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={{
          marginTop: "80%",
          width: "100%",
          borderRadius: 20,
        }}
        contentContainerStyle={{ borderRadius: 20 }}
      >
        <View
          style={{
            width: "100%",
            borderRadius: 20,
            padding: 8,
            backgroundColor: appTheme.COLORS.lightGray,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              {/* title */}
              <Text
                style={{
                  ...appTheme.FONTS.largeTitle,
                  fontFamily: "sans-serif",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                {data.username}
                {data.professional && (
                  <MaterialCommunityIcons
                    name="professional-hexagon"
                    size={30}
                    color="blue"
                  />
                )}
              </Text>
              {!follow && (
                <TouchableOpacity
                  onPress={() => createTwoButtonAlert()}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2%",
                    width: "28%",
                    //borderWidth: 1,
                    borderRadius: 20,
                    backgroundColor: appTheme.COLORS.darkLime,
                  }}
                >
                  <Text style={{ color: "white" }}>Follow</Text>
                </TouchableOpacity>
              )}
              {follow && (
                <TouchableOpacity
                  onPress={() => createTwoButtonAlert()}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2%",
                    width: "28%",
                    borderRadius: 20,
                    backgroundColor: appTheme.COLORS.transparentBlack9,
                  }}
                >
                  <Text style={{ color: "white" }}>Unfollow</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ fontSize: 16, color: "gray" }}>
              {data.City}|{data.Country}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: appTheme.COLORS.transparentDarkGray,
              }}
            >
              {data.starter}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: appTheme.COLORS.transparentDarkGray,
                fontWeight: "bold",
              }}
            >
              Cuisines:
              {data.cuisine}
            </Text>

            {/* statistics */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "5%",
                marginBottom: "5%",
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: appTheme.COLORS.lime,
                    fontWeight: "bold",
                  }}
                >
                  Followers
                </Text>
                <Text
                  style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}
                >
                  {data.followers.length}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: appTheme.COLORS.lime,
                    fontWeight: "bold",
                  }}
                >
                  Following
                </Text>
                <Text
                  style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}
                >
                  {data.following.length}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: appTheme.COLORS.lime,
                    fontWeight: "bold",
                  }}
                >
                  Servings
                </Text>
                <Text
                  style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}
                >
                  0
                </Text>
              </View>
            </View>
          </View>

          {/* Content Modals */}

          {/* Servings */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              //alignItems: "center",
              height: (15 * Dimensions.get("window").height) / 100,
              //borderWidth: 5,
              flex: 1,
              margin: 2,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => console.log("servings pressed")}
              style={{
                width: "30%",
                height: "100%",
                //padding: 12,
                marginBottom: "5%",
                backgroundColor: appTheme.COLORS.transparentDarkGray,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="menu-book"
                size={34}
                color={appTheme.COLORS.lime}
              />
              <Text
                style={{
                  color: appTheme.COLORS.lightGray,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Servings
              </Text>
            </TouchableOpacity>
          </View>
          {/* Connections */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                try {
                  Linking.openURL(data.Media.lnk);
                } catch (e) {
                  console.log("error in opening linkedin");
                }
              }}
              style={{
                //margin: 8,
                //padding: 5,
                borderRadius: 50,
              }}
            >
              <AntDesign
                name="linkedin-square"
                size={30}
                color="rgb(10,102,194)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                try {
                  Linking.openURL(data.Media.insta);
                } catch (e) {
                  console.log("error in opening insta");
                }
              }}
              style={{
                // margin: 8,
                // padding: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign name="instagram" size={30} color="rgb(188, 42, 141)" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  Linking.openURL(data.Media.fb);
                } catch (e) {
                  console.log("error in opening fb");
                }
              }}
              style={{
                // margin: 8,
                // padding: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign
                name="facebook-square"
                size={30}
                color="rgb(66,103,178)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                try {
                  Linking.openURL(data.Media.tw);
                } catch (e) {
                  console.log("error in opening tw");
                }
              }}
              style={{
                // margin: 8,
                // padding: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign name="twitter" size={30} color="#1DA1F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      {!loading && renderContent()}
      {loading && (
        <View style={{ margin: "auto" }}>
          <ActivityIndicator size="large" color={appTheme.COLORS.lime} />
        </View>
      )}
    </View>
  );
};

export default UserProfile;
