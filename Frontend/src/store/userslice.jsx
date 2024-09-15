import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { saveUserData } = userSlice.actions;
export default userSlice.reducer;
