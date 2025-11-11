import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form, Col, Spinner, Alert } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa"; // Thêm FaEdit

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
  }, [value, delay]); // Bỏ delay khỏi dependency array
  return debouncedValue;
}

// --- BỔ SUNG: Hàm Validate Cấu Trúc (Recursive) ---
/**
 * Kiểm tra xem `newObj` có cấu trúc keys giống hệt `originalObj` hay không.
 * Nó cấm thêm/xóa/đổi tên keys, nhưng cho phép sửa values (string, number...)
 * và cho phép sửa nội dung của arrays (ví dụ: gallery).
 */
function validateJsonStructure(originalObj, newObj) {
    // Lấy tất cả keys của cả 2 object và sort để so sánh
    const originalKeys = Object.keys(originalObj).sort();
    const newKeys = Object.keys(newObj).sort();

    // 1. So sánh mảng keys (cách nhanh nhất)
    // Nếu mảng keys khác nhau (thêm/xóa/đổi tên) -> Lỗi
    if (JSON.stringify(originalKeys) !== JSON.stringify(newKeys)) {
        return false;
    }

    // 2. Nếu keys giống nhau, kiểm tra đệ quy các object con
    for (const key of originalKeys) {
        const originalValue = originalObj[key];
        const newValue = newObj[key];

        // Chỉ kiểm tra đệ quy nếu là object (và không phải array, không phải null)
        if (typeof originalValue === 'object' && originalValue !== null && !Array.isArray(originalValue)) {
            
            // Nếu kiểu dữ liệu bị thay đổi (ví dụ: admin xóa {} của images)
            if (typeof newValue !== 'object' || newValue === null || Array.isArray(newValue)) {
                return false; // Lỗi: cấu trúc đã bị thay đổi
            }
            
            // Gọi đệ quy để kiểm tra object con (ví dụ: check 'main' và 'gallery' bên trong 'images')
            if (!validateJsonStructure(originalValue, newValue)) {
                return false; // Cấu trúc con không hợp lệ
            }
        }
    }
    
    // Nếu vượt qua tất cả kiểm tra
    return true;
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
  }, [debouncedJsonText, product]); // Thêm product vào dependency

  // 3. Effect này đồng bộ state nếu prop `product` từ bên ngoài thay đổi
  useEffect(() => {
    // Chỉ cập nhật nếu không đang trong trạng thái lưu
    // và text bên ngoài khác text hiện tại (tránh ghi đè khi đang gõ)
    const newJson = JSON.stringify(product, null, 2);
    if (saveStatus !== 'saving' && newJson !== jsonText) {
       setJsonText(newJson);
       setError(null); // Reset lỗi khi prop thay đổi
       setSaveStatus("idle"); // Reset status
    }
  }, [product]);

  const handleSave = async () => {
    let parsedData;
    
    // B1: Kiểm tra cú pháp JSON
    try {
      parsedData = JSON.parse(debouncedJsonText);
      setError(null);
    } catch (e) {
      setError("Lỗi cú pháp JSON: " + e.message);
      setSaveStatus("error");
      return;
    }

    // B2: (MỚI) Kiểm tra cấu trúc (keys)
    if (!validateJsonStructure(product, parsedData)) {
        setError("Lỗi cấu trúc: Bạn không được phép thêm, xóa, hoặc đổi tên các trường (keys). Chỉ được phép sửa giá trị (values).");
        setSaveStatus("error");
        return; // Dừng lại
    }
    
    // B3: (MỚI) Kiểm tra ID không bị thay đổi
    if (parsedData.id !== product.id) {
        setError("Lỗi: Bạn không được phép thay đổi ID của sản phẩm.");
        setSaveStatus("error");
        return; // Dừng lại
    }

    // B4: Nếu tất cả đều hợp lệ, tiến hành lưu
    setSaveStatus("saving");
    try {
      // Gọi hàm onSave từ cha
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
    // Sửa lại: Hiển thị lỗi ngay đây
    if (saveStatus === "error" && error) {
      // Dùng Alert nhỏ để hiển thị lỗi
      return (
        <Alert variant="danger" className="p-2 mt-2" style={{fontSize: '0.8rem'}}>
            {error}
        </Alert>
      );
    }
    // Bỏ text "Đã đồng bộ" để đỡ rối
    return null; // idle
  };
  
  // SỬA LỖI: Lấy ảnh (fix lỗi `images` vs `image` từ JSON)
  const mainImage = (product.images || product.image)?.main || 'https://placehold.co/600x400?text=No+Image';

return (
    <Card className="h-100 shadow-sm">
        <Card.Img 
            variant="top" 
            style={{ 
                height: "200px", 
                objectFit: "cover",
                borderBottom: "1px solid #eee" 
            }} 
            src={mainImage} // Sử dụng biến mainImage đã fix
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400?text=Error'; }}
        />
        <Card.Body className="d-flex flex-column">
            <Card.Title className="text-primary h5 mb-3">{product.name}</Card.Title>
            <Card.Text className="text-success fw-bold mb-3">
                {`${product.currency} ${product.price}`}
            </Card.Text>
            
            <Form.Group className="flex-grow-1 d-flex flex-column">
                <Form.Label className="text-secondary">Edit JSON:</Form.Label>
                <Form.Control
                    as="textarea"
                    value={jsonText}
                    onChange={(e) => {
                        setJsonText(e.target.value);
                        setSaveStatus("idle"); // Reset status khi gõ
                        setError(null);
                    }}
                    style={{ 
                        fontFamily: "monospace", 
                        fontSize: "0.85rem",
                        backgroundColor: '#f8f9fa',
                        flexGrow: 1 // Để textarea lấp đầy
                    }}
                    // SỬA: Thêm isInvalid để highlight viền đỏ khi lỗi
                    isInvalid={!!error || saveStatus === "error"} 
                />
            </Form.Group>

            {/* Hiển thị lỗi hoặc status */}
            <div className="mt-2" style={{ minHeight: '40px' }}>
                {getStatusMessage()}
            </div>

            <div className="d-flex justify-content-end align-items-center mt-auto pt-2 border-top">
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onUpdate(product)}
                    >
                        <FaEdit /> Sửa (Modal) {/* Sửa text cho rõ ràng */}
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDelete(product)}
                    >
                        <FaTrash /> Xóa {/* Sửa text */}
                    </Button>
                </div>
            </div>
        </Card.Body>
    </Card>
);
};

export default ProductCardWithEditor;