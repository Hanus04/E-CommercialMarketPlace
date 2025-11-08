import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/config";

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  CustomercustomerId: number;
}

interface OrderItem {
  orderItemId: number;
  quantity: number;
  price: number;
  subtotal: number;
  OrderorderId: number;
  ProductproductId: number;
}

interface OrderState {
  orders: Order[];
  orderItems: OrderItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  orderItems: [],
  status: "idle",
  error: null,
};

// ✅ API fetch
export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  return await res.json();
});

export const fetchOrderItems = createAsyncThunk(
  "orderItems/fetch",
  async () => {
    const res = await fetch(`${BASE_URL}/orderItems`);
    return await res.json();
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.orderItems = action.payload;
      });
  },
});

export default orderSlice.reducer;
