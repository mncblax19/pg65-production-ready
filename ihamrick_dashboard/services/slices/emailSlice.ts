// src/services/emailSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailState {
  email: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
  otp: number | null;
}

const initialState: EmailState = {
  email: null,
  newPassword: null,
  confirmPassword: null,
  otp: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    clearEmail(state) {
      state.email = null;
    },

    setNewPassword(state, action: PayloadAction<string>) {
      state.newPassword = action.payload;
    },
    clearNewPassword(state) {
      state.newPassword = null;
    },

    setConfirmPassword(state, action: PayloadAction<string>) {
      state.confirmPassword = action.payload;
    },
    clearConfirmPassword(state) {
      state.confirmPassword = null;
    },

    setOtp(state, action: PayloadAction<number>) {
      state.otp = action.payload;
    },
    clearOtp(state) {
      state.otp = null;
    },

    resetAll() {
      return initialState;
    },
  },
});

export const {
  setEmail,
  clearEmail,
  setNewPassword,
  clearNewPassword,
  setConfirmPassword,
  clearConfirmPassword,
  setOtp,
  clearOtp,
  resetAll,
} = emailSlice.actions;

export default emailSlice.reducer;
