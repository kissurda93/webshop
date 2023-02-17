import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const fetchUser = createAsyncThunk("user/getUserData", async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
    });
    const userInfo = response.data.user;
    const userAddresses = response.data.addresses;
    return { userInfo, userAddresses };
  } catch (error) {
    console.warn(error);
  }
});
