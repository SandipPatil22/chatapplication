import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userslice";
import getallUserSlice from "./getallUserSlice";

const store = configureStore({
  reducer: { user: userSlice ,
    getalluser: getallUserSlice,
  },
});

export default store;
