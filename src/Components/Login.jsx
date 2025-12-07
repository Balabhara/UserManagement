import React from "react";
import { Card, Form, Input, Button, Alert, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  // after the submit, token is present user page wil be navigated.
  if (token) navigate("/users");

  const onFinish = (v) => {
    dispatch(login({ email: v.email, password: v.password }));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card style={{ width: 400, padding: "10px 20px" }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 15 }} />}
        {/* Login form */}
        <Form
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            email: "eve.holt@reqres.in",
            password: "cityslicka",
            remember: true,
          }}
        >
          {/* Email */}
          <Form.Item
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          {/* Remember me */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Log in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
