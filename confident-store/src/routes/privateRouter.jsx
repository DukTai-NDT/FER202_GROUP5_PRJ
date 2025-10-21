import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute component to check authentication and authorization
const PrivateRoute = ({ element:Element, role, ...rest }) => {
  const isAuthenticated = localStorage.getItem("user") !== null; // Check if user is authenticated
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null; // Get the user's role from localStorage

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user does not have the required role, redirect to Not Authorized page
  if (role && userRole !== role) {
    return <Navigate to="/not-authorized" />;
  }

  // If the user is authenticated and has the correct role, render the requested element
  return <Element></Element>;
};

export default PrivateRoute;
