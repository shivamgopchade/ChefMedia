import { View, Text } from "react-native";
import CustomTitleBar from "../components/CustomTitleBar";
import { appTheme } from "../constants";
const Search = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomTitleBar navigation={navigation} />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: appTheme.COLORS.transparentDarkGray,
        }}
      >
        <Text style={{ fontSize: 48 }}>🚧</Text>
        <Text
          style={{
            fontSize: 18,
            color: appTheme.COLORS.lime,
            fontWeight: "bold",
          }}
        >
          Hang Tight
        </Text>
        <Text style={{ fontSize: 12, color: appTheme.COLORS.blue }}>
          search tab is under development
        </Text>
      </View>
    </View>
  );
};

export default Search;
