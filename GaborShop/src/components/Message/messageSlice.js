import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "",
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    resetMessage: (state) => {
      state.message = "";
      state.type = "";
    },
  },
});

export const { setMessage, setType, resetMessage } = messageSlice.actions;

export default messageSlice.reducer;
