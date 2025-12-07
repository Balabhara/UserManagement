import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { createUser, updateUser } from "../../src/features/user/usersSlice";

export default function UserModal({ open, onClose, editData }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // When editing → prefill fields
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

const handleSubmit = () => {
  form
    .validateFields()
    .then((values) => {
      if (editData) {
        dispatch(updateUser({ id: editData.id, ...values }));
      } else {
        dispatch(createUser(values));
      }

      onClose();  // close only if validation succeeds
      form.resetFields();
    })
    .catch((err) => {
      console.log("Validation failed:", err);
    });
};


  return (
    <Modal open={open} footer={null} onCancel={onClose} title={editData ? "Edit User" : "Create New User"}>
      <Form form={form} layout="vertical">
        <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Please enter first name" />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
          <Input placeholder="Please enter last name" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Please enter email" />
        </Form.Item>

        <Form.Item name="avatar" label="Profile Image Link" rules={[{ required: true }]}>
          <Input placeholder="Please enter profile image link" />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </Form>
    </Modal>
  );
}
