import { Customer } from "@/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "@/config";

interface UserState {
  currentUser: Customer | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: "idle",
  error: null,
};

const USERS_URL = `${BASE_URL}/customers`;

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (updatedUser: Customer, { rejectWithValue }) => {
    try {
      const res = await fetch(`${USERS_URL}/${updatedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) return rejectWithValue("Update failed");

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

export const signIn = createAsyncThunk<
  Customer,
  { userName: string; password: string },
  { rejectValue: string }
>("user/signIn", async ({ userName, password }, { rejectWithValue }) => {
  const res = await fetch(
    `${USERS_URL}?userName=${userName}&password=${password}`
  );
  const data = await res.json();
  if (data.length === 0) return rejectWithValue("Sai tài khoản hoặc mật khẩu");
  return data[0];
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Đăng nhập thất bại";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.error = null;
      });
  },
});

export const { signOut } = userSlice.actions;
export default userSlice.reducer;
