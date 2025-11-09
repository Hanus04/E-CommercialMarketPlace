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
import CartIcon from "@/components/CartIcon";
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
  const [showAll, setShowAll] = useState(false);

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

  const displayProducts = showAll
    ? categoryProducts
    : categoryProducts.slice(0, 3);

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

        <CartIcon />
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
      {displayProducts.length > 0 ? (
        displayProducts.map((item: any) => (
          <TouchableOpacity
            key={item.productId}
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.img} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const full = i + 1 <= Math.floor(item.rating);
                  const half = !full && i < item.rating && item.rating < i + 1;

                  return (
                    <Ionicons
                      key={i}
                      name={
                        full
                          ? "star"
                          : half
                          ? "star-half-outline"
                          : "star-outline"
                      }
                      size={16}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  );
                })}

                <Text style={styles.starNumber}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>

            <Text style={styles.price}>
              {item.price.toLocaleString("vi-VN")}₫
            </Text>

            {/* icon them vo gio hang */}
            <View style={styles.addIcon}>
              <Ionicons name="add" size={18} color="#7B61FF" />
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.empty}>Không có sản phẩm nào</Text>
      )}

      {/* See more */}
      {categoryProducts.length > 3 && (
        <TouchableOpacity
          style={styles.seeAll}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={{ color: "#666", fontWeight: "600" }}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </Text>
        </TouchableOpacity>
      )}

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
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  filterBtn: {
    marginLeft: 10,
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
  },

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
  starNumber: {
    marginLeft: 4,
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },

  img: { width: 65, height: 65, borderRadius: 10, marginRight: 12 },
  name: { fontWeight: "600" },
  star: { marginTop: 2, color: "#f4c20d" },
  price: { fontWeight: "bold", color: "#2a7ae4" },
  addIcon: {
    marginLeft: 10,
    width: 25,
    height: 25,
    borderWidth: 3,
    borderRadius: 14,
    borderColor: "#7B61FF",
    justifyContent: "center",
    alignItems: "center",
  },

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
