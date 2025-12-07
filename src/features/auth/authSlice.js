import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiClient";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/login",
        { email, password },
        {
          headers: {
            "x-api-key": "reqres_e3e2f6b35cf7453aa679bc86b77af95e",
          },
        }
      );

      const token = response.data.token;

      // Save login token
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      return rejectWithValue("Invalid email or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: "",
  },

  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("users_data");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
