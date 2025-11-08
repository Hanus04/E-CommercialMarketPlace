import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const messages = [
  {
    id: "1",
    name: "Shop Điện Tử ABC",
    lastMessage: "Sản phẩm bạn hỏi hiện còn hàng nhé!",
    time: "10:45 AM",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "Shop Thời Trang",
    lastMessage: "Giảm 30% toàn bộ áo khoác hôm nay!",
    time: "09:30 AM",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    name: "Shop Mỹ Phẩm",
    lastMessage: "Bạn nhận được mã giảm giá 50k 🎁",
    time: "Hôm qua",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

export default function InboxScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tin nhắn</Text>
        <Ionicons name="create-outline" size={24} color="#05BCD5" />
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              router.push(`/(tab)/inbox/chatdetail?chatId=${item.id}`)
            }
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  lastMessage: { color: "#6B7280", marginTop: 2 },
  time: { fontSize: 12, color: "#9CA3AF" },
});
