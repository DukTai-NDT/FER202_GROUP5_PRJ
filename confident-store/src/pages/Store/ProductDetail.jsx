import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import SuccessNotify from "../../components/User/SuccessNotify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    variant: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setSelectedImage(data.images.main);
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const isLogin = localStorage.getItem("user");

    if (!isLogin) {
      let msg = alert("you must login before shopping");
      if (msg) {
        navigate("/login");
      }
      return;
    }

    if (!selectedColor || !selectedSize) {
      setNotification({
        message: "Please select a color and size.",
        variant: "danger",
      });
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: product.images.main,
      quantity: 1,
    };

    const result = await addToCart(cartItem);

    if (result) {
      // Lấy giỏ hàng hiện tại từ localStorage
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const existingItem = currentCart.find(
        (item) =>
          item.productId === cartItem.productId &&
          item.color === cartItem.color &&
          item.size === cartItem.size
      );

      if (existingItem) {
        existingItem.quantity += 1; // Tăng số lượng nếu sản phẩm đã có
      } else {
        currentCart.push(cartItem); // Thêm sản phẩm mới vào giỏ hàng
      }

      // Lưu giỏ hàng mới vào localStorage
      localStorage.setItem("cart", JSON.stringify(currentCart));

      // Phát sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));

      // Hiển thị thông báo thành công
      setNotification({
        message: "Added to cart successfully!",
        variant: "success",
      });

      // Điều hướng sang trang giỏ hàng
      navigate("/cart");
    } else {
      setNotification({
        message: "Failed to add to cart. Please try again.",
        variant: "danger",
      });
    }
  };
  const changeImg = (colorName) => {
    for (const i in product.colors) {
      if (product.colors[i].name === colorName) {
        console.log(product.colors[i].name);
        console.log(product.images.gallery[i]);
        setSelectedImage(product.images.gallery[i]);
      }
    }
  };

  if (!product) return <h2 className="text-center my-5">Loading...</h2>;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6} className="text-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="img-fluid mb-3"
            style={{ maxHeight: "400px" }}
          />
          <div className="d-flex justify-content-center gap-2">
            {product.images.gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Gallery"
                className="img-thumbnail"
                style={{
                  width: "60px",
                  cursor: "pointer",
                  border: selectedImage === img ? "2px solid black" : "none",
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </Col>

        <Col md={6}>
          <h2 className="fw-bold">{product.name}</h2>
          <h4 className="fw-bold">${product.price}</h4>
          <p className="text-muted">MRP incl. of all taxes</p>
          <p>{product.description}</p>

          <h6>Color</h6>
          <div className="d-flex gap-2 mb-3">
            {product.colors.map((color) => (
              <Button
                key={color.name}
                variant="outline-dark"
                size="sm"
                className="rounded-circle"
                style={{
                  backgroundColor: color.hex,
                  width: "30px",
                  height: "30px",
                  border:
                    selectedColor === color.name ? "2px solid black" : "none",
                }}
                onClick={() => {
                  setSelectedColor(color.name);
                  changeImg(color.name);
                }}
              ></Button>
            ))}
          </div>

          <h6>Size</h6>
          <div className="d-flex gap-2 mb-3">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "dark" : "outline-dark"}
                size="sm"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>

          {/* Thêm SuccessNotify */}
          <SuccessNotify
            message={notification.message}
            variant={notification.variant}
            onClose={() => setNotification({ message: "", variant: "" })}
          />

          <div className="d-flex gap-3">
            <Button
              variant="outline-secondary"
              href={product.measurement_guide}
              target="_blank"
            >
              Measurement Guide
            </Button>
            <Button variant="dark" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
