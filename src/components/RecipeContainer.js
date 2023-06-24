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
  Modal,
  Animated,
  PanResponder,
  Easing,
  Vibration,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState, useRef } from "react";
import img from "../assets/images/recipes/recipe.png";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { appTheme } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Comments from "./Comments";
import {
  getDatabase,
  ref as db_ref,
  onValue,
  update,
  get,
} from "firebase/database";
import sendPushNotification from "../../SendNotification";

const RecipeContainer = (props) => {
  const navigation = useNavigation();
  const [pimage, Setpimage] = useState(null);
  const [up, Setup] = useState(false);
  const [username, Setusername] = useState("");
  const [Cusername, SetCusername] = useState("");
  const [CommentModal, SetCommentModal] = useState(false);

  const storage = getStorage();
  const db = getDatabase();

  const SwipeY = useRef(
    new Animated.Value(Math.round(Dimensions.get("window").height / 2))
  ).current;

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (e, g) => {
      //console.log(g.moveY);
      if (g.moveY < 400 && g.dy !== 0) {
        //console.log("set true");
        return true;
      } else return false;
    },

    onPanResponderMove: (e, g) => {
      if (g.dy > 0) SwipeY.setValue(g.dy);
    },
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dy > 0)
        Animated.timing(SwipeY, {
          toValue: Dimensions.get("window").height / 2,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => SetCommentModal(false));
    },
  });

  const startUpAnimation = () => {
    SetCommentModal(true);
    Animated.timing(SwipeY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.in(),
      //delay: 500,
    }).start();
  };

  const startDownAnimation = () => {
    Animated.timing(SwipeY, {
      toValue: Math.round(Dimensions.get("screen").height / 2),
      useNativeDriver: true,
      duration: 500,
      easing: Easing.back(),
    }).start(({ finished }) => SetCommentModal(false));
  };

  const get_image = (path, Setter) => {
    getDownloadURL(ref(storage, path))
      .then((url) => {
        Setter(url);

        //console.log(url);
      })
      .catch((err) => console.log(err));
  };

  const getusername = (uid, Setter) => {
    const dataRef = db_ref(db, "Profiles/+ " + uid);
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        Setter(snapshot.val().username);
      } else {
        console.log("error in username retrieve");
      }
    });
  };
  const initUp = () => {
    if (props.data.Upvotes && props.data.Upvotes.find((i) => i == props.cid))
      Setup(true);
    else Setup(false);
  };

  useEffect(() => {
    get_image(`Profiles/${props.data.uid}`, Setpimage);
    getusername(props.data.uid, Setusername);
    getusername(props.cid, SetCusername);
    initUp();
  }, []);

  const HandleUpvote = () => {
    let updates = {};
    if (up) {
      const new_arr = props.data.Upvotes.filter((i) => i != props.cid);
      updates["/Servings/" + props.data.key + "/Upvotes"] = new_arr;
      update(db_ref(db), updates);
      Setup(false);
    } else {
      if (props.data.Upvotes) {
        console.log("props.cid:", props.cid);
        props.data.Upvotes.push(props.cid);
        updates["/Servings/" + props.data.key + "/Upvotes"] =
          props.data.Upvotes;
      } else {
        //console.log("props.cid:", props.cid);
        updates["/Servings/" + props.data.key + "/Upvotes"] = [props.cid];
      }

      // if (props.data.Upvotes.length == 100) {
      //   sendPushNotification(
      //     PushToken,
      //     "💹",
      //     `You reached 100 upvoters on ${props.data.Name} recipe 🔥`,
      //     {}
      //   );
      // }
      update(db_ref(db), updates);
      Setup(true);
      //console.log("$$");
    }
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
      }}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,1)"]}
        style={{
          borderRadius: 8,
          //position: "absolute",
          justifyContent: "flex-end",
          left: 0,
          right: 0,
          bottom: 0,
          height: (dim["height"] * 82.5) / 100,
          justifyContent: "space-around",
          alignItems: "center",
          width: Dimensions.get("window").width,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RecipeDetail", {
              data: { ...props.data },
            })
          }
          style={{
            shadowColor: "white",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.35,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Image
            source={props.data.image_uri ? { uri: props.data.image_uri } : img}
            style={{
              height: (dim["height"] * 38) / 100,
              width: (dim["height"] * 34) / 100,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            //alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ justifyContent: "flex-end" }}>
            {/* username */}
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
                style={{ height: 30, width: 30, borderRadius: 20 }}
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
                    fontWeight: "bold",
                  }}
                >
                  {"  "}
                  {username}
                </Text>
              </Pressable>
            </View>

            {/*receipe title */}
            <View style={{}}>
              <Text
                style={{
                  color: "white",
                  padding: 16,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {props.data.Veg && (
                  <FontAwesome
                    name="circle"
                    size={20}
                    color={appTheme.COLORS.darkLime}
                  />
                )}
                {!props.data.Veg && (
                  <FontAwesome name="circle" size={20} color="red" />
                )}
                {"  "}
                {props.data.Name}
              </Text>
            </View>
            {/* date */}
            {props.data.Date && (
              <View style={{ paddingHorizontal: 12 }}>
                <Text style={{ color: "gray" }}>{props.data.Date}</Text>
              </View>
            )}
            {/* desciption */}

            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                paddingHorizontal: 12,
              }}
            >
              {props.data.Description
                ? props.data.Description
                : "No desciption added"}
            </Text>
          </View>

          {/* icons */}
          <View style={{ justifyContent: "space-around" }}>
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
              <Text style={{ fontSize: 8, color: "white", padding: 1 }}>
                {props.data.Upvotes ? props.data.Upvotes.length : 0} upvotes
              </Text>
            </TouchableOpacity>

            <View
              style={{
                fontSize: 18,
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
              }}
              //onPress={() => createTwoButtonAlert()}
            >
              <EvilIcons
                name="heart"
                size={38}
                color={appTheme.COLORS.darkLime}
              />
              <Text style={{ fontSize: 8, color: "white", padding: 2 }}>
                {props.data.Likes ? props.data.Likes.length : 0} Likes
              </Text>
            </View>

            <TouchableOpacity
              style={{
                fontSize: 18,
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
              }}
              onPress={() => {
                //SetCommentModal(true);
                startUpAnimation();
              }}
            >
              <EvilIcons
                name="comment"
                size={34}
                color={appTheme.COLORS.blue}
              />
              <Text style={{ fontSize: 8, color: "white", padding: 2 }}>
                {props.data.Comments
                  ? Object.values(props.data.Comments).length
                  : 0}{" "}
                Comments
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <Modal
        animationType="none"
        transparent={true}
        visible={CommentModal}
        onRequestClose={() => {
          SetCommentModal(!CommentModal);
        }}
        style={{
          height: "100%",
          width: "100%",
          //borderWidth: 2,
          //backgroundColor: "blue",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            flex: 1,
            marginTop: "80%",
            //marginTop: SwipeY,
            transform: [{ translateY: SwipeY }],
            height: "65%",
            width: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: "4%",
            paddingVertical: "2%",
            backgroundColor: "white",
          }}
          {...pan.panHandlers}
        >
          <View
            style={{
              width: "100%",
              height: "0.75%",
              alignItems: "center",
              //marginBottom: "3%",
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                width: "35%",
                height: "100%",
                borderRadius: 20,
              }}
            ></View>
          </View>
          <TouchableOpacity
            onPress={() => {
              startDownAnimation();
              //
            }}
            style={{}}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <View>
            <Comments
              cid={props.cid}
              id={props.data.key}
              SetCommentModal={SetCommentModal}
              username={Cusername}
              //pan={pan.panHandlers}
            />
          </View>
        </Animated.View>
      </Modal>
      {/* </ImageBackground> */}
    </View>
  );
};

export default RecipeContainer;
