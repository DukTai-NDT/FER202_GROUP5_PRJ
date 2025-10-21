import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";
import { getCart, placeOrder } from "../../services/cartService";

const CheckoutPage = () => {
    const [cart, setCart] = useState([]);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", address: "", phone: "" });
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from localStorage (or context)
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserInfo({
                name: user.fullName || "",
                email: user.email || "",
                address: user.address || "",
                phone: user.phone || "", // Assuming phone is stored in the user object
            });
        }

        const fetchCart = async () => {
            const data = await getCart();
            setCart(data);
        };
        fetchCart();
    }, []);

    const handleInputChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo.name || !userInfo.email || !userInfo.address || !userInfo.phone) {
            alert("Please fill in all required fields.");
            return;
        }

        const orderData = {
            id: String(Date.now()), 
            items: cart,
            total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
            customer: userInfo,
            paymentMethod,
            status: "Pending",
            date: new Date().toISOString(),
        };
        

        const result = await placeOrder(orderData);
        if (result) {
            setShowModal(true); // Hiện modal thông báo
        } else {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <Container className="my-5">
            <h2 className="fw-bold">Checkout</h2>

            <Row>
                <Col md={6}>
                    <h4 className="fw-bold">Billing Details</h4>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={userInfo.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option>Credit Card</option>
                                <option>PayPal</option>
                                <option>Bank Transfer</option>
                                <option>Cash on Delivery</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="success" type="submit">Confirm Order</Button>
                    </Form>
                </Col>

                <Col md={6}>
                    <h4 className="fw-bold">Order Summary</h4>
                    {cart.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
                            <span>{item.name} ({item.size}, {item.color})</span>
                            <span>${item.price * item.quantity}</span>
                        </div>
                    ))}
                    <h5 className="mt-3">Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h5>
                </Col>
            </Row>

            {/* Modal thông báo đặt hàng thành công */}
            <Modal show={showModal} onHide={() => navigate("/")}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your order has been placed successfully! 🎉</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => navigate("/")}>OK</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckoutPage;
