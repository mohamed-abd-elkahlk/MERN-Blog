import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IUserCredential } from "../../types";
import { UserCredential } from "firebase/auth";

export const signIn = createAsyncThunk(
  "auth/sign-in",
  async (data: IUserCredential) => {
    const req = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await req.json();
    return response;
  }
);
export const signUp = createAsyncThunk(
  "auth/sign-up",
  async (data: IUserCredential) => {
    const req = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await req.json();
    return response;
  }
);

export const googleAuth = createAsyncThunk(
  "auth/google",
  async (data: UserCredential) => {
    const req = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.user.displayName,
        email: data.user.email,
        imageUrl: data.user.photoURL,
      }),
    });
    const res = await req.json();

    return res;
  }
);

// Define a type for the slice state
export interface UserState {
  currentUser: {
    _id: string;
    username: string;
    imageUrl: string;
    email: string;
    role: "admin" | "user";
  } | null;
  loading: boolean;
  error?: null;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteUser: (state) => {
      state.currentUser = null;
    },
    signOut: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      });
  },
});

export const { updateUser, deleteUser, signOut } = userSlice.actions;

export default userSlice.reducer;
