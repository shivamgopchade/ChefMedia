import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import CustomTitleBar from "../components/CustomTitleBar";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue } from "firebase/database";
import React, { useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
import { appTheme } from "../constants";
import RecipeContainer from "../components/RecipeContainer";

const Home = ({ navigation }) => {
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);
  const [count, Setcount] = useState(0);
  const ScrollX = useRef(new Animated.Value(0)).current;
  const auth = getAuth();
  const storage = getStorage();
  const id = auth.currentUser.uid;

  const RecipeHandler = (item) => {
    //console.log(item);
    return (
      <View style={{ flex: 1, height: "100%", width: "100%" }}>
        <RecipeContainer data={item} cid={id} />
      </View>
    );
  };

  useEffect(() => {
    //***********Getting posts****************
    const db = getDatabase();
    const dataRef = ref(db, "Servings/");
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        Setdata(snapshot.val());
        Setloading(false);
        //console.log(data);
      } else {
        console.log("error occured");
      }
    });
  }, []);

  const renderContent = () => {
    for (const key in data) {
      data[key] = { ...data[key], key: key };
    }
    const values = Object.values(data);
    const width = Dimensions.get("screen").width;

    //console.log(values);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        <View style={{ position: "absolute", height: "100%", width: "100%" }}>
          {values.map((item, ind) => {
            const inputRange = [
              (ind - 1) * width,
              ind * width,
              (ind + 1) * width,
            ];
            //console.log(inputRange);
            const opacity = ScrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.Image
                source={{ uri: item.image_uri }}
                key={`image-${ind}`}
                style={{
                  height: "100%",
                  width: "100%",
                  opacity,
                  position: "absolute",
                }}
                blurRadius={40}
                resizeMode={"cover"}
              />
            );
          })}
        </View>
        <Animated.FlatList
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { x: ScrollX } },
              },
            ],
            { useNativeDriver: true }
          )}
          data={values}
          renderItem={({ item, index }) => RecipeHandler(item)}
          horizontal={true}
          snapToAlignment="start"
          decelerationRate={"fast"}
          snapToInterval={Dimensions.get("window").width}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CustomTitleBar navigation={navigation} />
      {!loading && renderContent()}
      {loading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            flex: 1,
          }}
        >
          <Text>Fetching data...</Text>
          <ActivityIndicator
            size="large"
            color={appTheme.COLORS.transparentBlack9}
          />
        </View>
      )}
    </View>
  );
};

export default Home;
