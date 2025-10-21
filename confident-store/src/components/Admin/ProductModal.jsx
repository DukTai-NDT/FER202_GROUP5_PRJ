import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ProductModal = ({ show, handleClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        currency: "USD",
        description: "",
        tax_included: true,
        colors: [{ name: "Black", hex: "#000000" }],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: { main: "", gallery: [] },
        measurement_guide: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                colors: product.colors || [{ name: "Black", hex: "#000000" }],
                sizes: product.sizes || ["XS", "S", "M", "L", "XL"],
                images: product.images || { main: "", gallery: [] },
                measurement_guide: product.measurement_guide || "",
            });
        } else {
            setFormData({
                name: "",
                price: 0,
                currency: "USD",
                description: "",
                tax_included: true,
                colors: [{ name: "Black", hex: "#000000" }],
                sizes: ["XS", "S", "M", "L", "XL"],
                images: { main: "", gallery: [] },
                measurement_guide: "",
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Chỉ cập nhật các trường có tên tương ứng
        if (name === "main") {
            setFormData((prevData) => ({
                ...prevData,
                images: { ...prevData.images, main: value }, // Chỉ cập nhật phần main image
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };



    const handleColorChange = (index, e) => {
        const newColors = [...formData.colors];
        newColors[index][e.target.name] = e.target.value;
        setFormData({ ...formData, colors: newColors });
    };

    const handleSizeChange = (e) => {
        const newSizes = e.target.value.split(",");
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleAddColor = () => {
        setFormData({ ...formData, colors: [...formData.colors, { name: "", hex: "#000000" }] });
    };

    const handleRemoveColor = (index) => {
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData({ ...formData, colors: newColors });
    };

    const handleAddGalleryImage = () => {
        setFormData({ ...formData, images: { ...formData.images, gallery: [...formData.images.gallery, ""] } });
    };

    const handleGalleryImageChange = (index, value) => {
        const newGallery = [...formData.images.gallery];
        newGallery[index] = value;
        setFormData({ ...formData, images: { ...formData.images, gallery: newGallery } });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product ? "Edit Product" : "Create Product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Product Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Price */}
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Colors */}
                    <Form.Group className="mb-3">
                        <Form.Label>Colors</Form.Label>
                        {formData.colors.map((color, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Color Name"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(index, e)}
                                    className="me-2"
                                />
                                <Form.Control
                                    type="color"
                                    name="hex"
                                    value={color.hex}
                                    onChange={(e) => handleColorChange(index, e)}
                                />
                                <Button variant="danger" onClick={() => handleRemoveColor(index)} className="ms-2">Remove</Button>
                            </div>
                        ))}
                        <Button variant="primary" onClick={handleAddColor}>Add Color</Button>
                    </Form.Group>

                    {/* Sizes */}
                    <Form.Group className="mb-3">
                        <Form.Label>Sizes</Form.Label>
                        <Form.Control
                            type="text"
                            name="sizes"
                            value={formData.sizes.join(", ")}
                            onChange={handleSizeChange}
                            placeholder="Enter sizes separated by commas"
                        />
                    </Form.Group>

                    {/* Main Image URL */}
                    <Form.Group className="mb-3">
                        <Form.Label>Main Image</Form.Label>
                        <Form.Control
                            type="url"
                            name="main"
                            value={formData.images.main}
                            onChange={handleChange}  // Chắc chắn rằng handleChange sẽ cập nhật giá trị đúng
                            placeholder="Enter URL for main image"
                        />
                    </Form.Group>




                    {/* Gallery Images */}
                    <Form.Group className="mb-3">
                        <Form.Label>Gallery Images</Form.Label>
                        {formData.images.gallery.map((image, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control
                                    type="url"
                                    name="gallery"
                                    value={image}
                                    onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                                    className="me-2"
                                    placeholder={`Gallery Image ${index + 1}`}
                                />
                            </div>
                        ))}
                        <Button variant="primary" onClick={handleAddGalleryImage}>Add Gallery Image</Button>
                    </Form.Group>

                    {/* Measurement Guide */}
                    <Form.Group className="mb-3">
                        <Form.Label>Measurement Guide</Form.Label>
                        <Form.Control
                            type="url"
                            name="measurement_guide"
                            value={formData.measurement_guide}
                            onChange={handleChange}
                            placeholder="Enter URL for size guide"
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={handleSave}>
                        {product ? "Update" : "Create"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProductModal;
