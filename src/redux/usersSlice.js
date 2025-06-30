// src/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Thunk to fetch users from ReqRes with API key header
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://reqres.in/api/users?page=1', {
        headers: {
          'x-api-key': 'reqres-free-v1',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.data.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        profileImage: user.avatar,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Load local storage fallback
const initialState = {
  list: JSON.parse(localStorage.getItem('users')) || [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload);
      localStorage.setItem('users', JSON.stringify(state.list));
    },
    editUser: (state, action) => {
      const { id, updatedData } = action.payload;
      state.list = state.list.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
      );
      localStorage.setItem('users', JSON.stringify(state.list));
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter(user => user.id !== action.payload);
      localStorage.setItem('users', JSON.stringify(state.list));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // ✅ Only update if local data is empty
        if (state.list.length === 0) {
          state.list = action.payload;
          localStorage.setItem('users', JSON.stringify(state.list));
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addUser, editUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
