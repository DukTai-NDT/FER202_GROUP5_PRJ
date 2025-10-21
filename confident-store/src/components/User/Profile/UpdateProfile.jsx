import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { updateUserProfile } from "../../../services/userService"; // Ensure this path is correct

const ProfileUpdateModal = ({ show, handleClose, user }) => {
  const [formData, setFormData] = useState({
    username: user.username, // Username should be read-only
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
  });
  const [message, setMessage] = useState(""); // To show success or error messages

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUserProfile(formData);
    setMessage(result.message);
    if (result.success) {
      setTimeout(() => {
        handleClose(); // Close the modal on success
        localStorage.setItem("user", JSON.stringify(formData)); // Update localStorage
      }, 2000); // Close modal after success
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.includes("success") ? "success" : "danger"}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Username - Readonly */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              readOnly
              style={{ backgroundColor: "#e9ecef" }}
            />
          </Form.Group>

          {/* Full Name */}
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">Update Profile</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileUpdateModal;
