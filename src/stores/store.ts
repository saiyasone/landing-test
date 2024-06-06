// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import paymentSlice from "./features/paymentSlice";

const store = configureStore({
  reducer: {
    payment: paymentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
