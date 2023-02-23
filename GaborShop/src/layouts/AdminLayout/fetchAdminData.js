import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const fetchAdminData = createAsyncThunk(
  "adminData/getAllData",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/>>>admin-data<<<`,
        {
          headers: {
            adminToken: Cookies.get("admin_token"),
          },
        }
      );
      const { products, orders, users } = response.data;
      return { products, orders, users };
    } catch (error) {
      throw error;
    }
  }
);
