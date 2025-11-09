import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BASE_URL } from "@/config";
import { formatVND } from "@/utils/format";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OrderHistory() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.user.currentUser);

  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = user?.customerId;
    if (!customerId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const resOrders = await fetch(
          `${BASE_URL}/orders?CustomercustomerId=${customerId}`
        );
        const ordersData = await resOrders.json();

        const resItems = await fetch(`${BASE_URL}/orderItems`);
        const itemsData = await resItems.json();

        const resProducts = await fetch(`${BASE_URL}/products`);
        const productsData = await resProducts.json();

        setOrders(ordersData);
        setOrderItems(itemsData);
        setProducts(productsData);
      } catch (err) {
        console.log("Error loading:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.customerId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EE4D2D" />
        <Text style={{ marginTop: 8 }}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn đã mua</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16 }}>🛍 Bạn chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          data={orders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={({ item }) => {
            const items = orderItems.filter(
              (oi) => oi.OrderorderId === item.orderId
            );

            return (
              <View style={styles.card}>
                <View style={styles.shopRow}>
                  <Text style={styles.shopName}>🏬 E-Commerce Shop</Text>
                  <Text style={styles.orderStatus}>Hoàn thành</Text>
                </View>

                {items.map((oi) => {
                  const product = products.find(
                    (p) => p.productId === oi.ProductproductId
                  );
                  if (!product) return null;

                  return (
                    <View key={oi.id} style={styles.productRow}>
                      <Image
                        source={{ uri: product.imageUrl }}
                        style={styles.productImg}
                      />
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={styles.productName}>
                          {product.name}
                        </Text>
                        <Text style={styles.productPrice}>
                          {formatVND(product.price)}
                        </Text>
                      </View>
                      <Text style={styles.productQty}>x{oi.quantity}</Text>
                    </View>
                  );
                })}

                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>
                    Tổng tiền ({items.length} sản phẩm):{" "}
                    <Text style={styles.totalPrice}>
                      {formatVND(item.totalAmount)}
                    </Text>
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() =>
                      router.push(`/account/rate/${items[0].ProductproductId}`)
                    }
                  >
                    <Text style={styles.reviewBtnText}>Đánh giá</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
  },

  shopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shopName: { fontWeight: "700", fontSize: 14, color: "#333" },
  orderStatus: { color: "#0c9d37ff", fontWeight: "600", fontSize: 14 },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  productImg: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#f7f7f7",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  productPrice: { fontSize: 13, color: "#666" },
  productQty: { fontSize: 14, color: "#444" },

  totalRow: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 12,
    paddingTop: 10,
  },
  totalText: { fontSize: 14, color: "#333" },
  totalPrice: { color: "#EE4D2D", fontWeight: "700" },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  reviewBtn: {
    borderWidth: 1,
    borderColor: "#EE4D2D",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EE4D2D",
  },
});
