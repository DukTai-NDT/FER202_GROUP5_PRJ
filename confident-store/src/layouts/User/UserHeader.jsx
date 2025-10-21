import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUser, FaSearch, FaShoppingBasket } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserHeader = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    // Hàm cập nhật cartCount
    const updateCartCount = () => {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    };

    // Cập nhật lần đầu khi component mount
    updateCartCount();

    // Lắng nghe custom event "cartChange"
    window.addEventListener("cartChange", updateCartCount);

    // Dọn dẹp
    return () => {
      window.removeEventListener("cartChange", updateCartCount);
    };
  }, []);
  return (
    <Navbar expand="lg" style={styles.navbar}>
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/" className="fw-bold fs-4">
          REPLICA CLOTHING
        </Navbar.Brand>

        {/* Navigation Links */}
        <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-center">
          <Nav className="gap-4">
            <Nav.Link href="/store" style={styles.navLink}>Shop</Nav.Link>
            <Nav.Link href="/archive-sale" style={styles.navLink}>Archive Sale</Nav.Link>
            <Nav.Link href="/aboutus" style={styles.navLink}>About Us</Nav.Link>
            <Nav.Link href="/coming-soon" style={styles.navLink}>Coming Soon</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-4">
          {/* Conditional rendering of Login or Full Name */}
          {!currentUser ? (
            <a href="/login" style={{ textDecoration: "none" }}><span style={styles.navLink}>Login</span></a>
          ) : (

            <span style={styles.navLink}><a href="/profile" style={{ textDecoration: "none" }}>{currentUser.fullName}</a></span>
          )}
          <FaSearch size={18} style={styles.icon} />
          <div className="position-relative">
            <a href="/cart" style={{ textDecoration: "none" }}>
              <FaShoppingBasket size={18} style={styles.icon} />
            </a>
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

// Styles
const styles = {
  navbar: {
    padding: "15px 0",
    color: 'black',
  },
  navLink: {
    color: "black",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s",
  },
  icon: {
    color: "black",
    cursor: "pointer",
  },
  cartBadge: {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    background: "#fff",
    color: "#000",
    fontSize: "12px",
    fontWeight: "bold",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default UserHeader;
