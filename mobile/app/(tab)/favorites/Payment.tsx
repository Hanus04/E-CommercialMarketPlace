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

  const handlePayNow = () => {
    router.push({
      pathname: "/checkout/order-success",
      params: {
        subtotal: "2800",
        tax: "280",
        total: total ?? "3080",
        card: selected,
      },
    });
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
