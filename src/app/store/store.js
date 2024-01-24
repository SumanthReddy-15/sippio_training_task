import { configureStore } from "@reduxjs/toolkit";
// import usersReducer from "./user-slice";
import { usersApi } from "./usersApi";

export const store = configureStore({
  reducer: {
    // users: usersApi,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});
