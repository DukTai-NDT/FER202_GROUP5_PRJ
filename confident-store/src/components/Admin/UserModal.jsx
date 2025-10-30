import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserModal = ({ show, handleClose, onSave, user }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Khi prop 'user' thay đổi (mở modal Edit), điền form
    if (user) {
      setFormData(user);
    } else {
      // Mở modal Create, reset form
      setFormData({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "user",
      });
    }
  }, [user, show]); // Phụ thuộc vào user và show

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Edit User" : "Add New User"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              required
              disabled={!!user} // Không cho sửa username nếu là edit
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role (Chức năng nâng cao)</Form.Label>
            <Form.Select
              name="role"
              value={formData.role || "user"}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;