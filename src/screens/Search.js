import { View, Text } from "react-native";
import CustomTitleBar from "../components/CustomTitleBar";
const Search = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomTitleBar navigation={navigation} />
      <Text>Search Screen</Text>
    </View>
  );
};

export default Search;
