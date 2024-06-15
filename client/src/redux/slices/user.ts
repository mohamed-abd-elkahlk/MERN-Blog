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
    console.log(res);

    return res;
  }
);
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

// export const {} = userSlice.actions;

export default userSlice.reducer;
