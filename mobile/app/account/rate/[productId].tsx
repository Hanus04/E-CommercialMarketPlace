import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { BASE_URL } from "@/config";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RateScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const user = useSelector((s: RootState) => s.user.currentUser);

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const tags = [
    "Service",
    "Quantity",
    "Payment",
    "Delivery",
    "Promotion",
    "Gift",
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const submitReview = async () => {
    if (comment.trim() === "") return alert("Vui lòng nhập nhận xét!");

    await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        comment,
        tags: selectedTags,
        img: selectedImage,
        ProductproductId2: Number(productId),
        CustomercustomerId2: user?.customerId,
      }),
    });

    alert("✅ Gửi đánh giá thành công!");
    router.back();
  };

  const emotions = [
    { icon: "sad-outline", value: 1 },
    { icon: "help-circle-outline", value: 3 },
    { icon: "happy-outline", value: 5 },
  ] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Emotion */}
      <View style={styles.emotionRow}>
        {emotions.map((e) => (
          <TouchableOpacity key={e.value} onPress={() => setRating(e.value)}>
            <Ionicons
              name={e.icon as any}
              size={35}
              color={rating === e.value ? "#00C2FF" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tags */}
      <View style={styles.tagsWrap}>
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, active && { color: "#00C2FF" }]}>
                {tag}
              </Text>
              <Ionicons
                name={active ? "checkmark" : "add"}
                size={18}
                color={active ? "#00C2FF" : "#333"}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Text */}
      <Text style={styles.subTitle}>Care to share more?</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedbacks"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* Upload images */}
      <Text style={styles.subTitle}>Upload images</Text>
      <View style={styles.imgRow}>
        <TouchableOpacity style={styles.addImgBox} onPress={pickImage}>
          <Ionicons name="add" size={30} color="#7d7d7d" />
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imgBox}>
            <Image source={{ uri: selectedImage }} style={styles.img} />
            <TouchableOpacity
              style={styles.removeImg}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Rating Stars */}
      <Text style={styles.subTitle}>Rating</Text>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => {
          const full = i + 1 <= Math.floor(rating);
          const half = !full && rating > i && rating < i + 1;
          return (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Ionicons
                name={
                  full ? "star" : half ? "star-half-outline" : "star-outline"
                }
                size={34}
                color="#FDB813"
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.btn} onPress={submitReview}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },

  emotionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  tagActive: {
    backgroundColor: "#E6F9FF",
    borderColor: "#00C2FF",
  },
  tagText: { fontSize: 14, color: "#444" },

  subTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  input: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 110,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  imgRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  addImgBox: {
    width: 75,
    height: 75,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
  },
  imgBox: {
    width: 75,
    height: 75,
    borderRadius: 10,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  removeImg: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF4D4D",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 18,
    gap: 8,
  },

  btn: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#00C2FF",
    paddingVertical: 12,
    borderRadius: 30,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
