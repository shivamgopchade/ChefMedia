import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useState, useEffect } from "react";
import { appTheme } from "../constants";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  update,
} from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Comments = (props) => {
  const [text, Settext] = useState("");
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);
  const [usernames, Setusernames] = useState({});
  const [username, Setusername] = useState({});
  const db = getDatabase();
  const dataRef = ref(db, "Servings/" + props.id + "/Comments");
  const navigation = useNavigation();

  const FetchData = () => {
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        //console.log("##", snapshot.val());
        //Setdata(Object.values(snapshot.val()));
        Setdata(snapshot.val());
        //console.log(data);
      }
    });
  };

  const getusername = () => {
    if (data)
      Object.values(data).map((item) => {
        const dataRef = ref(db, "Profiles/+ " + item.uid);
        onValue(dataRef, (snapshot) => {
          if (snapshot.exists()) {
            //console.log(snapshot.val().username);
            username[item.uid] = snapshot.val().username;
            Setusername(username);
          } else {
            console.log("error in username retrieve");
          }
        });
      });
    if (data) Setusernames(username);
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    getusername();
  }, [data]);

  useEffect(() => {
    Setloading(false);
  }, [usernames]);

  const AddComment = () => {
    const updates = {};
    const newPostKey = push(dataRef).key;
    updates[`Servings/${props.id}/Comments/${newPostKey}`] = {
      uid: props.cid,
      comment: text,
    };
    update(ref(db), updates);
    Settext("");
    return;
  };

  const DeleteComment = (key) => {
    console.log(key);
    const updates = {};
    updates[`Servings/${props.id}/Comments/${key}`] = null;
    update(ref(db), updates);
    return;
  };

  const CommentHandler = (item, key) => {
    //console.log("$$", item);
    //const username = getusername(item.uid);
    return (
      <View
        style={{
          flexDirection: "row",
          paddingVertical: "4%",
          borderBottomWidth: 0.5,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            maxWidth: "70%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.SetCommentModal(false);
              item.uid !== props.cid
                ? navigation.navigate("UserProfile", {
                    id: item.uid,
                    cid: props.cid,
                  })
                : navigation.navigate("Profile");
            }}
          >
            <Text style={{ fontWeight: "bold", color: appTheme.COLORS.blue }}>
              {usernames[item.uid] ? usernames[item.uid] : props.username}:{" "}
            </Text>
          </TouchableOpacity>

          <Text>{item.comment}</Text>
        </View>
        {item.uid === props.cid && (
          <TouchableOpacity onPress={() => DeleteComment(key)}>
            <Text style={{ color: "red", fontSize: 12 }}>delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!loading)
    return (
      <View style={{ height: "90%" }}>
        <TextInput
          style={{
            width: "100%",
            borderBottomWidth: 1,
            paddingHorizontal: 5,
            borderColor: "gray",
            marginTop: "3%",

            //backgroundColor: "gray",
          }}
          onChangeText={(txt) => Settext(txt)}
          placeholder="Type your comment"
          value={text}
          multiline
        />
        {text.length > 0 && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: "2%",
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: "2%" }}
              onPress={() => AddComment()}
            >
              <Text style={{ fontSize: 12, color: appTheme.COLORS.darkLime }}>
                post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Settext("")}>
              <Text style={{ fontSize: 12, color: "red" }}>cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {data && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={() => console.log("##")}
          >
            <View
              style={{
                flex: 1,
                marginTop: "2%",
                marginBottom: "6%",
              }}
            >
              {Object.keys(data).map((key) => {
                return CommentHandler(data[key], key);
              })}
              {/* <FlatList
              data={data}
              renderItem={({ item }) => {
                CommentHandler(item);
              }}
            /> */}
            </View>
          </ScrollView>
        )}
        {!data && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ alignItems: "center", fontWeight: "bold" }}>
              No comments
            </Text>
            <Text style={{ alignItems: "center", color: "gray" }}>
              Be first to add comment on this receipe
            </Text>
          </View>
        )}
      </View>
    );
  else {
    return (
      <View style={{ margin: "auto" }}>
        <ActivityIndicator size="large" color={appTheme.COLORS.lime} />
      </View>
    );
  }
};

export default Comments;
