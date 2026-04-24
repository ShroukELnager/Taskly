import usersReducer from "./features/users/userSlice";
import { configureStore } from "@reduxjs/toolkit";
export const makeStore = () => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
  });
};