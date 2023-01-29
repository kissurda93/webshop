import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    resetUser: (state) => {
      state.userInfo = initialState;
    },
    setName: (state, action) => {
      state.userInfo.name = action.payload;
    },
    setEmail: (state, action) => {
      state.userInfo.email = action.payload;
    },
  },
});

export const { setUser, resetUser, setName, setEmail } = userSlice.actions;

export default userSlice.reducer;
