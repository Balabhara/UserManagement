import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiClient";

const STORAGE_KEY = "users_data";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    allData: [],
    data: [],
    loading: false,
    page: 1,
    createdUsers: [],
    deletedIds: [],
    updatedUsers: {},
  },
  reducers: {
    start: (state) => {
      state.loading = true;
    },
    success: (state, action) => {
      state.loading = false;
      state.allData = action.payload;
    },
    stop: (state) => {
      state.loading = false;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    addUser: (state, action) => {
      state.createdUsers.unshift(action.payload);
    },
    updateUserLocal: (state, action) => {
      const updated = action.payload;
      state.updatedUsers[updated.id] = updated;
    },
    deleteUserLocal: (state, action) => {
      const id = action.payload;
      state.deletedIds.push(id);
    },
  },
});

export const {
  start,
  success,
  stop,
  setPage,
  addUser,
  updateUserLocal,
  deleteUserLocal,
} = usersSlice.actions;

function saveMerged(getState) {
  const state = getState().users;
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  let merged = [...state.createdUsers, ...stored]
    .filter((u) => !state.deletedIds.includes(u.id))
    .map((u) => (state.updatedUsers[u.id] ? state.updatedUsers[u.id] : u));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export const loadUsers = () => async (dispatch, getState) => {
  dispatch(start());

  try {
    let stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!stored || stored.length === 0) {
      const res = await api.get(`/users?per_page=12`, {
        headers: { "x-api-key": "reqres_e3e2f6b35cf7453aa679bc86b77af95e" },
      });
      stored = res.data.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }

    dispatch(success(stored));
  } catch {
    dispatch(stop());
  }
};

export const createUser = (data) => (dispatch, getState) => {
  const newUser = { id: Date.now(), ...data };
  dispatch(addUser(newUser));
  const merged = saveMerged(getState);
  dispatch(success(merged));
};

export const updateUser = ({ id, ...data }) => (dispatch, getState) => {
  dispatch(updateUserLocal({ id, ...data }));
  const merged = saveMerged(getState);
  dispatch(success(merged));
};

export const deleteUser = (id) => (dispatch, getState) => {
  dispatch(deleteUserLocal(id));
  const merged = saveMerged(getState);
  dispatch(success(merged));
};

export default usersSlice.reducer;
