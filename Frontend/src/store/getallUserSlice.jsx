import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  getallusers: null,
};
const getAllUserSlice = createSlice({
  name: "getalluser",
  initialState,
  reducers: {
    saveAllUserData: (state, action) => {
      state.getallusers = action.payload;
    },
  },
});

export const { saveAllUserData } = getAllUserSlice.actions;
export default getAllUserSlice.reducer;
