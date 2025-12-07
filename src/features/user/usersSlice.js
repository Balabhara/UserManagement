// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiClient";

const STORAGE_KEY = "users_data";

const loadFromStorage = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadUsers = createAsyncThunk("users/load", async () => {
  let stored = loadFromStorage();

  if (stored.length === 0) {
    const res = await api.get("/users?per_page=12", {
      headers: {
        "x-api-key": "reqres_e3e2f6b35cf7453aa679bc86b77af95e",
      },
    });

    stored = res.data.data;
    saveToStorage(stored);
  }

  return stored;
});

export const createUser = createAsyncThunk(
  "users/create",
  async (data, { getState }) => {
    const { users } = getState();
    const newUser = { id: Date.now(), ...data };

    const updatedList = [newUser, ...users.data];
    saveToStorage(updatedList);

    return updatedList;
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, ...data }, { getState }) => {
    const { users } = getState();

    const updatedList = users.data.map((u) =>
      u.id === id ? { ...u, ...data } : u
    );

    saveToStorage(updatedList);
    return updatedList;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { getState }) => {
    const { users } = getState();

    const updatedList = users.data.filter((u) => u.id !== id);

    saveToStorage(updatedList);
    return updatedList;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    page: 1,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
