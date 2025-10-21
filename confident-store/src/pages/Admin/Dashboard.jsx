import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Modal, Form, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ProductModal from "../../components/Admin/ProductModal";
import DeleteConfirmModal from "../../components/Admin/DeleteModal";
import { createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getProducts } from "../../services/storeService";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [productsPerPage] = useState(6); // Number of products per page

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products with all products
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleCreate = () => {
    setCurrentProduct(null);  // Clear the product data for add
    setShowCreate(true);  // Show the create modal
  };

  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setShowCreate(true);  // Show the update modal
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
    setShowDelete(true); // Show delete confirmation modal
  };

  const handleCloseCreate = () => setShowCreate(false);
  const handleCloseDelete = () => setShowDelete(false);

  const handleDeleteConfirm = async () => {
    const result = await deleteProduct(currentProduct.id);
    if (result.success) {
      setProducts(products.filter((product) => product.id !== currentProduct.id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== currentProduct.id));
    } else {
      alert(result.message);
    }
    setShowDelete(false);
  };

  const handleCreateOrUpdateProduct = async (formData) => {
    let updatedProducts;
    if (currentProduct) {
      updatedProducts = await updateProduct(currentProduct.id, formData);
      setProducts(
        products.map((product) => (product.id === currentProduct.id ? updatedProducts : product))
      );
      setFilteredProducts(
        filteredProducts.map((product) => (product.id === currentProduct.id ? updatedProducts : product))
      );
    } else {
      updatedProducts = await createProduct(formData);
      setProducts([...products, updatedProducts]);
      setFilteredProducts([...filteredProducts, updatedProducts]);
    }
    setShowCreate(false);
  };

  const handleShowDetails = (product) => {
    setProductDetails(product); // Update product details with the selected product
    setShowDetails(true); // Show details modal
  };

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when a new search is made
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <Container fluid>
      <Row className="my-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={handleCreate}>
            <FaPlus /> Add New Product
          </Button>
        </Col>
      </Row>
      <Row>
        {currentProducts.map((product) => (
          <Col md={4} key={product.id} className="mb-4">
            <Card>
              <Card.Img variant="top" style={{  objectFit: "cover" }} src={product.images.main} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{`${product.currency} ${product.price}`}</Card.Text>
                <Button variant="primary" onClick={() => handleShowDetails(product)}>
                  View Details
                </Button>
                <div className="mt-2">
                  <Button variant="warning" onClick={() => handleUpdate(product)} className="me-2">
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(product)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item key={number} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Create/Update Product Modal */}
      <ProductModal
        show={showCreate}
        handleClose={handleCloseCreate}
        product={currentProduct}
        onSave={handleCreateOrUpdateProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDeleteConfirm}
        product={currentProduct}
      />

      {/* Product Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{productDetails?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Description</h5>
          <p>{productDetails?.description}</p>
          <h6>Price: {productDetails?.currency} {productDetails?.price}</h6>
          <h6>Sizes: {productDetails?.sizes.join(", ")}</h6>
          <h6>Colors:</h6>
          <div>
            {productDetails?.colors.map((color) => (
              <span
                key={color.name}
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: color.hex,
                  marginRight: "5px",
                }}
              ></span>
            ))}
          </div>
          <h6>Images:</h6>
          <div>
            {productDetails?.images.gallery.map((image, index) => (
              <img key={index} src={image} alt="Product" style={{ width: "100%", marginBottom: "10px" }} />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
