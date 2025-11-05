import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import productList from "@/features/product/productSlice";
import reviewList from "@/features/reviews/reviewSlice";
import filterReducer from "@/features/filter/filterSlice";

import cartReducer from "@/features/cart/cartSlice"
import orderReducer from "@/features/order/orderSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productList,
    review: reviewList,
    filter: filterReducer,
    cart:cartReducer,

    order: orderReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
