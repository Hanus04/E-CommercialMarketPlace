import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/types";
import { RootState } from "@/store/store";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        productId: number;
        quantity: number;
        customerId: number;
      }>
    ) => {
      const { productId, quantity, customerId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId && item.CustomerId === customerId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal += quantity * 0; // Có thể tính subtotal dựa theo giá sản phẩm thực tế
      } else {
        state.items.push({
          cartItemId: Date.now(),
          quantity,
          subtotal: 0,
          OrderId: 0,
          productId,
          CustomerId: customerId,
        });
      }
    },

    // 🗑 Xóa 1 sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<{ cartItemId: number }>) => {
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload.cartItemId
      );
    },

    // 🧹 Xóa tất cả sản phẩm của 1 khách hàng
    clearCart: (state, action: PayloadAction<{ customerId: number }>) => {
      state.items = state.items.filter(
        (item) => item.CustomerId !== action.payload.customerId
      );
    },

    // ✏️ Cập nhật số lượng sản phẩm
    updateQuantity: (
      state,
      action: PayloadAction<{ cartItemId: number; quantity: number }>
    ) => {
      const { cartItemId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.cartItemId === cartItemId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
        // Nếu bạn có giá sản phẩm thực tế, có thể tính lại subtotal ở đây
        // existingItem.subtotal = existingItem.price * quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
