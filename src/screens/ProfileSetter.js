import { View, Image, ImageBackground } from "react-native";
import { appTheme } from "../constants";
import { useEffect, useState } from "react";
import pc from "../assets/illustations/default2.jpg";
import CustomButton from "../components/CustomButton";
import bg from "../assets/illustations/signup2.jpg";
import { Feather } from "@expo/vector-icons";
import ProfileEditor from "../components/ProfileEditor";
import CustomNote from "../components/CustomNote";
import * as ImagePicker from "expo-image-picker";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storage_ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const ProfileSetter = ({ navigation }) => {
  const [modalVisible, SetmodalVisible] = useState(false);
  const [validate, Setvalidate] = useState(false);
  const [note, Setnote] = useState("");
  const [image, Setimage] = useState(null);

  const storage = getStorage();
  const auth = getAuth();
  const id = auth.currentUser.uid;

  const get_image_url = () => {
    getDownloadURL(storage_ref(storage, `Profiles/${id}`))
      .then((url) => {
        Setimage(url);
        console.log(image);
      })
      .catch((err) => console.log(err));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    console.log(result);

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
  const HandleSubmit = () => {
    if (validate) {
      console.log(validate);
      navigation.replace("Home");
    } else {
      Setnote("Invalid fields!");
    }
  };

  useEffect(() => {
    get_image_url();
  }, []);

  return (
    //<KeyboardAvoidingView>
    <View style={{ flex: 1, width: "100%" }}>
      <ImageBackground source={bg} style={{ flex: 1 }} blurRadius={3}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            //width: "100%",
          }}
        >
          <Image
            source={image ? { uri: image } : pc}
            style={{
              borderRadius: 100,
              //borderWidth: "1px",
              //border: "solid",
              height: 200,
              width: 200,
            }}
          />

          <CustomButton
            text="click to change profile picture"
            color="rgba(40, 144, 255,0.9)"
            onPress={() => pickImage()}
          />
          {note.length != 0 && (
            <CustomNote
              text={note}
              text_color="black"
              bg_color={appTheme.COLORS.lightGray}
            />
          )}
        </View>
        <ProfileEditor
          data={{}}
          modalVisible={modalVisible}
          SetmodalVisible={SetmodalVisible}
          Setvalidate={Setvalidate}
        />

        <CustomButton
          onPress={() => SetmodalVisible(true)}
          color={appTheme.COLORS.transparentBlack9}
          icon={<Feather name="chevrons-up" size={28} color="white" />}
        />
        <CustomButton
          onPress={() => HandleSubmit()}
          color="rgba(40, 144, 255,0.8)"
          icon={<Feather name="chevron-right" size={28} color="white" />}
        />
      </ImageBackground>
    </View>
    //</KeyboardAvoidingView>
  );
};

export default ProfileSetter;
