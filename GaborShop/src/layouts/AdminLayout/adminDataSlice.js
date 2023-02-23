import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminData } from "./fetchAdminData";

const initialState = {
  products: [],
  orders: [],
  users: [],
  status: "idle",
  error: null,
};

export const adminDataSlice = createSlice({
  name: "adminData",
  initialState,
  reducers: {
    resetAdminData: (state) => {
      state.products = initialState.products;
      state.orders = initialState.orders;
      state.users = initialState.users;
    },
    setAdminProductData: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      state.products[productIndex].stock = parseInt(action.payload.stock);
      state.products[productIndex].discountPercentage = action.payload.discount;
    },
    deleteAdminProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id != action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.orders = action.payload.orders;
        state.users = action.payload.users;
        state.status = "succeeded";
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { resetAdminData, setAdminProductData, deleteAdminProduct } =
  adminDataSlice.actions;

export default adminDataSlice.reducer;
