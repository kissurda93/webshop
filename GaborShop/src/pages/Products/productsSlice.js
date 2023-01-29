import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./productsAsync";

const initialState = {
  productsList: [],
  status: "idle",
  error: null,
  pages: [],
  categories: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsList = action.payload.data;
        state.pages = action.payload.links;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCategories } = productsSlice.actions;

export default productsSlice.reducer;
