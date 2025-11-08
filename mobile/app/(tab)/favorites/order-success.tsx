// app/order-success.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { subtotal, tax, total, card } = useLocalSearchParams<{
    subtotal?: string;
    tax?: string;
    total?: string;
    card?: string;
  }>();

  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      {/* Checkmark */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark" size={50} color="#fff" />
      </View>

      <Text style={styles.title}>Order placed successfully!</Text>
      <Text style={styles.subtitle}>
        Commodo eu ut sunt qui minim fugiat elit nisi enim
      </Text>

      {/* Order summary box */}
      <View style={styles.summaryBox}>
        <Row label="Subtotal" value={`$${subtotal ?? "0"}`} />
        <Row label="Tax (10%)" value={`$${tax ?? "0"}`} />
        <Row label="Fees" value="$0" />
        <Row
          label="Card"
          valueComponent={
            <View style={styles.cardRow}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
                }}
                style={styles.cardIcon}
              />
              <Text style={{ fontSize: 16 }}>****** 2334</Text>
            </View>
          }
        />
        <Row
          label="Total"
          valueComponent={
            <View style={styles.totalRow}>
              <View style={styles.successBadge}>
                <Text style={styles.successText}>Success</Text>
              </View>
              <Text style={styles.totalValue}>${total ?? "0"}</Text>
            </View>
          }
        />
      </View>

      {/* Rating */}
      <Text style={styles.ratingText}>How was your experience?</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={28}
              color={rating >= star ? "#FFD700" : "#aaa"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Back to Home */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => router.push("/(tab)")}
      >
        <Ionicons name="home-outline" size={20} color="#00C4CC" />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({
  label,
  value,
  valueComponent,
}: {
  label: string;
  value?: string;
  valueComponent?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {valueComponent ? (
        valueComponent
      ) : (
        <Text style={styles.rowValue}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#00A3A3",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
  },
  summaryBox: {
    width: "100%",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: "#555",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    width: 40,
    height: 25,
    resizeMode: "contain",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successBadge: {
    backgroundColor: "#E6F9EA",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  successText: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  ratingText: {
    fontSize: 16,
    color: "#444",
    marginTop: 30,
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 4,
  },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00C4CC",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    marginTop: 40,
    gap: 8,
  },
  homeBtnText: {
    color: "#00C4CC",
    fontSize: 18,
    fontWeight: "600",
  },
});
