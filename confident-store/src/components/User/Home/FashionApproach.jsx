import { Container } from "react-bootstrap";
import FA1 from "../../../assets/images/fa1.webp";
import FA2 from "../../../assets/images/fa2.webp";
import FA3 from "../../../assets/images/fa3.webp";
import FA4 from "../../../assets/images/fa4.webp";

const FashionApproach = () => {
  return (
    <Container className="text-center my-5">
      {/* Title & Description */}
      <h2 className="fw-bold">OUR APPROACH TO FASHION DESIGN</h2>
      <p className="text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
        At Elegant Vogue, we blend creativity with craftsmanship to create
        fashion that transcends trends and stands the test of time. Each design is meticulously crafted,
        ensuring the highest quality exquisite finish.
      </p>

      {/* Image Grid */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <img src={FA1} alt="Fashion 1" style={{ width: "250px", height: "400px", objectFit: "cover", borderRadius: "10px" }} />
          <img src={FA3} alt="Fashion 3" style={{ width: "250px", height: "300px", objectFit: "cover", borderRadius: "10px" }} />
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "100px" }}>
          <img src={FA2} alt="Fashion 2" style={{ width: "250px", height: "300px", objectFit: "cover", borderRadius: "10px" }} />
          <img src={FA4} alt="Fashion 4" style={{ width: "250px", height: "400px", objectFit: "cover", borderRadius: "10px" }} />
        </div>
      </div>
    </Container>
  );
};

export default FashionApproach;
