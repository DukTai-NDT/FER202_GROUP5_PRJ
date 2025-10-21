import { Container, Row, Col, Button } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="my-5">
      {/* About Us Section */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h2 className="fw-bold">ABOUT US</h2>
          <p>
            Our clothing brand helps people create a comfortable and stylish image in the modern world.
          </p>
          <p>
            Our clothes are made entirely from natural materials, which allow you to create one hundred percent comfort.
          </p>
        </Col>
        <Col md={6} className="text-end">
          <img src="https://media1.calvinklein.com/images/20240801_aug_misc/Misc/SEO_Designer_Denim_2x.webp" alt="About Us" className="img-fluid rounded" style={{ maxWidth: "250px" }} />
          <Button variant="link" className="d-block mt-3 text-dark fw-bold">
            Read more →
          </Button>
        </Col>
      </Row>

      {/* Popular Goods Section */}
      <h2 className="fw-bold">POPULAR GOODS</h2>
      <p className="text-muted">Frequently purchased products this season</p>
      <Row>
        <Col md={3}>
          <img src="https://media.istockphoto.com/id/497347859/photo/fashion-male-model.jpg?s=612x612&w=0&k=20&c=29Sx1gE5IL7-p0GpTrLVBjU_jw2px-7p1azAhAaLK9U=" alt="Product 1" className="img-fluid rounded" />
        </Col>
        <Col md={3}>
          <img src="https://i0.wp.com/www.society19.com/uk/wp-content/uploads/sites/5/2019/03/a7e3e70217fc4de0085e5d8be69a140d.jpeg?fit=564%2C423&ssl=1" alt="Product 2" className="img-fluid rounded" />
        </Col>
        <Col md={3}>
          <img src="https://st4.depositphotos.com/5311026/37850/i/450/depositphotos_378507200-stock-photo-cool-stylish-man-in-black.jpg" alt="Product 3" className="img-fluid rounded" />
        </Col>
        <Col md={3}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJAzrAX_1pHky_HRVXyq21oGkErs8JTCq5hpwf3hlIretITo3En2gKt7rSsaq-Oqbu20I&usqp=CAU" alt="Product 4" className="img-fluid rounded" />
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
