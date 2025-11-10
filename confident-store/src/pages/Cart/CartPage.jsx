import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Table } from "react-bootstrap";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const data = await getCart();
      setCart(Array.isArray(data) ? data : []); // Đảm bảo cart là mảng
      setLoading(false);
    };
    fetchCart();
  }, []);
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage")); // Thông báo cập nhật
    }
  }, [cart]);

  // CartPage.jsx
  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = await updateCartItem(id, newQuantity);

    // Cập nhật state cart
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      // Lưu localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      // Tự bắn sự kiện custom
      window.dispatchEvent(new Event("cartChange"));
      return newCart;
    });
  };

  const handleRemoveItem = async (id) => {
    await removeCartItem(id);
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);
      // Lưu localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      // Tự bắn sự kiện custom
      window.dispatchEvent(new Event("cartChange"));
      return newCart;
    });
  };

  return (
    <Container className="my-5">
      <h2 className="fw-bold">Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <h4 className="text-center mt-4">Your cart is empty.</h4>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Product</th>
              <th>Details</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} width="80" />
                </td>
                <td>
                  <p className="mb-1 fw-bold">{item.name}</p>
                  <p className="mb-1">Size: {item.size}</p>
                  <p className="mb-1">Color: {item.color.name}</p>
                </td>
                <td>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </td>
                <td>${item.price * item.quantity}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    X
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {cart.length > 0 && (
        <div className="text-end">
          <h4>
            Total: $
            {cart.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </h4>
          <Button
            variant="success"
            className="mt-3"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CartPage;
