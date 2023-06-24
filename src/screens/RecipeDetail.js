import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { appTheme } from "../constants";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  startAfter,
  onValue,
} from "firebase/database";
import sendPushNotification from "../../SendNotification";

const RecipeDetail = ({ navigation }) => {
  const [like, Setlike] = useState(false);
  const [saved, Setsaved] = useState(false);
  const [pdata, Setpdata] = useState(null);
  const [PushToken, SetPushToken] = useState("");
  const auth = getAuth();
  const db = getDatabase();
  const id = auth.currentUser.uid;

  const route = useRoute();
  const { data } = route.params;
  const { width, height } = Dimensions.get("window");
  const scrollY1 = useRef(new Animated.Value(Math.round(-height / 2))).current;
  const scrollX1 = useRef(new Animated.Value(Math.round(70))).current;
  const scrollY2 = useRef(new Animated.Value(Math.round(height / 2))).current;

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (e, g) => {
      //console.log(g.moveY);
      if (g.moveY < 300) {
        //console.log("set true");
        return true;
      } else return false;
    },
    onPanResponderMove: (e, g) => {
      //console.log("$$");
      if (g.moveY < 300) scrollY2.setValue(g.dy);
    },
    onPanResponderRelease: (e, g) => {
      scrollY2.extractOffset();
    },
  });

  const StartAnimation = () => {
    Animated.parallel([
      Animated.timing(scrollY1, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.in(),
      }),
      Animated.timing(scrollY2, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.in(),
      }),
    ]).start(({ finished }) => {
      Animated.timing(scrollX1, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(2),
      }).start();
    });
  };

  useEffect(() => {
    if (data.Likes && data.Likes.find((e) => e === id)) {
      Setlike(true);
    } else {
      Setlike(false);
    }
    if (data.Saves && data.Saves.find((e) => e === id)) {
      Setsaved(true);
    } else {
      Setsaved(false);
    }

    const dataRef = ref(db, "Profiles/+ " + id);
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        Setpdata(snapshot.val());
        //console.log(snapshot.val());
      } else {
        console.log("error in pdata");
        //navigation.navigate("ProfileSetter");
      }
    });
    onValue(ref(db, "Profiles/+ " + data.uid), (snapshot) => {
      if (snapshot.val()) {
        SetPushToken(snapshot.val().tokens.PushToken);
      } else {
        console.log("error in tokendata");
        //navigation.navigate("ProfileSetter");
      }
    });
  }, []);

  useEffect(() => {
    //console.log("$$");
    StartAnimation();
  }, [PushToken]);

  const LikeHandler = async () => {
    //console.log("pdata in handler", PushToken);

    if (data.Likes) {
      if (like) {
        const new_arr = data.Likes.filter((item) => item != id);
        data.Likes = new_arr;
        const updates = {};
        updates["/Servings/" + data.key] = data;
        //updates["/user-posts/" + uid + "/" + newPostKey] = postData;
        if (pdata.Liked) {
          const new_arr = pdata.Liked.filter((i) => i != data.key);
          pdata.Liked = new_arr;
          updates["/Profiles/+ " + id] = pdata;
        }
        update(ref(db), updates);
        Setlike(false);
      } else {
        data.Likes.push(id);
        //data.Likes = new_arr;
        const updates = {};
        updates["/Servings/" + data.key] = data;
        //updates["/user-posts/" + uid + "/" + newPostKey] = postData;
        if (pdata.Liked) {
          pdata.Liked.push(data.key);
          updates["/Profiles/+ " + id] = pdata;
        } else {
          pdata["Liked"] = [data.key];
          updates["/Profiles/+ " + id] = pdata;
        }
        update(ref(db), updates);
        Setlike(true);
        sendPushNotification(
          PushToken,
          "❤️Like",
          "Someone liked your recipe!!",
          {}
        );
      }
    } else {
      const new_arr = [id];
      data["Likes"] = new_arr;
      const updates = {};
      updates["/Servings/" + data.key] = data;
      if (pdata.Liked) {
        pdata.Liked.push(data.key);
        updates["/Profiles/+ " + id] = pdata;
      } else {
        console.log("key:", data.key);
        pdata["Liked"] = [data.key];
        updates["/Profiles/+ " + id + "/Liked"] = [data.key];
      }
      //updates["/user-posts/" + uid + "/" + newPostKey] = postData;

      update(ref(db), updates);
      Setlike(true);
    }
    return;
  };
  const SaveHandler = () => {
    //console.log("pdata in handler", pdata);
    if (data.Saves) {
      if (saved) {
        const new_arr = data.Saves.filter((item) => item != id);
        data.Saves = new_arr;
        const updates = {};
        updates["/Servings/" + data.key] = data;
        //updates["/user-posts/" + uid + "/" + newPostKey] = postData;
        if (pdata.Saved) {
          const new_arr = pdata.Saved.filter((i) => i != data.key);
          pdata.Saved = new_arr;
          updates["/Profiles/+ " + id] = pdata;
        }
        update(ref(db), updates);
        Setsaved(false);
      } else {
        const new_arr = [...data.Saves, id];
        data.Saves = new_arr;
        const updates = {};
        updates["/Servings/" + data.key] = data;
        //updates["/user-posts/" + uid + "/" + newPostKey] = postData;
        if (pdata.Saved) {
          pdata.Saved = [...pdata.Saved, data.key];
          updates["/Profiles/+ " + id] = pdata;
        } else {
          pdata.Saved = [data.key];
          updates["/Profiles/+ " + id] = pdata;
        }
        update(ref(db), updates);
        Setsaved(true);
      }
    } else {
      const new_arr = [id];
      data.Saves = new_arr;
      const updates = {};
      updates["/Servings/" + data.key] = data;
      if (pdata.Saved) {
        pdata.Saved = [...pdata.Saved, data.key];
        updates["/Profiles/+ " + id] = pdata;
      } else {
        pdata.Saved = [data.key];
        updates["/Profiles/+ " + id] = pdata;
      }
      //updates["/user-posts/" + uid + "/" + newPostKey] = postData;

      update(ref(db), updates);
      Setsaved(true);
    }
    return;
  };
  const renderHeader = () => {
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          //marginBottom: "60%",
          width: "100%",
          height: "45%",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            transform: [{ translateY: scrollY1 }],
          }}
        >
          <Image
            source={{ uri: data.image_uri }}
            style={{
              height: "100%",
              width: "100%",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", appTheme.COLORS.transparentBlack9]}
            style={{
              borderRadius: 8,
              position: "absolute",
              //justifyContent: "space-around",
              left: 0,
              right: 0,
              bottom: 0,
              height: 170,
              alignItems: "center",
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            position: "absolute",
            marginTop: "1%",
            marginLeft: "81%",
            borderRadius: 12,
            height: "38%",
            alignItems: "center",
            transform: [{ translateX: scrollX1 }],
          }}
        >
          <LinearGradient
            colors={["rgba(176, 58, 46,1)", "rgba(176, 58, 46,1)"]}
            style={{
              flex: 1,
              position: "absolute",
              alignItems: "center",
              justifyContent: "space-around",
              height: "100%",
              width: "100%",
              borderRadius: 12,
              //position: "absolute",
              //transform: [{ translateX: scrollX1 }],
              //marginTop: "1%",
              //marginLeft: "81%",
              //borderRadius: 12,
              //borderWidth: 2,
              //backgroundColor: "rgb(255,255,255)",
            }}
          >
            <TouchableOpacity style={{}} onPress={() => LikeHandler()}>
              {like && (
                <AntDesign
                  name="heart"
                  size={30}
                  color={appTheme.COLORS.darkGreen}
                />
              )}
              {!like && <AntDesign name="heart" size={30} color="white" />}
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={() => SaveHandler()}>
              {saved && (
                <Ionicons
                  name="bookmarks"
                  size={30}
                  color={appTheme.COLORS.darkGreen}
                />
              )}
              {!saved && <Ionicons name="bookmarks" size={30} color="white" />}
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <Animated.View
        style={{
          height: "100%",
          marginTop: "80%",
          borderRadius: 20,
          transform: [{ translateY: scrollY2 }],
        }}
        {...pan.panHandlers}
      >
        <LinearGradient
          colors={["rgba(93, 109, 126,1 )", "rgb(40, 55, 71)"]}
          style={{
            height: "100%",
            marginTop: "0%",
            //backgroundColor: "rgba(128, 139, 150 ,1)",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "1%",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2%",
            }}
          >
            <View
              style={{
                height: "100%",
                width: "40%",
                backgroundColor: appTheme.COLORS.gray2,
                borderRadius: 20,
              }}
            ></View>
          </View>
          <ScrollView
            style={{
              flex: 1,
              //borderRadius: 20,
              width: "100%",
              height: "100%",
              //backgroundColor: appTheme.COLORS.transparentBlack5,
            }}
            contentContainerStyle={{ borderRadius: 20 }}
          >
            <View
              style={{
                width: "100%",
                borderRadius: 20,
                padding: 16,
                //backgroundColor: appTheme.COLORS.transparentBlack9,
              }}
            >
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {data.Name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Ionicons
                  name="time"
                  size={24}
                  color={appTheme.COLORS.lightGray}
                />
                <Text style={{ color: appTheme.COLORS.lightGray }}>
                  {data.Time ? data.Time : "not mentioned"}
                </Text>
              </View>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: appTheme.COLORS.darkLime,
                  //color: "rgb(39, 55, 70)",
                  marginBottom: "3%",
                }}
              >
                Ingredients
              </Text>
              {data.Ingredients.map((item) => {
                const [line, Setline] = useState("none");
                return (
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    onLongPress={() => {
                      line === "none"
                        ? Setline("line-through")
                        : Setline("none");
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        opacity: 0.7,
                        textDecorationLine: line,
                      }}
                    >
                      {item.ingredient}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: appTheme.COLORS.lightGreen1,
                        opacity: 1,
                        textDecorationLine: line,
                        textDecorationStyle: "solid",
                        textDecorationColor: "#000",
                      }}
                    >
                      {item.ingredientQ}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: appTheme.COLORS.darkLime,
                  marginBottom: "1%",
                  marginTop: "8%",
                }}
              >
                Procedure
              </Text>
              {data.Procedure.map((item) => {
                const [line, Setline] = useState("none");
                return (
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    onLongPress={() => {
                      line === "none"
                        ? Setline("line-through")
                        : Setline("none");
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        opacity: 0.7,
                        textDecorationLine: line,
                      }}
                    >
                      {item.step}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <Text
            style={{
              color: "gray",
              padding: 10,
              backgroundColor: appTheme.COLORS.transparentBlack9,
            }}
          >
            Long press if done or undo
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

export default RecipeDetail;
