import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../pages/Products/productsSlice";
import messageReducer from "../components/Message/messageSlice";
import userSlice from "../layouts/UserLayout/userSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    message: messageReducer,
    user: userSlice,
  },
});
