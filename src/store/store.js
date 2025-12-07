import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/auth/authSlice";
import users from "../features/user/usersSlice";

export default configureStore({
  reducer: { auth, users }
});
