import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ link, searchData }) => {
    if (link.includes("search-products")) {
      let postResponse = await axios.post(link, searchData);
      return postResponse.data.data;
    } else {
      let response = await axios.get(link);
      return response.data;
    }
  }
);
