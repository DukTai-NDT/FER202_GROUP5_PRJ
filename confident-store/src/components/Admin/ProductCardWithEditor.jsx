import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form, Col, Spinner, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

// Custom Hook cho Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Hủy timeout nếu value thay đổi (người dùng gõ tiếp)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const ProductCardWithEditor = ({ product, onSave, onDelete, onUpdate }) => {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(product, null, 2) // Định dạng JSON cho đẹp
  );
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  // 1. Sử dụng Debounce
  const debouncedJsonText = useDebounce(jsonText, 1500); // 1.5 giây

  // 2. Effect này sẽ chạy khi người dùng ngừng gõ 1.5s
  useEffect(() => {
    // Chỉ lưu nếu text đã được debounce và khác với text gốc của product
    const originalJson = JSON.stringify(product, null, 2);
    if (debouncedJsonText !== originalJson) {
      handleSave();
    }
  }, [debouncedJsonText]); // Chỉ phụ thuộc vào giá trị đã debounce

  // 3. Effect này đồng bộ state nếu prop `product` từ bên ngoài thay đổi
  useEffect(() => {
    // Chỉ cập nhật nếu không đang trong trạng thái lưu
    // và text bên ngoài khác text hiện tại (tránh ghi đè khi đang gõ)
    const newJson = JSON.stringify(product, null, 2);
    if (saveStatus !== 'saving' && newJson !== jsonText) {
       setJsonText(newJson);
    }
  }, [product]);

  const handleSave = async () => {
    let parsedData;
    try {
      // 4. Kiểm tra JSON hợp lệ
      parsedData = JSON.parse(debouncedJsonText);
      setError(null);
    } catch (e) {
      setError("JSON không hợp lệ! Không thể lưu.");
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    try {
      // 5. Gọi hàm onSave từ cha
      await onSave(product.id, parsedData);
      setSaveStatus("saved");
      // Tự quay về idle sau 2s
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (apiError) {
      setError("Lỗi khi gọi API lưu: " + apiError.message);
      setSaveStatus("error");
    }
  };

  const getStatusMessage = () => {
    if (saveStatus === "saving") {
      return <span className="text-warning"><Spinner as="span" animation="border" size="sm" /> Đang lưu...</span>;
    }
    if (saveStatus === "saved") {
      return <span className="text-success">Đã lưu!</span>;
    }
    if (saveStatus === "error" && error) {
      return <Alert variant="danger" className="p-2 mt-2">{error}</Alert>;
    }
    return <span className="text-muted">Đã đồng bộ.</span>; // idle
  };

return (
    <Card className="h-100 shadow-sm">
        <Card.Img 
            variant="top" 
            style={{ 
                height: "200px", 
                objectFit: "cover",
                borderBottom: "1px solid #eee" 
            }} 
            src={product.images.main} 
        />
        <Card.Body className="d-flex flex-column">
            <Card.Title className="text-primary h5 mb-3">{product.name}</Card.Title>
            <Card.Text className="text-success fw-bold mb-3">
                {`${product.currency} ${product.price}`}
            </Card.Text>
            
            <Form.Group className="flex-grow-1">
                <Form.Label className="text-secondary">Edit JSON:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={10}
                    value={jsonText}
                    onChange={(e) => {
                        setJsonText(e.target.value);
                        setSaveStatus("idle");
                        setError(null);
                    }}
                    style={{ 
                        fontFamily: "monospace", 
                        fontSize: "0.85rem",
                        borderColor: error ? '#dc3545' : '#ced4da',
                        backgroundColor: '#f8f9fa'
                    }}
                    className="mb-3"
                />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mt-auto">
                <div>{getStatusMessage()}</div>
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onUpdate(product)}
                    >
                        Update
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDelete(product)}
                    >
                        <FaTrash /> Delete
                    </Button>
                </div>
            </div>
        </Card.Body>
    </Card>
);
};

export default ProductCardWithEditor;