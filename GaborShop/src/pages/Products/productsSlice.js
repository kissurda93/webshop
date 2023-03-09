import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./productsAsync";

const initialState = {
  productsList: [],
  status: "idle",
  error: null,
  pages: [],
  currentPage: `${import.meta.env.VITE_API_URL}/products`,
  categories: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
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
        const current = action.payload.links.find(
          (link) => link.active === true
        );
        state.currentPage = current.url;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCategories, setCurrentPage } = productsSlice.actions;

export default productsSlice.reducer;
