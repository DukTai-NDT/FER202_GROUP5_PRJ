import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Button, Table, Form, InputGroup, Badge, Alert } from "react-bootstrap";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import {
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "../../services/userService";
import UserModal from "../../components/Admin/UserModal";
import DeleteUserModal from "../../components/Admin/DeleteUserModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // State cho Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Dùng cho cả Edit và Delete

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err ) {
      setError("Failed to load users. Is json-server running?");
    }
  };

  // Tính toán danh sách user đã lọc (Chức năng nâng cao: Search)
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Mở modal (Create)
  const handleCreate = () => {
    setCurrentUser(null);
    setShowUserModal(true);
  };

  // Mở modal (Edit)
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  // Mở modal (Delete)
  const handleDelete = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Đóng tất cả modal
  const handleCloseModals = () => {
    setShowUserModal(false);
    setShowDeleteModal(false);
    setCurrentUser(null);
  };

  // Xử lý Lưu (Create/Update)
  const handleSaveUser = async (formData) => {
    try {
      if (currentUser) {
        // Update
        const updatedUser = await adminUpdateUser(currentUser.id, formData);
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      } else {
        // Create
        const newUser = await adminCreateUser(formData);
        setUsers([...users, newUser]);
      }
      handleCloseModals();
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  // Xử lý Xác nhận Xóa
  const handleDeleteConfirm = async () => {
    try {
      await adminDeleteUser(currentUser.id);
      setUsers(users.filter((u) => u.id !== currentUser.id));
      handleCloseModals();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  // Chức năng nâng cao: Khóa/Mở khóa User
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === "active" ? "locked" : "active";
      const updatedUser = await adminUpdateUser(user.id, {
        ...user,
        status: newStatus,
      });
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    } catch (err) {
      setError("Failed to update user status.");
    }
  };

  return (
    <Container fluid>
      <Row className="my-3">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by username, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={handleCreate}>
            <FaPlus /> Add New User
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Badge bg={user.role === "admin" ? "primary" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge bg={user.status === "active" ? "success" : "danger"}>
                  {user.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrash />
                </Button>
                <Button
                  variant={user.status === "active" ? "outline-dark" : "outline-success"}
                  size="sm"
                  onClick={() => handleToggleStatus(user)}
                >
                  {user.status === "active" ? <FaLock /> : <FaUnlock />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modals */}
      <UserModal
        show={showUserModal}
        handleClose={handleCloseModals}
        onSave={handleSaveUser}
        user={currentUser}
      />
      <DeleteUserModal
        show={showDeleteModal}
        handleClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        user={currentUser}
      />
    </Container>
  );
};

export default UserManagement;