import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  checked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setChecked } = authSlice.actions;
export default authSlice.reducer;
