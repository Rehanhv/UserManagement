// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  // ✅ Redux DevTools are enabled by default in development
  // ✅ Middleware is auto-configured for async (e.g., createAsyncThunk)
});

export default store;
