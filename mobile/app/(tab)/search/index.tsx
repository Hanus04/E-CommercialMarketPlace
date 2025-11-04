import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { products } = useSelector((state: RootState) => state.product);
  const filter = useSelector((state: RootState) => state.filter);

  const shippingActiveCount = Object.values(filter.shipping).filter(
    Boolean
  ).length;
  const badgeCount =
    shippingActiveCount +
    (filter.rating > 0 ? 1 : 0) +
    (filter.minPrice > 0 || filter.maxPrice < 20000000 ? 1 : 0);

  const filtered = useMemo(() => {
    let filteredList = [...products];

    if (query.trim() !== "") {
      filteredList = filteredList.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (!filter.isApplied) {
      return filteredList;
    }

    return filteredList.filter((p) => {
      const matchPrice =
        p.price >= filter.minPrice && p.price <= filter.maxPrice;

      const matchRating = (p.rating ?? 0) >= filter.rating;

      const activeShipping: string[] = Object.keys(filter.shipping).filter(
        (key) => filter.shipping[key as keyof typeof filter.shipping]
      ) as string[];

      const matchShipping =
        activeShipping.length === 0 ||
        activeShipping.some((method) => p.shipping?.includes(method));

      return matchPrice && matchRating && matchShipping;
    });
  }, [products, query, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
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

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push("/search/filter")}
        >
          <Ionicons name="filter-outline" size={20} color="#050505" />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <TouchableOpacity
              key={item.productId}
              style={styles.card}
              onPress={() => router.navigate(`/product/${item.productId}`)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString("vi-VN")}₫
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#777" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.empty}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  input: { flex: 1, marginLeft: 8, fontSize: 14 },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginVertical: 8,
    marginTop: 10,
    padding: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },

  filterBtn: {
    marginLeft: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  title: { fontSize: 15, fontWeight: "600" },
  price: { marginTop: 4, color: "#0077cc", fontWeight: "bold" },
  empty: { marginTop: 40, textAlign: "center", color: "#777" },
});
