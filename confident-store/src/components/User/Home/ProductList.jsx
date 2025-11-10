import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import Slider from "react-slick"; // Import React Slick
import { getProducts } from "../../../services/productService";
import {Link} from 'react-router-dom'
const MAX_PRODUCTS = 6; // Total items available

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProducts();
            setProducts(data);
        };

        fetchData();
    }, []);

    // Cấu hình cho React Slick
    const settings = {
        dots: false, // Tắt dấu chấm điều hướng
        infinite: true, // Cho phép cuộn vô tận
        speed: 500,
        slidesToShow: 4, // Hiển thị 4 sản phẩm cùng lúc
        slidesToScroll: 1, // Cuộn 1 sản phẩm mỗi lần
        nextArrow: <CustomNextArrow />, // Custom nút Next
        prevArrow: <CustomPrevArrow />, // Custom nút Prev
    };

    return (
        <Container>
            <h2 className="fw-bold mt-4">NEW THIS WEEK</h2>
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product.id} className="px-2">
                        <Card
                            className="border-0 text-center"
                            style={{ cursor: "pointer" }}
                            // onClick={() => window.location.href = `/product/${product.id}`}
                        >
                            <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                            <Card.Img variant="top" src={product.image} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text className="fw-bold">${product.price}</Card.Text>
                            </Card.Body>
                            </Link>
                        </Card>
                    </div>
                ))}
            </Slider>
        </Container>
    );
};

// Custom Nút Next
const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow custom-next"
            onClick={onClick}
            style={{
                position: "absolute",
                right: "-40px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "24px",
                zIndex: 10,
            }}
        >
            ▶
        </div>
    );
};

// Custom Nút Prev
const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow custom-prev"
            onClick={onClick}
            style={{
                position: "absolute",
                left: "-40px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "24px",
                zIndex: 10,
            }}
        >
            ◀
        </div>
    );
};

export default ProductList;
