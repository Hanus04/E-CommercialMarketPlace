// screens/ReviewListScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { RootState, AppDispatch } from "@/store/store";
import { reviewList } from "@/features/reviews/reviewSlice";
import { Review } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ReviewListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, status, error } = useSelector(
    (state: RootState) => state.review
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const route = useRouter();
  const loadReviews = () => dispatch(reviewList());

  useEffect(() => {
    loadReviews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const renderStars = (rating: number) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.rating}>{renderStars(item.rating)}</Text>
      </View>

      <Text style={styles.comment} numberOfLines={3}>
        {item.comment || "Không có bình luận"}
      </Text>
    </View>
  );

  // Loading
  if (status === "loading" && reviews.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
      </View>
    );
  }

  // Error
  if (status === "failed") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity onPress={loadReviews} style={styles.retryBtn}>
          <Text style={styles.retry}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header với nút Back */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => route.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#34495e" />
        </TouchableOpacity>
        <Text style={styles.title}>Đánh giá ({reviews.length})</Text>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007bff"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
          </View>
        }
        contentContainerStyle={
          reviews.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReviewListScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#34495e",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    borderColor: "#ecf0f1",
  },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  customerId: { fontSize: 13, color: "#7f8c8d", fontWeight: "600" },
  productId: { fontSize: 12, color: "#95a5a6", marginBottom: 8 },
  rating: { fontSize: 18, color: "#f1c40f", letterSpacing: 1 },
  comment: { fontSize: 14.5, color: "#2c3e50", lineHeight: 21 },
  loadingText: { marginTop: 12, fontSize: 15, color: "#7f8c8d" },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#3498db",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retry: { color: "#fff", fontWeight: "600", fontSize: 15 },
  emptyText: { fontSize: 16, color: "#95a5a6", textAlign: "center" },
  emptyContainer: { flex: 1, justifyContent: "center" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ecf0f1",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 6,
  },
});
