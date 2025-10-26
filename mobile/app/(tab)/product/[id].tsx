import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Chi tiết sản phẩm: {id}</Text>
    </View>
  );
}
