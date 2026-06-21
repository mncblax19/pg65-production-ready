import { configureStore } from "@reduxjs/toolkit";
import allApi from "./allApi";
import emailSlice from "./slices/emailSlice";
import mediaReducer from "./slices/mediaSlice";
const store = configureStore({
  reducer: {
    media: mediaReducer,
    email: emailSlice,
    [allApi.reducerPath]: allApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(allApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
