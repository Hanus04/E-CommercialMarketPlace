import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters, resetFilters } from "@/features/filter/filterSlice";

export default function FilterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.filter);

  const [minPrice, setMinPrice] = useState(filter.minPrice);
  const [maxPrice, setMaxPrice] = useState(filter.maxPrice);
  const [rating, setRating] = useState(filter.rating);
  const [shipping, setShipping] = useState(filter.shipping);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  useEffect(() => {
    setMinPrice(filter.minPrice);
    setMaxPrice(filter.maxPrice);
    setRating(filter.rating);
    setShipping(filter.shipping);
  }, [filter]);

  const toggleShipping = (key: keyof typeof shipping) =>
    setShipping({ ...shipping, [key]: !shipping[key] });

  const applyFilter = () => {
    dispatch(
      updateFilters({
        minPrice,
        maxPrice,
        rating,
        shipping,
        others: filter.others,
        isApplied: true,
      })
    );

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Shipping options</Text>
        {[
          { key: "instant", label: "Instant (2 hours delivery)" },
          { key: "express", label: "Express (2 days delivery)" },
          { key: "standard", label: "Standard (7-10 days delivery)" },
        ].map((i) => (
          <TouchableOpacity
            key={i.key}
            style={styles.checkboxRow}
            onPress={() => toggleShipping(i.key as any)}
          >
            <Ionicons
              name={
                shipping[i.key as keyof typeof shipping]
                  ? "checkbox"
                  : "square-outline"
              }
              size={22}
              color="#05BCD5"
            />
            <Text style={styles.checkboxLabel}>{i.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Price range</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={styles.priceInput}
            value={`${minPrice} ₫`}
            editable={false}
          />
          <TextInput
            style={styles.priceInput}
            value={`${maxPrice} ₫`}
            editable={false}
          />
        </View>

        <MultiSlider
          values={[minPrice, maxPrice]}
          sliderLength={300}
          min={0}
          max={2000000}
          step={10000}
          onValuesChange={(values) => {
            setMinPrice(values[0]);
            setMaxPrice(values[1]);
            setPriceRange(values);
          }}
          selectedStyle={{ backgroundColor: "#007AFF" }}
          markerStyle={{ backgroundColor: "#007AFF" }}
        />

        <Text style={styles.sectionTitle}>Average review</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity key={s} onPress={() => setRating(s)}>
              <Ionicons
                name={s <= rating ? "star" : "star-outline"}
                size={24}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
          <Text style={{ marginLeft: 8 }}>& Up</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </TouchableOpacity>
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            dispatch(resetFilters());
            router.back();
          }}
        >
          <Text style={styles.resetText}>Reset Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 12 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkboxLabel: { marginLeft: 10 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  priceInput: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 6,
    textAlign: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },

  applyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
  },

  resetBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderColor: "#05BCD5",
    borderWidth: 1.5,
    alignItems: "center",
  },

  resetText: {
    color: "#05BCD5",
    fontWeight: "bold",
    fontSize: 16,
  },

  applyBtn: {
    flex: 1,
    backgroundColor: "#05BCD5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
});
