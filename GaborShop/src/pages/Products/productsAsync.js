import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ currentPage, searchData }) => {
    if (currentPage.includes("search-products")) {
      const response = await axios.post(currentPage, searchData);
      return response.data;
    } else {
      const response = await axios.get(currentPage);
      return response.data;
    }
  }
);
