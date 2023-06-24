import { Home, Saved, Profile, Search } from "../screens/Index";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { appTheme, icons } from "../constants/index";
let { COLORS, SIZES, FONTS } = appTheme;
import { View, Text, Image } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: "8%",
          //borderTopLeftEndRadius: 16,
          //borderTopRightRadius: 16,
          //backgroundColor: "#ffff",
          backgroundColor: "black",
        },

        tabBarIcon: ({ focused }) => {
          let name, color;

          switch (route.name) {
            case "kitchen":
              name = focused ? "bowl-mix" : "bowl-mix-outline";
              color = focused ? COLORS.darkGreen : COLORS.gray;
              return (
                <MaterialCommunityIcons name={name} size={26} color={color} />
              );

            case "Search":
              color = focused ? COLORS.darkGreen : COLORS.gray;
              name = focused ? "ios-search-sharp" : "ios-search-outline";
              return <Ionicons name={name} size={26} color={color} />;

            case "Saved":
              color = focused ? COLORS.darkGreen : COLORS.gray;
              name = focused ? "bookmark" : "bookmark-outline";
              return <Ionicons name={name} size={26} color={color} />;

            case "Profile":
              color = focused ? COLORS.darkGreen : COLORS.gray;
              name = focused ? "user-alt" : "user";
              return <FontAwesome5 name={name} size={23} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="kitchen" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Saved" component={Saved} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Tabs;
