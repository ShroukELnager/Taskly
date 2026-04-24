import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./usersThunk";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // loading
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      // error
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAccessToken, setUser } = usersSlice.actions;

export default usersSlice.reducer;