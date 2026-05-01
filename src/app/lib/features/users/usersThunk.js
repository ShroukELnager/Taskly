import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      const token = state?.users?.accessToken;


      if (!token) {
        throw new Error("No access token found");
      }

      const res = await fetch(
        "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/user",
        {
          method: "GET",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch user");
      }

      return await res.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);