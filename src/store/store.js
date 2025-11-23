import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./auth/authSlice";
import lookupsReducer from "./auth/lookupsSlice";
import filtersReducer from "./auth/filterSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    lookups: lookupsReducer,
  },
});

export default store

