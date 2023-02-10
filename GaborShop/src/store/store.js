import { configureStore } from "@reduxjs/toolkit";
import productsSliceReducer from "../pages/Products/productsSlice";
import messageSliceReducer from "../components/Message/messageSlice";
import userSliceReducer from "../layouts/UserLayout/userSlice";
import cartProductsSliceReducer from "../pages/shoppingCart/cartProductsSlice";

export const store = configureStore({
  reducer: {
    products: productsSliceReducer,
    message: messageSliceReducer,
    user: userSliceReducer,
    cartProducts: cartProductsSliceReducer,
  },
});
