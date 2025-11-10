import { Container, Button } from "react-bootstrap";

const Banner = ({ imageUrl }) => {
  return (
    <div
      className="banner-section d-flex align-items-center justify-content-center text-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
        height: "600px",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* Overlay (tùy chọn, nếu muốn làm tối background) */}
      <div
        className="overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      ></div>

      <Container style={{ position: "relative", zIndex: 2 }}>
        <p className="text-uppercase" style={{ fontSize: "12px", opacity: 0.8 }}>
          Powered by Section
        </p>
        <h1 className="fw-bold" style={{ fontSize: "36px" }}>REPLICA Clothing</h1>
        <p style={{ fontSize: "16px", opacity: 0.9 }}>
          Sport pride, strong experience
        </p>
        <Button variant="light" className="px-4 py-2 fw-bold" href="/store">
          Explore the Drop
        </Button>
      </Container>
    </div>
  );
};

export default Banner;
