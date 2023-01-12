import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import img from "../assets/images/recipes/recipe.png";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { appTheme } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getDatabase, ref as db_ref, onValue, update } from "firebase/database";

const RecipeContainer = (props) => {
  const navigation = useNavigation();
  const [pimage, Setpimage] = useState(null);
  const [up, Setup] = useState(false);
  const storage = getStorage();
  const db = getDatabase();
  const get_image = (path, Setter) => {
    getDownloadURL(ref(storage, path))
      .then((url) => {
        Setter(url);

        //console.log(url);
      })
      .catch((err) => console.log(err));
  };

  const initUp = () => {
    if (props.data.Upvotes.find((i) => i == props.cid)) Setup(true);
    else Setup(false);
  };
  useEffect(() => {
    get_image(`Profiles/${props.data.uid}`, Setpimage);
    initUp();
  }, []);

  const HandleUpvote = () => {
    let updates = {};
    if (up) {
      props.data.Upvotes = props.data.Upvotes.filter((i) => i != props.cid);
      updates["/Servings/" + props.data.key] = props.data;
      Setup(false);
    } else {
      props.data.Upvotes = [...props.data.Upvotes, props.cid];
      updates["/Servings/" + props.data.key] = props.data;
      Setup(true);
    }
    update(db_ref(db), updates);
  };
  const createTwoButtonAlert = () => {
    if (props.cid != props.data.uid) {
      let s1, s2;
      if (!up) {
        s1 = "Upvote?";
        s2 =
          "Upvote if you think content is authentic and claims true.\nYour vote will help platform to avoid spamming";
      } else {
        s1 = "DownVote?";
        s2 = "Remove your vote?";
      }
      return Alert.alert(s1, s2, [
        {
          text: "CANCEL",
          onPress: () => {
            //console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => {
            HandleUpvote();
          },
        },
      ]);
    }
  };

  const dim = Dimensions.get("window");

  return (
    <View
      style={{
        flex: 1,
        border: "solid",
        //borderWidth: 1,
        borderColor: "gray",
        height: (dim["height"] * 82) / 100,
        //height: "100%",
        //marginBottom: (dim["height"] * 2) / 100,
      }}
    >
      <ImageBackground
        source={props.data.image_uri ? { uri: props.data.image_uri } : img}
        resizeMode="cover"
        style={{ height: "100%" }}
        blurRadius={8}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={{
            borderRadius: 8,
            position: "absolute",
            justifyContent: "flex-end",
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("RecipeDetail", {
                data: { ...props.data },
              })
            }
          >
            <Image
              source={
                props.data.image_uri ? { uri: props.data.image_uri } : img
              }
              style={{
                height: (dim["height"] * 45) / 100,
                width: (dim["height"] * 40) / 100,
                borderRadius: 10,
                backgroundColor: "black",
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                paddingHorizontal: 12,
              }}
            >
              <Image
                source={{ uri: pimage }}
                style={{ height: 38, width: 38, borderRadius: 20 }}
              />
              <Pressable
                onPress={() => {
                  if (props.data.uid != props.cid)
                    return navigation.navigate("UserProfile", {
                      id: props.data.uid,
                      cid: props.cid,
                    });
                  else {
                    return navigation.navigate("Profile");
                  }
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    //fontWeight: "bold",
                  }}
                >
                  {"  "}
                  Shivam
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  padding: 16,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {props.data.Name}{" "}
                {props.data.Veg && (
                  <FontAwesome5
                    name="leaf"
                    size={18}
                    color={appTheme.COLORS.darkGreen}
                  />
                )}
                {!props.data.Veg && (
                  <FontAwesome5 name="bone" size={18} color="red" />
                )}
              </Text>
              <TouchableOpacity
                style={{
                  fontSize: 18,
                  color: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
                onPress={() => createTwoButtonAlert()}
              >
                <Ionicons
                  name="chevron-up-circle"
                  size={38}
                  color={up ? appTheme.COLORS.darkGreen : appTheme.COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", paddingLeft: 8 }}>
              {props.data.Description
                ? props.data.Description
                : "No desciption added"}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default RecipeContainer;
