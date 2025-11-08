import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { clearCart } from "@/features/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { BASE_URL } from "@/config";

// import BASE_URL from config if needed; currently using API_BASE inside this component

interface PaymentMethod {
  id: string;
  label: string;
  detail: string;
  icon: any;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total?: string }>();
  const [selected, setSelected] = useState<string>("visa");

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.product.products);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Adjust API base depending on running environment (emulator/device)
  // - Android emulator (AVD): 10.0.2.2
  // - iOS simulator / expo web: localhost
  // - Real device: use your machine IP (e.g. http://192.168.x.y:3001)
  const API_BASE = BASE_URL;

  // Helper to compute next numeric id for resources that use numeric ids
  async function nextNumericId(resource: string, idField: string) {
    const res = await fetch(`${API_BASE}/${resource}`);
    if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
    const list = await res.json();
    const max = list.reduce((m: number, it: any) => {
      const v = Number(it[idField] ?? 0);
      return isNaN(v) ? m : Math.max(m, v);
    }, 0);
    return max + 1;
  }

  const paymentMethods: PaymentMethod[] = [
    {
      id: "visa",
      label: "VISA",
      detail: "****** 2334",
      icon: require("@/assets/images/visa.png"),
    },
    {
      id: "master",
      label: "Maestro",
      detail: "****** 3774",
      icon: require("@/assets/images/mastercard.png"),
    },
    {
      id: "paypal",
      label: "PayPal",
      detail: "abc@gmail.com",
      icon: require("@/assets/images/paypal.png"),
    },
  ];

  const handlePayNow = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập trước khi thanh toán");
      return;
    }

    // build user's cart with prices
    const userCart = cartItems
      .filter((ci) => ci.CustomerId === currentUser.customerId)
      .map((ci) => {
        const prod = products.find((p) => p.productId === ci.productId);
        return {
          ...ci,
          price: prod?.price ?? 0,
          subtotal: (prod?.price ?? 0) * ci.quantity,
        };
      });

    if (userCart.length === 0) {
      alert("Giỏ hàng rỗng");
      return;
    }

    try {
      // 1) create order
      const nextOrderId = await nextNumericId("orders", "orderId");
      const orderTotal = userCart.reduce((s, it) => s + it.subtotal, 0);
      const orderPayload = {
        orderId: nextOrderId,
        orderDate: new Date().toISOString().slice(0, 10),
        status: "Đã thanh toán",
        totalAmount: orderTotal,
        CustomercustomerId: currentUser.customerId,
      };

      const createOrderRes = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!createOrderRes.ok) throw new Error("Tạo order thất bại");
      const createdOrder = await createOrderRes.json();

      // 2) create orderItems
      for (const cartItem of userCart) {
        const nextOrderItemId = await nextNumericId(
          "orderItems",
          "orderItemId"
        );
        const orderItemPayload = {
          orderItemId: nextOrderItemId,
          quantity: cartItem.quantity,
          price: cartItem.price,
          subtotal: cartItem.subtotal,
          OrderorderId: createdOrder.orderId ?? createdOrder.id ?? nextOrderId,
          ProductproductId: cartItem.productId,
        };
        const r = await fetch(`${API_BASE}/orderItems`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItemPayload),
        });
        if (!r.ok) throw new Error("Tạo order item thất bại");
      }

      // 3) create payment
      const nextPaymentId = await nextNumericId("payments", "paymentId");
      const paymentPayload = {
        paymentId: nextPaymentId,
        method: selected,
        amount: orderTotal,
        status: "Hoàn tất",
        paymentDate: new Date().toISOString().slice(0, 10),
        OrderorderId: createdOrder.orderId ?? createdOrder.id ?? nextOrderId,
      };
      const payRes = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });
      if (!payRes.ok) throw new Error("Ghi payment thất bại");

      // 4) clear redux cart for this user
      if (currentUser && typeof currentUser.customerId === "number") {
        dispatch(clearCart({ customerId: currentUser.customerId }));
      }

      // 5) navigate to success screen
      router.push({
        pathname: "/(tab)/favorites/order-success",
        params: {
          subtotal: String(orderTotal),
          tax: String(Math.round(orderTotal * 0.1)),
          total: String(orderTotal),
          card: selected,
        },
      });
    } catch (err: any) {
      console.error("Payment/save error:", err);
      alert("Có lỗi khi lưu đơn hàng: " + (err?.message ?? err));
    }
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
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOTAL */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${total ?? "0"}</Text>
        </View>

        {/* Payment Methods */}
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodBox,
              selected === method.id && styles.methodSelected,
            ]}
            onPress={() => setSelected(method.id)}
          >
            <View style={styles.methodLeft}>
              <Image source={method.icon} style={styles.methodIcon} />
              <View>
                <Text style={styles.methodLabel}>{method.label}</Text>
                <Text style={styles.methodDetail}>{method.detail}</Text>
              </View>
            </View>

            <View
              style={[
                styles.radioOuter,
                selected === method.id && styles.radioOuterActive,
              ]}
            >
              {selected === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Pay now */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons name="card-outline" size={18} color="#fff" />
          <Text style={styles.payText}>Pay now</Text>
        </TouchableOpacity>

        {/* Add new card */}
        <TouchableOpacity style={styles.addCard}>
          <Ionicons name="add-outline" size={18} color="#00C6D3" />
          <Text style={styles.addCardText}>Add new card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700" },

  totalBox: { alignItems: "center", marginBottom: 25 },
  totalLabel: { color: "#888", fontSize: 14 },
  totalValue: { fontSize: 32, fontWeight: "700", marginTop: 4 },

  methodBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  methodSelected: { borderColor: "#00C6D3", backgroundColor: "#F0FCFC" },
  methodLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  methodIcon: { width: 40, height: 25, resizeMode: "contain" },
  methodLabel: { fontWeight: "600", fontSize: 15 },
  methodDetail: { color: "#777", fontSize: 14 },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: { borderColor: "#00C6D3" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00C6D3",
  },

  payButton: {
    backgroundColor: "#00C6D3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
  },
  payText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
  },

  addCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  addCardText: {
    color: "#00C6D3",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 4,
  },
});
