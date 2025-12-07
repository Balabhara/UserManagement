// src/components/UserCard.jsx
import React from "react";
import { Card, Avatar, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import "./UserCard.css";

export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      {/* Main Card Content */}
      <Card className="card-content" bodyStyle={{ textAlign: "center", padding: 20 }}>
        <Avatar src={user.avatar} size={80} />

        <h3 style={{ marginTop: 12 }}>
          {user.first_name} {user.last_name}
        </h3>

        <p style={{ margin: 0 }}>{user.email}</p>
      </Card>

      {/* Hover Action Overlay */}
      <div className="card-hover-actions">
        <Space>
          <Button
            shape="circle"
            size="large"
            icon={<EditOutlined />}
            style={{ background: "#7669F7", color: "white" }}
            onClick={() => onEdit(user)}
          />

          <Button
            shape="circle"
            size="large"
            danger
            icon={<DeleteOutlined />}
            style={{ background: "red", color: "white" }}
            onClick={() => onDelete(user.id)}
          />
        </Space>
      </div>
    </div>
  );
}
