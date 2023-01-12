import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import CustomTitleBar from "../components/CustomTitleBar";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
import { appTheme } from "../constants";
import RecipeContainer from "../components/RecipeContainer";

const Home = ({ navigation }) => {
  const [data, Setdata] = useState(null);
  const [loading, Setloading] = useState(true);
  const [count, Setcount] = useState(0);

  const auth = getAuth();
  const storage = getStorage();
  const id = auth.currentUser.uid;

  const RecipeHandler = (item) => {
    //console.log(item);
    return <RecipeContainer data={item} cid={id} />;
  };

  useEffect(() => {
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
            data={values}
            renderItem={({ item }) => RecipeHandler(item)}
          />
        </LinearGradient>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
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
