import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isUserLoading: true,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserLoading: (state, action) => {
      state.isUserLoading = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isUserLoading = false;
    },
  },
});

export const { setUserData, setUserLoading, clearUserData } = userSlice.actions;

export default userSlice.reducer;
