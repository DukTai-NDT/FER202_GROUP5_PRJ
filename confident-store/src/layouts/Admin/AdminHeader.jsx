import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ marginLeft: '250px' }}>
    <Container>
      <Navbar.Brand href="/admin/manage-products">Admin Dashboard</Navbar.Brand>
      <Nav className="ml-auto">
        <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
      </Nav>
    </Container>
  </Navbar>
  );
};

export default AdminHeader;
