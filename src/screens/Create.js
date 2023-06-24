import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Switch,
  FlatList,
  Button,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import AppIntroSlider from "react-native-app-intro-slider";
import CustomTitleBar from "../components/CustomTitleBar";
import { MaterialIcons } from "@expo/vector-icons";
import bg1 from "../assets/images/system/cook1.jpg";
import bg2 from "../assets/images/system/cook2.jpg";
import bg3 from "../assets/images/system/cook3.jpg";
import bg4 from "../assets/images/system/cook4.jpg";
import { appTheme } from "../constants";
import { KeyboardAvoidingView } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import CustomButtonRound from "../components/CustomButtonRound";
import * as ImagePicker from "expo-image-picker";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
const Create = ({ navigation }) => {
  const [title, SetTitle] = useState("");
  const [currentIngredient, SetcurrentIngredient] = useState("");
  const [currentIngredientCount, SetcurrentIngredientCount] = useState("");
  const [ingredients, Setingredients] = useState([]);
  const [currentStep, SetcurrentStep] = useState("");
  const [steps, Setsteps] = useState([]);
  const [Veg, SetVeg] = useState(true);
  const [count, Setcount] = useState(0);
  const [image, Setimage] = useState(null);
  const [description, Setdescription] = useState("");
  const [time, SetTime] = useState("");
  const [PushToken, SetPushToken] = useState("");
  const [LoadingModal, SetLoadingModal] = useState(false);
  const [pdata, Setpdata] = useState(null);
  //const [pdata,Setpdata]=useState('');

  useEffect(() => {
    FetchPushToken();
  }, []);

  // useEffect(() => {
  //   console.log("$$");
  //   HandleSubmit();
  // }, [pdata]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.2,
    });

    console.log(result);
    if (!result.cancelled) {
      Setimage(result.uri);
    }
  };

  const toggleSwitch = () => SetVeg(!Veg);

  const slides = [
    {
      key: 1,
    },
    {
      key: 2,
    },
    {
      key: 3,
    },
    {
      key: 4,
    },
  ];

  const validator = () => {
    if (
      title != "" &&
      ingredients.length != 0 &&
      steps.length != 0 &&
      image &&
      PushToken.length !== 0
    ) {
      return true;
    }
    return false;
  };

  const FetchPushToken = () => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const dataRef = ref(db, "Profiles/+ " + user.uid);
    onValue(dataRef, (snapshot) => {
      if (snapshot.val()) {
        SetPushToken(snapshot.val().tokens.PushToken);
        Setpdata(snapshot.val());
        //console.log(snapshot.val().tokens.PushToken);
      } else {
        console.log("error occured fetching pushtoken");
      }
    });
  };

  const HandleSubmit = async () => {
    const storage = getStorage();
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const id = uuidv4();

    if (validator()) {
      console.log("valid");
      const response = await fetch(image);
      const blob = await response.blob();
      const img = storage_ref(storage, `Servings/${id}`);
      uploadBytes(img, blob).then((snapshot) => {
        console.log("Uploaded a blob or file!");

        getDownloadURL(storage_ref(storage, `Servings/${id}`))
          .then((url) => {
            const d = new Date();
            console.log(d);
            set(ref(db, `Servings/${id}`), {
              Name: title,
              Ingredients: ingredients,
              Procedure: steps,
              Veg: Veg,
              Description: description ? description : "No description added",
              Time: time,
              image_uri: url,
              uid: user.uid,
              Likes: [],
              Saves: [],
              PushToken: PushToken,
              Upvotes: [],
              Date: `${d.getHours()}:${d.getMinutes()} on ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`,
            });

            if (pdata.Servings) {
              //console.log(pdata.Servings);
              var arr = pdata.Servings;
              arr.push(id);
              //pdata.Servings.push(id);
              set(ref(db, `Profiles/+ ${user.uid}`), {
                ...pdata,
                Servings: arr,
              });
            } else
              set(ref(db, `Profiles/+ ${user.uid}`), {
                ...pdata,
                Servings: [id],
              });
            console.log("done");
            navigation.replace("Home");
          })
          .catch((err) => console.log(err));
      });
    } else {
      Alert.alert(
        "Error!!",
        "Invalid input.Please check all fields are proper"
      );
    }
  };

  const Round = (type) => {
    return (
      <View
        style={{
          backgroundColor: appTheme.COLORS.transparentBlack7,
          borderRadius: 25,
          padding: 5,
          height: "100%",
          width: "100%",
        }}
      >
        <MaterialIcons name={"navigate-" + type} size={35} color="white" />
      </View>
    );
  };

  const RenderIngridientList = (item) => {
    return (
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: appTheme.SIZES.padding,
          margin: "3%",
        }}
        onLongPress={() => {
          //console.log(item);
          const new_list = ingredients.filter((i) => i.key !== item.key);
          //console.log(new_list);
          Setingredients(new_list);
        }}
      >
        <Text style={{ color: "white" }}>{item.ingredient}</Text>
        <Text style={{ color: "white" }}>{item.ingredientQ}</Text>
      </Pressable>
    );
  };

  const RenderStepList = (item) => {
    return (
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: appTheme.SIZES.padding,
          margin: "3%",
        }}
        onLongPress={() => {
          //console.log(item);
          const new_list = steps.filter((i) => i.key !== item.key);
          //console.log(new_list);
          Setsteps(new_list);
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          <Text style={{ color: appTheme.COLORS.lime }}>
            {steps.findIndex((i) => i === item) + 1 + ") "}
          </Text>
          {item.step}
        </Text>
      </Pressable>
    );
  };
  const HandleRender = (item) => {
    //console.log(item.key);
    switch (item.key) {
      case 1:
        return (
          <ImageBackground
            source={bg1}
            imageStyle={{ opacity: 1 }}
            resizeMode="cover"
            style={{ flex: 1 }}
            blurRadius={3}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,1)"]}
              style={{
                height: "100%",
              }}
            >
              <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
                <CustomButtonRound
                  color={appTheme.COLORS.transparentGray}
                  onPress={() => navigation.replace("Home")}
                  icon={
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={appTheme.COLORS.white}
                    />
                  }
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    border: "solid",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "sans-serif",
                      color: "white",
                      fontSize: 28,
                      fontWeight: "bold",
                      padding: 8,
                    }}
                  >
                    Recipe Name
                  </Text>
                  <TextInput
                    style={{
                      margin: "5%",
                      border: "solid",
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      width: "80%",
                      height: "11%",
                      backgroundColor: appTheme.COLORS.transparentBlack7,
                      opacity: 0.5,
                      padding: 8,
                      //paddingVertical: appTheme.SIZES.padding,
                    }}
                    color="white"
                    onChangeText={(text) => SetTitle(text)}
                  />
                  <Text
                    style={{
                      fontFamily: "sans-serif",
                      color: "white",
                      fontSize: 28,
                      fontWeight: "bold",
                      padding: 8,
                    }}
                  >
                    Description
                  </Text>
                  <TextInput
                    style={{
                      margin: "5%",
                      border: "solid",
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      width: "80%",
                      height: "auto",
                      minHeight: "15%",
                      backgroundColor: appTheme.COLORS.transparentBlack7,
                      opacity: 0.5,
                      padding: 8,
                      //paddingVertical: appTheme.SIZES.padding,
                    }}
                    multiline={true}
                    color="white"
                    onChangeText={(text) => Setdescription(text)}
                  />
                  <Text
                    style={{
                      fontFamily: "sans-serif",
                      color: "white",
                      fontSize: 28,
                      fontWeight: "bold",
                      padding: 8,
                    }}
                  >
                    Time required
                  </Text>
                  <TextInput
                    style={{
                      margin: "5%",
                      border: "solid",
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      width: "80%",
                      height: "11%",
                      backgroundColor: appTheme.COLORS.transparentBlack7,
                      opacity: 0.5,
                      padding: 8,
                      //paddingVertical: appTheme.SIZES.padding,
                    }}
                    color="white"
                    onChangeText={(text) => SetTime(text)}
                  />
                </View>
              </KeyboardAvoidingView>
            </LinearGradient>
          </ImageBackground>
        );
      case 2:
        return (
          <View style={{ flex: 1, height: "100%" }}>
            <ImageBackground
              source={bg3}
              imageStyle={{ opacity: 1 }}
              resizeMode="cover"
              style={{ flex: 1, justifyContent: "flex-end" }}
              blurRadius={3}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,1)"]}
                style={{
                  //position: "absolute",
                  //justifyContent: "flex-end",
                  //left: 0,
                  //right: 0,
                  bottom: 0,
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    //justifyContent: "center",
                    //alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "sans-serif",
                      color: appTheme.COLORS.darkLime,
                      fontSize: 35,
                      fontWeight: "bold",
                      padding: 8,
                      opacity: 0.8,
                    }}
                  >
                    Ingredients
                  </Text>
                  <TextInput
                    style={{
                      margin: "5%",
                      border: "solid",
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      width: "80%",
                      height: "11%",
                      backgroundColor: appTheme.COLORS.transparentBlack7,
                      padding: 8,
                      //paddingVertical: appTheme.SIZES.padding,
                    }}
                    placeholder="Item"
                    color="white"
                    onChangeText={(text) => SetcurrentIngredient(text)}
                    value={currentIngredient}
                  />
                  <TextInput
                    style={{
                      margin: "5%",
                      border: "solid",
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      width: "80%",
                      height: "11%",
                      backgroundColor: appTheme.COLORS.transparentBlack7,
                      padding: 8,
                      //paddingVertical: appTheme.SIZES.padding,
                    }}
                    color="white"
                    placeholder="Quantity"
                    onChangeText={(text) => SetcurrentIngredientCount(text)}
                    value={currentIngredientCount}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        currentIngredient.length != 0 &&
                        currentIngredientCount.length != 0
                      ) {
                        Setingredients([
                          ...ingredients,
                          {
                            key: count,
                            ingredient: currentIngredient,
                            ingredientQ: currentIngredientCount,
                          },
                        ]);
                        Setcount(count + 1);
                        //console.log(ingredients);
                        SetcurrentIngredient("");
                        SetcurrentIngredientCount("");
                      }
                    }}
                    style={{
                      height: "8%",
                      width: "50%",
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      backgroundColor: appTheme.COLORS.transparentGray,
                      marginLeft: "5%",
                      //backgroundColor: "rgba(40, 144, 255,0.8)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      ADD
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: appTheme.SIZES.padding,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 25,
                      }}
                    >
                      Item
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 25,
                      }}
                    >
                      Quantity
                    </Text>
                  </View>
                  <ScrollView
                    style={{ flex: 1, width: "100%", marginBottom: "2%" }}
                  >
                    <FlatList
                      data={ingredients}
                      renderItem={({ item }) => RenderIngridientList(item)}
                    />
                  </ScrollView>
                  <Text style={{ color: "gray", padding: 10 }}>
                    Long press to delete item
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        );
      case 3:
        return (
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={bg4}
              imageStyle={{ opacity: 1 }}
              resizeMode="cover"
              style={{ flex: 1 }}
              blurRadius={3}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  //justifyContent: "center",
                  //alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "sans-serif",
                    color: appTheme.COLORS.darkLime,
                    fontSize: 35,
                    fontWeight: "bold",
                    padding: 8,
                    opacity: 0.8,
                  }}
                >
                  Procedure
                </Text>

                <TextInput
                  style={{
                    margin: "5%",
                    border: "solid",
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                    width: "80%",
                    height: "11%",
                    backgroundColor: appTheme.COLORS.transparentBlack7,
                    padding: 8,
                    //paddingVertical: appTheme.SIZES.padding,
                  }}
                  multiline={true}
                  placeholder="Item"
                  color="white"
                  onChangeText={(text) => SetcurrentStep(text)}
                  value={currentStep}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (currentStep.length != 0) {
                      Setsteps([
                        ...steps,
                        {
                          key: count,
                          step: currentStep,
                        },
                      ]);
                      Setcount(count + 1);
                      SetcurrentStep("");
                    }
                  }}
                  style={{
                    height: "8%",
                    width: "50%",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: appTheme.COLORS.transparentGray,
                    marginLeft: "5%",
                    //backgroundColor: "rgba(40, 144, 255,0.8)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    ADD
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,1)"]}
                  style={{
                    width: "100%",
                    flex: 1,
                    height: "100%",
                    paddingHorizontal: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 25,
                    }}
                  >
                    Steps
                  </Text>
                  <ScrollView
                    style={{ flex: 1, width: "100%", marginBottom: "2%" }}
                  >
                    <FlatList
                      data={steps}
                      renderItem={({ item }) => RenderStepList(item)}
                    />
                  </ScrollView>
                  <Text style={{ color: "gray", padding: 10 }}>
                    Long press to delete step
                  </Text>
                </LinearGradient>
              </View>
            </ImageBackground>
          </View>
        );
      default:
        return (
          <View
            style={{
              flex: 1,
            }}
          >
            <ImageBackground
              source={bg2}
              imageStyle={{ opacity: 1 }}
              resizeMode="cover"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
              blurRadius={3}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,1)"]}
                style={{
                  width: "100%",
                  flex: 1,
                  height: "100%",
                  paddingHorizontal: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{
                      height: 400,
                      width: 300,
                      borderRadius: 20,
                      marginBottom: 8,
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    height: "8%",
                    width: "50%",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: appTheme.COLORS.transparentBlack7,
                    marginLeft: "5%",
                    //backgroundColor: "rgba(40, 144, 255,0.8)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      //fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Pick Image
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "sans-serif",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    padding: 8,
                  }}
                >
                  Veg/Non-Veg
                </Text>
                {Veg && (
                  <FontAwesome5
                    name="leaf"
                    size={24}
                    color={appTheme.COLORS.darkGreen}
                  />
                )}
                {!Veg && <FontAwesome5 name="bone" size={24} color="red" />}
                <Switch
                  trackColor={{
                    false: "rgba(255,0,0,0.5)",
                    true: "rgba(0,255,0,0.5)",
                  }}
                  thumbColor="white"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={Veg}
                  style={{ height: "8%" }}
                />
              </LinearGradient>
            </ImageBackground>
          </View>
        );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <CustomTitleBar />
      <AppIntroSlider
        data={slides}
        renderItem={({ item }) => HandleRender(item)}
        onDone={() => {
          SetLoadingModal(true);
          HandleSubmit();
        }}
        showPrevButton={true}
        renderNextButton={() => Round("next")}
        renderPrevButton={() => Round("before")}
      />
      <Modal
        animationType="fade"
        visible={LoadingModal}
        transparent
        onRequestClose={() => {
          SetLoadingModal(!LoadingModal);
        }}
        style={{
          height: "100%",
          width: "100%",
          //borderWidth: 2,
          backgroundColor: appTheme.COLORS.transparentBlack9,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            flex: 1,
            backgroundColor: appTheme.COLORS.transparentBlack9,
          }}
        >
          <ActivityIndicator size="large" color={appTheme.COLORS.darkLime} />
          <Text
            style={{
              fontSize: 24,
              color: appTheme.COLORS.blue,
              paddingBottom: "2%",
            }}
          >
            Hang on
          </Text>
          <Text style={{ fontSize: 12, color: "white" }}>
            This may take few seconds...
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default Create;
