"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store/store";
import { setAccessToken } from "./features/users/userSlice";

export default function StoreProvider({ children, accessToken }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    if (accessToken) {
      storeRef.current.dispatch(setAccessToken(accessToken));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
