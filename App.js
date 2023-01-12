import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { Auth, Login, Signup, ProfileSetter } from "./src/screens/Index";
import Auth from "./src/screens/Auth";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import ProfileSetter from "./src/screens/ProfileSetter";
import Tabs from "./src/navigators/Tabs";
import Create from "./src/screens/Create";
import RecipeDetail from "./src/screens/RecipeDetail";
import UserProfile from "./src/screens/UserProfile";

const Stack = createStackNavigator();

export default function App() {
  //console.log(screens);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"Auth"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name="ProfileSetter" component={ProfileSetter} />
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
