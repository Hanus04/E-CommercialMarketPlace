import { BASE_URL } from "@/config";
import { Product } from "@/types/types";
import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";



interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
};

const ProductURL = `${BASE_URL}/products`;



export const productList = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(ProductURL);
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue("Không thể tải danh sách sản phẩm");
      }

      return data as Product[];
    } catch (error) {
      return rejectWithValue("Lỗi kết nối server");
    }
  }
);




const productSlice=createSlice({
    name:"product",
    initialState,
    reducers:{},
    extraReducers:(builder)=> {
        builder
        .addCase(productList.pending,(state)=>{
            state.status="loading";
        })
        .addCase(productList.fulfilled, (state, action:PayloadAction<Product[]>  ) =>{
            state.status="succeeded",
            state.products =action.payload,
            state.error=null;
        }  )
        .addCase(productList.rejected,(state,action)=>{
            state.status="failed",
            state.error=action.payload??"That bai";
        })
    },
})
 export default productSlice.reducer