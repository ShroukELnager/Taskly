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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload;

        state.user = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          jobTitle: user.user_metadata?.job_title,
          emailVerified: user.user_metadata?.email_verified,
          phone: user.phone,
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
        };
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAccessToken, setUser } = usersSlice.actions;

export default usersSlice.reducer;
