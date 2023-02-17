import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./fetchUser";

const initialState = {
  userInfo: {},
  userAddresses: [],
  userOrders: [],
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.userInfo = initialState.userInfo;
      state.userAddresses = initialState.userAddresses;
    },
    setName: (state, action) => {
      state.userInfo.name = action.payload;
    },
    setEmail: (state, action) => {
      state.userInfo.email = action.payload;
    },
    setNewAddress: (state, action) => {
      state.userAddresses.push(action.payload);
    },
    setDefaultAddress: (state, action) => {
      const defaultAddressIndex = state.userAddresses.findIndex(
        (address) => address.default == 1
      );
      state.userAddresses[defaultAddressIndex].default = 0;

      const newDefaultAddressIndex = state.userAddresses.findIndex(
        (address) => address.id == action.payload
      );
      state.userAddresses[newDefaultAddressIndex].default = 1;
    },
    removeAddress: (state, action) => {
      state.userAddresses = state.userAddresses.filter(
        (address) => address.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { userInfo, userAddresses } = action.payload;
        state.userInfo = userInfo;
        state.userAddresses = userAddresses;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userInfo = initialState.userInfo;
        state.userAddresses = initialState.userAddresses;
        state.userOrders = initialState.userOrders;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetUser,
  setName,
  setEmail,
  setNewAddress,
  setDefaultAddress,
  removeAddress,
} = userSlice.actions;

export default userSlice.reducer;
