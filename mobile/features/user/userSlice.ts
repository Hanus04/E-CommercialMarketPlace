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

export const signUp = createAsyncThunk<
  Customer,
  { userName: string; password: string },
  { rejectValue: string }
>("user/signUp", async ({ userName, password }, { rejectWithValue }) => {
  // Check if username already exists
  const checkUser = await fetch(`${USERS_URL}?userName=${userName}`);
  const existingUsers = await checkUser.json();
  if (existingUsers.length > 0) {
    return rejectWithValue("Tên đăng nhập đã tồn tại");
  }

  // Create new user
  const res = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      password,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
    }),
  });

  if (!res.ok) {
    return rejectWithValue("Đăng ký thất bại");
  }

  const newUser = await res.json();
  return newUser;
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
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Đăng ký thất bại";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.error = null;
      });
  },
});

export const { signOut } = userSlice.actions;
export default userSlice.reducer;
