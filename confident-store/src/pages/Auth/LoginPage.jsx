import { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../../assets/images/loginBackgr.webp"; // Assuming you have a background image for the login page

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.username, formData.password);
    setMessage(result.message);
    if (result.success) {
      if (result.user.role === "admin") {
        setTimeout(() => navigate("/admin/products"), 2000);
      } else {
        setTimeout(() => navigate("/"), 2000);
      }
      localStorage.setItem("user", JSON.stringify(result.user));
    }
  };

  // Inline CSS style for the background
  const containerStyle = {
    backgroundImage: `url(${LoginBackground})`, // Set your login background image here
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff", // Optional for text color to be readable on the background
  };

  // Form container style to improve readability
  const formContainerStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "400px", // Set max width to ensure it's not too wide
  };

  return (
    <Container fluid style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 className="fw-bold text-center">Login</h2>
        {message && (
          <Alert variant={message.includes("Invalid") ? "danger" : "success"}>
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit" variant="dark" className="w-100">
            Login
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Don't have an account? <a href="//signup">Register here</a>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
