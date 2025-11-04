import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Redirect, useNavigation, useRouter } from "expo-router";
import { productList } from "@/features/product/productSlice";
import { useEffect, useState } from "react";
export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { products, status, error } = useSelector(
    (state: RootState) => state.product
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    dispatch(productList());
  }, [dispatch]);
  const onRefresh = () => {
    setRefreshing(true);
    // gọi API hoặc reload data ở đây
    setTimeout(() => setRefreshing(false), 1500);
  };

  if (user === undefined) return null;
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 8 }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ height: 50, width: 40 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Deals</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          placeholder="Search for product"
          placeholderTextColor="#aaa"
        />
        {query !== "" && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close" size={20} color="#777" />
          </TouchableOpacity>
        )}
      </View>
      {query !== "" && (
        <ScrollView style={{ marginHorizontal: 16, marginTop: 10 }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 10).map((item) => (
              <TouchableOpacity
                key={item.productId}
                style={styles.searchResult}
                onPress={() => router.push(`/product/${item.productId}`)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.resultImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultText}>{item.name}</Text>
                  <Text style={styles.resultPrice}>
                    {item.price.toLocaleString("vi-VN")}₫
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
          )}
        </ScrollView>
      )}

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {[
          {
            title: "Electronics",
            icon: require("@/assets/images/phone.png"),
            color: "#7B61FF",
          },
          {
            title: "Fashion",
            icon: require("@/assets/images/shoes.png"),
            color: "#4069E5",
          },
          {
            title: "Beauty",
            icon: require("@/assets/images/lipstick.png"),
            color: "#ED7C2C",
          },
          {
            title: "Fresh",
            icon: require("@/assets/images/avocado.png"),
            color: "#E05957",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ alignItems: "center", marginRight: 16 }}
            onPress={() => router.push(`/category/${index + 1}`)}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: item.color,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image source={item.icon} style={{ width: 50, height: 50 }} />
            </View>
            <Text style={{ marginTop: 6, fontSize: 13 }}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Shoes</Text>
          <Text style={styles.bannerSubtitle}>50% off</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() =>
              router.push(`/product/${products.at(22)?.productId}`)
            }
          >
            <Text style={styles.buyText}>Buy now</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/product/${products.at(22)?.productId}`)}
        >
          <Image
            source={{ uri: products.at(22)?.imageUrl }}
            style={styles.bannerImage}
          />
        </TouchableOpacity>
      </View>
      {/* Deals with 30% label */}
      <View style={styles.dealContainer}>
        {status === "succeeded" &&
          products.slice(5, 7).map((item) => (
            <View style={styles.dealItem} key={item.productId}>
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.productId}`)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.dealImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.discountLabel}>
                <Text style={styles.discountText}>30%</Text>
              </View>
            </View>
          ))}
      </View>
      {/* Recommended */}
      <View style={styles.recommendedHeader}>
        <Text style={styles.recommendedTitle}>Recommended for you</Text>
        <Text style={styles.viewAll}>View all</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {status === "succeeded" &&
          products.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.productId}
              style={styles.productCard}
              onPress={() => router.push(`/product/${item.productId}`)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  searchInput: { flex: 1, marginLeft: 8, height: 40 },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  categoryItem: { alignItems: "center", marginHorizontal: 10 },
  categoryIconBox: { backgroundColor: "#eee", borderRadius: 50, padding: 12 },
  categoryIcon: { width: 40, height: 40 },
  categoryText: { marginTop: 5, fontSize: 13 },
  banner: {
    backgroundColor: "#eef4ff",
    margin: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: "blue" },
  bannerSubtitle: { color: "#888", marginVertical: 4 },
  buyButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buyText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  bannerImage: { width: 150, height: 150 },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  recommendedTitle: { fontSize: 16, fontWeight: "bold" },
  viewAll: { color: "#0095ff" },
  productCard: { width: 140, marginRight: 12, marginLeft: 16 },
  productImage: { width: 140, height: 120, borderRadius: 10 },
  productTitle: { fontWeight: "bold", marginTop: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { marginLeft: 4 },
  price: { color: "#0095ff", fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "#666", marginTop: 2 },
  dealContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  dealItem: { position: "relative", width: "48%" },
  dealImage: { width: "100%", height: 130, borderRadius: 10 },
  discountLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff7043",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 14,
    height: 45,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  discountText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultPrice: {
    color: "#0077cc",
    fontWeight: "bold",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: "#777",
  },
});
