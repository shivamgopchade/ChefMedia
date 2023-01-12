import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
const bg = require("../assets/illustations/nodata.jpg");
import CustomTitleBar from "../components/CustomTitleBar";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
import { appTheme } from "../constants";
import RecipeContainer from "../components/RecipeContainer";

const Saved = ({ navigation }) => {
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);

  const auth = getAuth();
  const storage = getStorage();
  const id = auth.currentUser.uid;

  const RecipeHandler = (item) => {
    return <RecipeContainer data={item} />;
  };
  let pd;

  const get_data = () => {
    const db = getDatabase();

    const dataRef2 = ref(db, "Profiles/+ " + id);
    onValue(dataRef2, (snapshot) => {
      if (snapshot.val()) {
        pd = snapshot.val().Saved;
        //Setpdata(snapshot.val().Saved);
        //Setpdata("snapshot is", snapshot.val());
      } else {
        console.log("error occured in servings");
      }
    });
    //console.log("pdata is", pd);
    if (pd) {
      const saved_list = pd.map((item) => {
        let d;
        const dataRef1 = ref(db, "Servings/" + item);
        onValue(dataRef1, (snapshot) => {
          if (snapshot.val()) {
            d = snapshot.val();
          } else {
            console.log("error occured in saved");
          }
        });
        return d;
      });
      //console.log("saved list", saved_list);
      Setdata(saved_list);
      Setloading(false);
    } else {
      Setdata(null);
      Setloading(false);
    }
  };
  const renderNoData = () => {
    return (
      <ImageBackground
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
        source={bg}
        resizeMode="cover"
        blurRadius={0}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: appTheme.COLORS.darkGreen,
            marginTop: "10%",
          }}
        >
          NO SAVINGS FOUND
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: appTheme.COLORS.transparentBlack5,
          }}
        >
          start saving recipes today and revisit later!!
        </Text>
      </ImageBackground>
    );
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      get_data();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const renderContent = () => {
    //console.log(values);
    return (
      <View
        style={{
          flex: 1,
          //backgroundColor: appTheme.COLORS.transparentDarkGray,
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.2)"]}
          style={{ flex: 1 }}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => RecipeHandler(item)}
          />
        </LinearGradient>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <CustomTitleBar navigation={navigation} />
      {!loading && data && renderContent()}
      {!loading && !data && renderNoData()}
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

export default Saved;
