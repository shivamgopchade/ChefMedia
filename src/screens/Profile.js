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
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import * as Linking from "expo-linking";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import bg from "../assets/illustations/default2.jpg";
import { appTheme } from "../constants";
import { getDatabase, ref, set, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import ProfileEditor from "../components/ProfileEditor";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);
  const [modalVisible, SetmodalVisible] = useState(false);
  const [mediaModal, SetmediaModal] = useState(false);
  const [toggle, Settoggle] = useState(false);
  const [validate, Setvalidate] = useState(false);
  const [image, Setimage] = useState(null);
  const [insta, Setinsta] = useState("");
  const [fb, Setfb] = useState("");
  const [tw, Settw] = useState("");
  const [lnk, Setlnk] = useState("");

  const auth = getAuth();
  const storage = getStorage();
  const id = auth.currentUser.uid;
  const db = getDatabase();
  const dataRef = ref(db, "Profiles/+ " + id);

  const get_image_url = () => {
    getDownloadURL(storage_ref(storage, `Profiles/${id}`))
      .then((url) => {
        Setimage(url);
        //console.log(image);
      })
      .catch((err) => console.log(err));
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      //Setimage(result.uri);
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const img = storage_ref(storage, `Profiles/${id}`);
      uploadBytes(img, blob).then((snapshot) => {
        console.log("image uploaded");
        //navigation.replace("Profile");
        get_image_url();
      });
    }
  };

  useEffect(() => {
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        Setdata(snapshot.val());
        if (snapshot.val().Media) {
          Setinsta(snapshot.val().Media.insta);
          Setfb(snapshot.val().Media.fb);
          Setlnk(snapshot.val().Media.lnk);
          Settw(snapshot.val().Media.tw);
        }
        Setloading(false);
        //console.log(data);
      } else {
        navigation.navigate("ProfileSetter");
      }
    });

    get_image_url();
  }, []);

  const HandleDeleteUser = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        console.log("user removed successfull");
        navigation.replace("Auth");
      })
      .catch((err) => console.log(err));
  };

  const HandleMediaSubmit = () => {
    if (
      (lnk.includes("https://") || lnk.includes("http://")) &&
      (insta.includes("https://") || insta.includes("http://")) &&
      (fb.includes("https://") || fb.includes("http://")) &&
      (tw.includes("https://") || tw.includes("http://"))
    ) {
      console.log("valid");
      set(dataRef, {
        ...data,
        Media: { lnk, insta, fb, tw },
      });
      SetmediaModal(false);
    } else {
      Alert.alert("Error!!", "Invalid link provided");
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      "DELETE ACCOUNT?",
      "Account will be permenantly delete.However your profile will be retained along with your feeds.",
      [
        {
          text: "CANCEL",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "DELETE", onPress: () => HandleDeleteUser() },
      ]
    );

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
              <TouchableOpacity onPress={pickImage}>
                <FontAwesome5 name="images" size={24} color="gray" />
              </TouchableOpacity>
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
            <TouchableOpacity onPress={() => SetmodalVisible(true)}>
              <FontAwesome5 name="user-edit" size={20} color="gray" />
            </TouchableOpacity>
            <ProfileEditor
              data={data}
              modalVisible={modalVisible}
              SetmodalVisible={SetmodalVisible}
              Setvalidate={Setvalidate}
            />

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

            {/* Liked */}
            <TouchableOpacity
              onPress={() => console.log("Liked pressed")}
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
              <AntDesign name="heart" size={30} color={"red"} />
              <Text
                style={{
                  color: appTheme.COLORS.lightGray,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Liked
              </Text>
            </TouchableOpacity>

            {/* Delete Acc */}
            <TouchableOpacity
              onPress={createTwoButtonAlert}
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
              <FontAwesome5 name="user-slash" size={30} color="gray" />
              <Text
                style={{
                  color: appTheme.COLORS.lightGray,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Delete Account
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
                  Linking.openURL(lnk);
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
                  Linking.openURL(insta);
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
                  Linking.openURL(fb);
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
                  Linking.openURL(tw);
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
            <TouchableOpacity
              onPress={() => SetmediaModal(true)}
              style={{
                // margin: 8,
                // padding: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={mediaModal}
            onRequestClose={() => {
              SetmodalVisible(!mediaModal);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: appTheme.COLORS.transparentBlack7,
              }}
            >
              <View
                style={{
                  height: "45%",
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 35,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  overflow: "visible",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity onPress={() => SetmediaModal(false)}>
                    <MaterialIcons name="cancel" size={30} color="black" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={{
                    width: "100%",
                    overflow: "scroll",
                  }}
                  contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 20,
                  }}
                >
                  <AntDesign
                    name="linkedin-square"
                    size={30}
                    color="rgb(10,102,194)"
                  />
                  <TextInput
                    value={lnk}
                    onChangeText={(txt) => Setlnk(txt)}
                    placeholder="Linkedin"
                    style={styles.Mediainput}
                  />

                  <AntDesign
                    name="instagram"
                    size={30}
                    color="rgb(188, 42, 141)"
                  />
                  <TextInput
                    value={insta}
                    onChangeText={(txt) => Setinsta(txt)}
                    placeholder="Instagram"
                    style={styles.Mediainput}
                  />

                  <AntDesign
                    name="facebook-square"
                    size={30}
                    color="rgb(66,103,178)"
                  />
                  <TextInput
                    value={fb}
                    onChangeText={(txt) => Setfb(txt)}
                    placeholder="Facebook"
                    style={styles.Mediainput}
                  />

                  <AntDesign name="twitter" size={30} color="#1DA1F2" />
                  <TextInput
                    value={tw}
                    onChangeText={(txt) => Settw(txt)}
                    placeholder="Twitter"
                    style={styles.Mediainput}
                  />

                  <TouchableOpacity
                    onPress={HandleMediaSubmit}
                    style={{
                      width: "100%",
                      height: "12%",
                      backgroundColor: appTheme.COLORS.blue,
                      borderRadius: 25,
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>SUBMIT</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
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

const styles = StyleSheet.create({
  Mediainput: {
    marginBottom: 5,
    width: "100%",
    height: "12%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    border: "solid",
    borderColor: appTheme.COLORS.transparentBlack7,
  },
});
export default Profile;
