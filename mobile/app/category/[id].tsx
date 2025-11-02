import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo, useState } from "react";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { products } = useSelector((state: RootState) => state.product);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("best");

  const categoryProducts = useMemo(() => {
    let list = products.filter(
      (p: any) =>
        Number(p.CategorycategoryId) === Number(id) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (activeTab === "matched") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (activeTab === "popular") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, id, query, activeTab]);

  const tabs = [
    { key: "best", title: "Best Sales" },
    { key: "matched", title: "Best Matched" },
    { key: "popular", title: "Popular" },
  ];

  const categoryNames: Record<number, string> = {
    1: "Electronics",
    2: "Beauty",
    3: "Fashion",
    4: "Fresh",
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>{categoryNames[Number(id)]}</Text>

        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#aaa" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} />
        </TouchableOpacity>
      </View>

      {/* Category thumbnails */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.link}>See all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        {categoryProducts.slice(0, 3).map((item: any) => (
          <TouchableOpacity key={item.productId} style={styles.thumbCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.thumbImg} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => setActiveTab(t.key)}>
            <Text
              style={[styles.tabText, activeTab === t.key && styles.activeTab]}
            >
              {t.title}
            </Text>
            {activeTab === t.key && <View style={styles.tabLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      {categoryProducts.length > 0 ? (
        categoryProducts.map((item: any) => (
          <TouchableOpacity
            key={item.productId}
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.star}>⭐ {item.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.price}>
              {item.price.toLocaleString("vi-VN")}₫
            </Text>
            <Ionicons
              name="pricetag-outline"
              size={20}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.empty}>Không có sản phẩm nào</Text>
      )}

      {/* See All */}
      <TouchableOpacity style={styles.seeAll}>
        <Text style={{ color: "#666" }}>See all</Text>
      </TouchableOpacity>

      {/* Banner placeholder */}
      <Image
        source={require("@/assets/images/home/banner.png")}
        style={styles.banner}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  searchRow: { flexDirection: "row", marginTop: 16 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  filterBtn: {
    marginLeft: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
  sectionHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: "600", fontSize: 15 },
  link: { color: "#0095ff" },
  thumbCard: {
    width: 90,
    height: 90,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  thumbImg: { width: 60, height: 60 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  tabText: { color: "#888" },
  activeTab: { color: "#05BCD5", fontWeight: "700" },
  tabLine: {
    height: 2,
    backgroundColor: "#05BCD5",
    marginTop: 4,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  img: { width: 65, height: 65, borderRadius: 10, marginRight: 12 },
  name: { fontWeight: "600" },
  star: { marginTop: 2, color: "#f4c20d" },
  price: { fontWeight: "bold", color: "#2a7ae4" },
  seeAll: {
    marginVertical: 16,
    backgroundColor: "#efefef",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 130,
    borderRadius: 12,
    marginBottom: 30,
  },
  empty: { textAlign: "center", marginTop: 20, color: "#777" },
});
