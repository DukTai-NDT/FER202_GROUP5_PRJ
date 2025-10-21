import { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import RegisterBackground from "../../assets/images/registerBackground.webp";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        address: "",
        phone: "",
        email: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const result = await register(
          formData.username,
          formData.password,
          formData.fullName,
          formData.address,
          formData.phone,
          formData.email
        );
      
        setMessage(result.message);
        if (result.success) {
          setTimeout(() => {
            navigate("/login"); // Navigate to login page after successful registration
          }, 2000);
        }
      };

    // Inline CSS style for the background
    const containerStyle = {
        backgroundImage: `url(${RegisterBackground})`, // Set your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff" // Optional for text color to be readable on the background
    };

    // Form container style to improve readability
    const formContainerStyle = {
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        width: "100%",
        maxWidth: "500px", // Increased width for better spacing
    };

    return (
        <Container fluid style={containerStyle}>
            <div style={formContainerStyle}>
                <h2 className="fw-bold text-center">Register</h2>
                {message && <Alert variant={message.includes("successful") ? "success" : "danger"}>{message}</Alert>}
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
                        <Col>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
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
                        <Col>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Button type="submit" variant="dark" className="w-100">
                        Register
                    </Button>
                </Form>
                <p className="mt-3 text-center">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </Container>
    );
};

export default RegisterPage;
