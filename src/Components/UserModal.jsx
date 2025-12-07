import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { createUser, updateUser } from "../../src/features/user/usersSlice";

export default function UserModal({ open, onClose, editData }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Set default values when modal opens
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  // Called only when validation succeeds
  const onFinish = (values) => {
    if (editData) {
      dispatch(updateUser({ id: editData.id, ...values }));
    } else {
      dispatch(createUser(values));
    }

    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={editData ? "Edit User" : "Create New User"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="avatar" label="Profile Image Link" rules={[{ required: true }]}>
          <Input placeholder="Enter image link" />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>

          {/* Submit button triggers onFinish automatically */}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
