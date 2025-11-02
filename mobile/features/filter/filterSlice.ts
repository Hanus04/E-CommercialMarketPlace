import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  rating: number;
  shipping: {
    instant: boolean;
    express: boolean;
    standard: boolean;
  };
  others: {
    return30: boolean;
    buyerProtection: boolean;
    bestDeal: boolean;
    shipToStore: boolean;
  };
  isApplied: boolean;
}

const initialState: FilterState = {
  minPrice: 0,
  maxPrice: 999999999,
  rating: 0,
  shipping: {
    instant: false,
    express: false,
    standard: false,
  },
  others: {
    return30: false,
    buyerProtection: false,
    bestDeal: false,
    shipToStore: false,
  },
  isApplied: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilters(state, action: PayloadAction<Partial<FilterState>>) {
      return { ...state, ...action.payload, isApplied: true };
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { updateFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
