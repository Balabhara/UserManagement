import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiClient";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: ""
  },
  reducers: {
    loginStart: (s) => { s.loading = true; s.error = ""; },
    loginSuccess: (s, a) => {
      s.loading = false;
      s.token = a.payload;
    },
    loginFail: (s, a) => {
      s.loading = false;
      s.error = a.payload;
    },
    logout: (s) => {
      s.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("users_data");
    }
  }
});

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const res = await api.post("/login", { email, password }, {
         headers: {"x-api-key": "reqres_e3e2f6b35cf7453aa679bc86b77af95e"}
        });
    localStorage.setItem("token", res.data.token);
    dispatch(loginSuccess(res.data.token));
  } catch (err) {
    dispatch(loginFail("Invalid credentials"));
  }
};

export default authSlice.reducer;
