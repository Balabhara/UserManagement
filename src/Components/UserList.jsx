import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Avatar,
  Pagination,
  Segmented,
  Modal,
  Layout,
  Tooltip
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import UserCard from "./UserCard";
import "./UserList.css";
import { TableOutlined, UnorderedListOutlined, LogoutOutlined  } from "@ant-design/icons";
import { loadUsers, deleteUser, setPage } from "../../src/features/user/usersSlice";
import UserModal from "../Components/UserModal";
const { Header } = Layout;

export default function UserList() {
  const dispatch = useDispatch();
  const { allData, loading, page } = useSelector((s) => s.users);

  const [search, setSearch] = useState("");
   const navigate = useNavigate();
  const [view, setView] = useState("table");

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

    const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  // Filter users across ALL data
  const filtered = allData.filter((u) =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 FIX: Reset page if search results are fewer than current page start
  useEffect(() => {
    const maxPage = Math.ceil(filtered.length / 5);
    if (page > maxPage) dispatch(setPage(1));
  }, [filtered.length, page, dispatch]);

  const startIdx = (page - 1) * 5;
  const endIdx = startIdx + 5;
  const pageData = filtered.slice(startIdx, endIdx);

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this user?",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: { style: { backgroundColor: "red", borderColor: "red" } },
      onOk: () => dispatch(deleteUser(id)),
    });
  };

  const columns = [
    {
      title: "",
      render: (row) => <Avatar src={row.avatar} size={45} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <a style={{ color: "#1677ff" }} href={`mailto:${email}`}>
          {email}
        </a>
      ),
    },
    { title: "First Name", dataIndex: "first_name" },
    { title: "Last Name", dataIndex: "last_name" },
    {
      title: "Action",
      render: (row) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditData(row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            style={{ background: "red", color: "white" }}
            onClick={() => confirmDelete(row.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
     {/* HEADER MOVED HERE */}
      <Header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          color: "#fff",
          background: "#001529",
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
    <div style={{ padding: 20 }}>
      <Card>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>Users</h2>

          <div>
            <Input.Search
              placeholder="Search users..."
              style={{ width: 220, marginRight: 5 }}
              allowClear
              onChange={(e) => {
                setSearch(e.target.value);
                dispatch(setPage(1)); // also reset page on typing
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
            >
              Create User
            </Button>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ marginBottom: 10 }}>
          <Segmented
            value={view}
            onChange={setView}
            className="view-toggle"
            options={[
              {
                label: (
                  <span className="seg-item">
                    <TableOutlined style={{ fontSize: 16 }} />
                    Table
                  </span>
                ),
                value: "table",
              },
              {
                label: (
                  <span className="seg-item">
                    <UnorderedListOutlined style={{ fontSize: 16 }} />
                    Card
                  </span>
                ),
                value: "card",
              },
            ]}
          />
        </div>

        {/* Table view */}
        {view === "table" && (
          <Table
            rowKey="id"
            loading={loading}
            dataSource={pageData}
            columns={columns}
            pagination={false}
          />
        )}

        {/* Card view */}
        {view === "card" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {pageData.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onEdit={(user) => {
                  setEditData(user);
                  setOpen(true);
                }}
                onDelete={() => confirmDelete(u.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div
        style={{
          marginTop: 20,
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={page}
          total={filtered.length}
          pageSize={5}
          onChange={(p) => dispatch(setPage(p))}
        />
      </div>

      <UserModal open={open} onClose={() => setOpen(false)} editData={editData} />
    </div>
    </>
  );
}
