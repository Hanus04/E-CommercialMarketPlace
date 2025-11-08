import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { updateQuantity, removeFromCart } from "@/features/cart/cartSlice";

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [voucherCode, setVoucherCode] = useState("");
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.product.products);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // item đang được chỉnh sửa
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<string>("");

  if (!currentUser) return <Text>Vui lòng đăng nhập</Text>;

  const userCart = cartItems
    .filter((item) => item.CustomerId === currentUser.customerId)
    .map((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return {
        ...item,
        name: product?.name ?? "Unknown",
        imageUrl: product?.imageUrl ?? "",
        price: product?.price ?? 0,
        subtotal: (product?.price ?? 0) * item.quantity,
      };
    });

  const total = userCart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSave = (itemId: number) => {
    const newQty = parseInt(editedQuantity);
    if (!isNaN(newQty) && newQty > 0) {
      dispatch(updateQuantity({ cartItemId: itemId, quantity: newQty }));
      setEditingId(null);
    } else {
      alert("Số lượng không hợp lệ!");
    }
  };

  const handleDelete = (itemId: number) => {
    dispatch(removeFromCart({ cartItemId: itemId }));
    if (editingId === itemId) setEditingId(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#000"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {userCart.map((item) => (
          <View key={item.cartItemId} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>Consequat ex eu</Text>

              {editingId === item.cartItemId ? (
                <View style={styles.editRow}>
                  <TextInput
                    value={editedQuantity}
                    onChangeText={setEditedQuantity}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: "#00C6D3" }]}
                    onPress={() => handleSave(item.cartItemId)}
                  >
                    <Text style={styles.smallText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: "#ccc" }]}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={styles.smallText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: "#FF6B6B" }]}
                    onPress={() => handleDelete(item.cartItemId)}
                  >
                    <Text style={styles.smallText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.price}>${item.subtotal}</Text>
              )}
            </View>

            <View style={styles.right}>
              {editingId !== item.cartItemId && (
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(item.cartItemId);
                    setEditedQuantity(item.quantity.toString());
                  }}
                >
                  <Ionicons name="pencil-sharp" size={18} color="#777" />
                </TouchableOpacity>
              )}
              <Text style={styles.quantity}>x{item.quantity}</Text>
            </View>
          </View>
        ))}

        {/* Voucher */}
        {/* Voucher */}
        <View style={styles.voucherBox}>
          <Text style={styles.voucherLabel}>Voucher</Text>
          <View style={styles.voucherInput}>
            <TextInput
              placeholder="Enter voucher code"
              value={voucherCode}
              onChangeText={setVoucherCode}
              style={{
                flex: 1,
                fontSize: 15,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#eee",
                paddingHorizontal: 10,
                height: 40,
              }}
            />
            <TouchableOpacity
              disabled={voucherCode.trim() === ""}
              style={[
                styles.applyButton,
                {
                  backgroundColor:
                    voucherCode.trim() === "" ? "#e3e1e6" : "#00C6D3",
                },
              ]}
              onPress={() => {
                if (voucherCode.trim() !== "") {
                  // xử lý apply mã
                  alert(`Áp dụng voucher: ${voucherCode}`);
                }
              }}
            >
              <Text
                style={[
                  styles.applyText,
                  { color: voucherCode.trim() === "" ? "#aaa" : "#fff" },
                ]}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
      </ScrollView>

      {/* Next button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          router.push({
            pathname: "/(tab)/favorites/Payment",
            params: { total: total.toString() },
          })
        }
      >
        <Text style={styles.nextText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  name: { fontWeight: "600", fontSize: 16 },
  desc: { color: "#888", fontSize: 13 },
  quantity: { color: "#888", fontSize: 13 },
  right: { alignItems: "flex-end" },
  price: { fontWeight: "600", fontSize: 16, marginTop: 4 },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 60,

    textAlign: "center",

    marginRight: 2,
  },
  smallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 5,
  },
  smallText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  voucherBox: { marginTop: 20 },
  voucherLabel: { fontWeight: "600", marginBottom: 6 },
  voucherInput: {
    flexDirection: "row",
    borderWidth: 0,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  applyText: {
    fontWeight: "600",

    fontSize: 15,
    color: "#D8D0E5",

    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    alignItems: "center",
  },
  totalLabel: { fontWeight: "700", fontSize: 16 },
  totalValue: { fontWeight: "700", fontSize: 18, color: "#000" },

  nextButton: {
    backgroundColor: "#00C6D3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  applyButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 70,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});
