import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import userReducer from "../features/user/userSlice";
import productList from "@/features/product/productSlice";
import reviewList from "@/features/reviews/reviewSlice";
import filterReducer from "@/features/filter/filterSlice";
import cartReducer from "@/features/cart/cartSlice";
import orderReducer from "@/features/order/orderSlice";

// ⚙️ Cấu hình persist cho giỏ hàng
const cartPersistConfig = {
  key: "cart",
  storage: AsyncStorage,
};

// ✅ Bọc reducer giỏ hàng với persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productList,
    review: reviewList,
    filter: filterReducer,
    cart: persistedCartReducer, // ✅ giỏ hàng có cache
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // cần tắt vì redux-persist dùng non-serializable values
    }),
});

// ✅ Khởi tạo persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
