import React, { Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Layout, Button, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Components/Login";
import { logout } from "./features/auth/authSlice";


const { Header, Content } = Layout;

// Lazy load UsersPage
const UsersPage = React.lazy(() => import("./Components/UserList"));

export default function App() {
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {token && (
        <Header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            color: "#fff",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 18 }}>Bala Bharathi M</div>
          <Tooltip title="Logout">
            <Button
              style={{ background: "red" }}
              type="primary"
              onClick={handleLogout}
              icon={<LogoutOutlined style={{ color: "white" }} />}
            />
          </Tooltip>
        </Header>
      )}
      <Content style={{ padding: 20 }}>
        <Routes>
          <Route index element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              token ? (
                <Suspense fallback={<div>Loading users...</div>}>
                  <UsersPage />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}
