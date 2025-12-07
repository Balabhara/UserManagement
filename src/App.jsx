import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import Login from "./Components/Login";


const {  Content } = Layout;

// Lazy load UsersPage
const UsersPage = React.lazy(() => import("./Components/UserList"));

export default function App() {
  const { token } = useSelector((s) => s.auth);


  return (
    <Layout style={{ minHeight: "100vh" }}>
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
