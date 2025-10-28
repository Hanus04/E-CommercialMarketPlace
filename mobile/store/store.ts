import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import productList from "@/features/product/productSlice"
import  reviewList  from "@/features/reviews/reviewSlice"



export const store = configureStore({
  reducer: {
    user: userReducer,
    product:productList,
    review: reviewList
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
