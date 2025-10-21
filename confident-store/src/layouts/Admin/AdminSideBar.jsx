import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#1c1c1c',
        color: '#fff',
        padding: '20px',
        position: 'fixed',
      }}
    >
      <h2 style={{ color: '#f1f1f1' }}>REPLICA</h2>
      <Nav defaultActiveKey="/home" className="flex-column">
        <NavItem>
          <NavLink as={Link} to="/admin/products" style={{ color: '#ddd' }}>
            Manage Products
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} to="/admin/orders" style={{ color: '#ddd' }}>
            Manage Orders
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
