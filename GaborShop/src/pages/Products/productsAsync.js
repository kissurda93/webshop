import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ currentPage, searchData }) => {
    if (currentPage.includes("search-products")) {
      let postResponse = await axios.post(currentPage, searchData);
      return postResponse.data.data;
    } else {
      let response = await axios.get(currentPage);
      return response.data;
    }
  }
);
