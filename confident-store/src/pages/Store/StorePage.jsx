import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Placeholder,
  Pagination,
} from "react-bootstrap";
import { getProducts } from "../../services/storeService";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6; // Số sản phẩm hiển thị trên mỗi trang

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProducts();
      console.log("Products in StorePage:", data);
      setProducts(data);
      setLoading(false);
    };

    setTimeout(() => {
      fetchData();
    }, 3000);
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSize ? product.sizes.includes(selectedSize) : true) &&
      (selectedColor
        ? product.colors.some((color) => color.name === selectedColor)
        : true)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <Container className="my-5">
      <h2 className="fw-bold">PRODUCTS</h2>

      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Row>
        {/* Filters Section */}
        <Col md={3}>
          <h5 className="fw-bold">Filters</h5>

          {/* Size Filter */}
          <h6 className="mt-3">Size</h6>
          {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
            <Form.Check
              key={size}
              type="radio"
              label={size}
              name="size"
              checked={selectedSize === size}
              onChange={() => setSelectedSize(size)}
            />
          ))}

          {/* Color Filter */}
          <h6 className="mt-3">Colors</h6>
          {["Black", "White", "Green", "Blue"].map((color) => (
            <Button
              key={color}
              variant="outline-dark"
              size="sm"
              className="me-2 mb-2"
              style={{
                backgroundColor: selectedColor === color ? "#000" : "#fff",
                color: selectedColor === color ? "#fff" : "#000",
              }}
              onClick={() =>
                setSelectedColor(selectedColor === color ? "" : color)
              }
            >
              {color}
            </Button>
          ))}

          {/* Reset Filters */}
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              setSearchTerm("");
              setSelectedSize("");
              setSelectedColor("");
            }}
          >
            Reset Filters
          </Button>
        </Col>

        {/* Product List */}
        <Col md={9}>
          <Row>
            {displayedProducts.map((product) => (
              <Col key={product.id} md={4} className="mb-4 d-flex">
                <Card className="border-0 shadow h-100 w-100 d-flex">
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {/* Ảnh cùng tỉ lệ/chiều cao */}
                    <Card.Img
                      variant="top"
                      src={product.images.main}
                      style={{
                        height: "250px",
                        width: "100%",
                        objectFit: "contain", // hoặc "cover"
                        padding: "10px",
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      {/* Giữ title 2 dòng cho đồng đều */}
                      <Card.Title
                        style={{ minHeight: 48, lineHeight: "1.2em" }}
                      >
                        {product.name}
                      </Card.Title>

                      {/* đẩy giá xuống cuối thẻ */}
                      <div className="mt-auto">
                        <Card.Text className="fw-bold">
                          ${product.price}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination size="md">
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StorePage;
