import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";


const { Content } = Layout;

// Lazy load UsersPage
const UsersPage = React.lazy(() => import("./Components/UserList"));

export default function App() {


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 20 }}>
        <Routes>
          <Route index element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading users...</div>}>
                  <UsersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}
