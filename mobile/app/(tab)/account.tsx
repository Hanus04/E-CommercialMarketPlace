import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AccountScreen() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <TouchableOpacity
          onPress={() => router.push("/account/edit-profile")}
          style={styles.settingIcon}
        >
          <Ionicons name="settings-outline" size={22} color="#333" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.fullName || user.userName}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.rowItem}>
          <Ionicons name="call-outline" size={22} color="#0095FF" />
          <Text style={styles.rowText}>{user.phone}</Text>
        </View>

        <View style={styles.rowItem}>
          <Ionicons name="location-outline" size={22} color="#0095FF" />
          <Text style={styles.rowText}>{user.address}</Text>
        </View>
        <View style={styles.rowItem}>
          <Ionicons name="mail-outline" size={22} color="#0095FF" />
          <Text style={styles.rowText}>{user.email}</Text>
        </View>
      </View>

      {/* ✅ Menu / Feature section */}
      <Text style={styles.sectionTitle}>Danh mục</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/account/order-history")}
      >
        <Ionicons name="receipt-outline" size={22} color="#555" />
        <Text style={styles.menuText}>Đơn mua</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color="#bbb"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {/* ✅ Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace("/(auth)/sign-in")}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  header: {
    marginTop: 42,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },
  settingIcon: { position: "absolute", right: 16, marginTop: 20 },

  profileCard: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  userEmail: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  section: {
    backgroundColor: "#fff",
    marginTop: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rowText: { marginLeft: 12, fontSize: 15, color: "#333" },

  sectionTitle: {
    marginTop: 20,
    marginLeft: 18,
    fontWeight: "600",
    fontSize: 15,
    color: "#555",
  },

  menuItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },

  logoutBtn: {
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  logoutText: { color: "#FF3B30", fontWeight: "600", fontSize: 15 },
});
