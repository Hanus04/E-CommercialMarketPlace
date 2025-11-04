import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useReducer, useState } from "react";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useSelector((state: RootState) =>
    state.product.products.find((p) => p.productId === Number(id))
  );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // gọi API hoặc reload data ở đây
    setTimeout(() => setRefreshing(false), 1500);
  };
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  if (!product) return <Text>Không tìm thấy sản phẩm</Text>;
  const images = [product.imageUrl, product.imageUrl, product.imageUrl];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#000" />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <Ionicons name="cart-outline" size={22} color="#000" />
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={{ height: 250 }}>
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            showPagination
            paginationActiveColor="#00BCD4"
            paginationDefaultColor="#ccc"
          >
            {images.map((img, i) => (
              <View key={i} style={{ width: width * 0.9 }}>
                <Image
                  source={{ uri: img }}
                  style={{ width: "100%", height: 250, borderRadius: 10 }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </SwiperFlatList>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>${product.price}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color="#FFD700" size={16} />
              <Text style={{ fontWeight: "500" }}>4.5</Text>
              <Text style={{ color: "#888" }}>(99 reviews)</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>
            {product.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi."}
          </Text>

          <View style={styles.iconRow}>
            <Text style={styles.tag}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={15}
                color="#05BCD5"
              />{" "}
              Express
            </Text>
            <Text style={styles.tag}>
              <Ionicons name="return-up-back" size={15} color="#05BCD5" />{" "}
              30-day return
            </Text>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.tag}>
              <Ionicons name="star-outline" size={15} color="#05BCD5" /> Good
              review
            </Text>
            <Text style={styles.tag}>
              {" "}
              <Ionicons name="medal-outline" size={15} color="#05BCD5" />{" "}
              Authorized shop
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginTop: 8, color: "#8c8282ff" }}>See all</Text>
              <Ionicons
                name="chevron-forward"
                size={15}
                color="#8c8282ff"
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
          <View style={styles.reviewBox}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>4.5/5</Text>
              <Text style={{ color: "#888" }}>(99 reviews)</Text>
              {/*  sao */}
              <View style={{ marginVertical: 10, flexDirection: "row" }}>
                <View style={styles.starRow}>
                  <Ionicons name="star" color="#FFD700" size={14} />
                  <Ionicons name="star" color="#FFD700" size={14} />
                  <Ionicons name="star" color="#FFD700" size={14} />
                  <Ionicons name="star" color="#FFD700" size={14} />
                  <Ionicons name="star-half" color="#FFD700" size={14} />
                </View>
              </View>
            </View>
            <View style={{}}>
              {ratingData.map((item) => (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                  key={item.stars}
                >
                  <Text style={{ alignItems: "center" }}>{item.stars}</Text>
                  <View
                    style={{
                      height: 8,
                      width: 100,
                      backgroundColor: "#676665ff",
                      borderRadius: 20,
                    }}
                  >
                    <View
                      style={{
                        height: 8,
                        width: item.percent,
                        backgroundColor: "#FFD700",
                        borderRadius: 20,
                      }}
                    ></View>
                  </View>
                </View>
              ))}
            </View>
            {/*  đánh giá */}
          </View>
          {dummyReviews.map((r) => (
            <View key={r.id} style={styles.reviewItem}>
              <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>{r.name}</Text>
                <Text style={{ color: "#777", marginBottom: 2 }}>{r.text}</Text>
                <Text style={{ color: "#aaa", fontSize: 12 }}>{r.daysAgo}</Text>
              </View>
            </View>
          ))}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.sectionTitle}>Relevant products</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginTop: 8, color: "#8c8282ff" }}>See all</Text>
              <Ionicons
                name="chevron-forward"
                size={15}
                color="#8c8282ff"
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={styles.relatedItem}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.relatedImg}
                />
                <Text style={styles.relatedName}>{product.name}</Text>
                <Text style={{ color: "#888" }}>${product.price}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.notifyRow}>
            <View
              style={{
                width: size,
                height: size,
                backgroundColor: "#05BCD5",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={30}
                color={"#ffffffff"}
              />
            </View>
            <Text style={{ fontSize: 16, color: "#666262ff" }}>
              Notify me of promotions
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              style={{
                justifyContent: "center",
                marginTop: 20,
                marginRight: 10,
              }}
            />
          </View>
          {/* footer */}

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: "15%",
                borderColor: "#05BCD5",
                borderWidth: 2,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Ionicons
                name="cart-outline"
                size={30}
                color={"#05BCD5"}
                style={{ alignItems: "center" }}
              />
            </View>
            <TouchableOpacity style={styles.buyBtn}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const { width, height } = Dimensions.get("window");
const size = width * 0.13;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  back: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginTop: 10,
  },
  infoSection: { padding: 16 },
  name: { fontSize: 20, fontWeight: "600", marginBottom: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 18, fontWeight: "bold", color: "#000" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  desc: { color: "#555", lineHeight: 20 },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  tag: { color: "#555" },
  reviewBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  relatedItem: { marginRight: 12, alignItems: "center" },
  relatedImg: { width: 100, height: 100, borderRadius: 8 },
  relatedName: { fontWeight: "500", marginTop: 4 },
  notifyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#757979ff",
  },
  buyBtn: {
    backgroundColor: "#05BCD5",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    width: "75%",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    gap: 6,
  },
  starBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  starFill: {
    height: 6,
    backgroundColor: "#FFD700",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    gap: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  ratingRowBar: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 6,
  },
  barFill: {
    height: 8,
    backgroundColor: "#FFC107",
    borderRadius: 4,
    width: 50,
  },
  starNumber: {
    width: 20,
    textAlign: "right",
    fontWeight: "500",
    color: "#444",
  },
});
const dummyReviews = [
  {
    id: 1,
    name: "Jevon Raynor",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Bạn Nhân đỉnh ghê",
    daysAgo: "1 day ago",
    rating: 5,
  },
  {
    id: 2,
    name: "Jason D.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "V Nhân css đẹp qa.",
    daysAgo: "3 days ago",
    rating: 4,
  },
];
const ratingData = [
  { stars: 5, percent: 70 },
  { stars: 4, percent: 50 },
  { stars: 3, percent: 25 },
  { stars: 2, percent: 15 },
  { stars: 1, percent: 5 },
];
