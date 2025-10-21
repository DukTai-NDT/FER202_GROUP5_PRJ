import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";

const UserFooter = () => {
  return (
    <footer
      className="py-5"
      style={{ background: "#f8f8f8", fontSize: "14px" }}
    >
      <Container>
        <Row className="mb-4">
          {/* Our Story */}
          <Col md={3}>
            <h6 className="fw-bold">Our Story</h6>
            <p>
              Our origin story is more of an origin statement. We wanted to
              design what we wanted to wear – so we did.
            </p>
            <p>
              Since then, that philosophy has become more about the guy we
              design for and the impact he is looking to make.
            </p>
          </Col>

          {/* Online Store */}
          <Col md={3}>
            <h6 className="fw-bold">Online Store</h6>
            <ul className="list-unstyled">
              <li>Sureshot Jogger</li>
              <li>Flintlock Tees</li>
              <li>Sustainable Products</li>
              <li>Zanerobe Pants</li>
              <li>Zanerobe Tee Shirts</li>
              <li>Zanerobe Jackets</li>
              <li>Zanerobe Shorts</li>
              <li>Gift Vouchers</li>
            </ul>
          </Col>

          {/* More Info */}
          <Col md={3}>
            <h6 className="fw-bold">More Info</h6>
            <ul className="list-unstyled">
              <li>About</li>
              <li>Contact Us</li>
              <li>Help & FAQ</li>
              <li>Returns Policy</li>
              <li>Shipping Info</li>
              <li>Technical & Privacy</li>
              <li>Black Friday T&C's</li>
              <li>Promotions</li>
            </ul>
          </Col>

          {/* Newsletter & Social Media */}
          <Col md={3}>
            <h6 className="fw-bold">Unlock 15% Off Your Order</h6>
            <p>
              Sign up to our newsletter to receive 15% off your order, plus VIP
              access to new drops & sales.
            </p>
            <Button variant="dark" className="w-100 mb-3">
              Sign Up
            </Button>

            {/* Social Media Icons */}
            <div className="d-flex gap-3">
              <FaTwitter size={20} />
              <FaFacebookF size={20} />
              <FaYoutube size={20} />
              <FaInstagram size={20} />
              <FaPinterest size={20} />
              <FaTiktok size={20} />
              <FaSpotify size={20} />
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="mt-4">
          <Col md={6}>
            <p>© 2025 ZANEROBE Australia. Designed in Sydney, Australia.</p>
          </Col>
          <Col md={6} className="text-end">
            <img
              src="/images/payment-icons.png"
              alt="Payment Methods"
              style={{ maxWidth: "250px" }}
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default UserFooter;
