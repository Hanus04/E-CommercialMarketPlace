import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function CartIcon({
  size = 22,
  color = "#000",
}: {
  size?: number;
  color?: string;
}) {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.user.currentUser);
  const cartItems = useSelector((s: RootState) => s.cart.items);

  const count = React.useMemo(() => {
    if (!user) return 0;
    return cartItems
      .filter((ci) => ci.CustomerId === user.customerId)
      .reduce((s, it) => s + (it.quantity ?? 0), 0);
  }, [cartItems, user]);

  return (
    <TouchableOpacity
      onPress={() => router.push("/favorites")}
      style={styles.container}
      accessibilityLabel={`Cart, ${count} items`}
    >
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? "99+" : String(count)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
