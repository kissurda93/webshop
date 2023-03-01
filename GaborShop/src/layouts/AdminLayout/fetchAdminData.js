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
      orders.forEach((order) => {
        order.user_data = JSON.parse(order.user_data);
        order.products_data = JSON.parse(order.products_data);
        order.invoice_address = JSON.parse(order.invoice_address);
        order.delivery_address = JSON.parse(order.delivery_address);
      });

      return { products, orders, users };
    } catch (error) {
      throw error;
    }
  }
);
