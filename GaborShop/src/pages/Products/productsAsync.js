import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (link) => {
    const response = await axios.get(link);
    return response.data.data;
  }
);
