import React, { useState } from "react";
import { Modal, Button, Tabs, Tab, Form, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";

const ImportProductsModal = ({ show, handleClose, onImport }) => {
  const [key, setKey] = useState("file-excel");
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState(null);

  // Xử lý khi upload file (Excel hoặc JSON)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();

    if (key === "file-excel") {
      // Read Excel as array buffer and parse
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);

          // Chuyển đổi key của JSON (từ file Excel) sang key của product
          const products = mapExcelDataToProducts(json);
          handleImport(products);
        } catch (err) {
          console.error(err);
          setError(
            "Lỗi khi đọc file Excel. Đảm bảo đúng định dạng." +
              (err && err.message ? ` (${err.message})` : "")
          );
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (key === "file-json") {
      // Read JSON as text and parse
      reader.onload = (ev) => {
        try {
          const text = ev.target.result;
          const json = JSON.parse(text);
          // Giả sử JSON đã có cấu trúc đúng (mảng object)
          handleImport(json);
        } catch (err) {
          console.error(err);
          setError(
            "Lỗi khi đọc file JSON. Đảm bảo file JSON hợp lệ." +
              (err && err.message ? ` (${err.message})` : "")
          );
        }
      };
      reader.readAsText(file);
    } else {
      // Fallback: try to detect by extension
      const name = (file.name || "").toLowerCase();
      if (name.endsWith(".json")) {
        reader.onload = (ev) => {
          try {
            const text = ev.target.result;
            const json = JSON.parse(text);
            handleImport(json);
          } catch (err) {
            console.error(err);
            setError("Lỗi khi đọc file JSON. Đảm bảo file JSON hợp lệ.");
          }
        };
        reader.readAsText(file);
      } else {
        // default to excel
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const products = mapExcelDataToProducts(json);
            handleImport(products);
          } catch (err) {
            console.error(err);
            setError("Lỗi khi đọc file Excel. Đảm bảo đúng định dạng.");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  // Xử lý khi dán từ Excel
  const handlePasteImport = () => {
    if (!pastedText) {
      setError("Vui lòng dán dữ liệu vào ô text.");
      return;
    }
    setError(null);
    try {
      const lines = pastedText.trim().split("\n").filter(Boolean);
      if (lines.length < 2) {
        setError("Không tìm thấy dữ liệu hợp lệ để import.");
        return;
      }
      const headers = lines[0].split("\t").map((h) => h.trim().toLowerCase()); // Lấy header
      const rawProducts = lines.slice(1).map((line) => {
        const values = line.split("\t");
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] !== undefined ? values[index] : "";
        });
        return obj;
      });

      // Chuyển đổi key (giống như Excel)
      const products = mapExcelDataToProducts(rawProducts);
      handleImport(products);
    } catch (err) {
      console.error(err);
      setError(
        "Lỗi khi xử lý dữ liệu dán. Đảm bảo bạn copy đúng từ Excel (dùng tab)." +
          (err && err.message ? ` (${err.message})` : "")
      );
    }
  };

  // Hàm này RẤT QUAN TRỌNG
  // Bạn phải ánh xạ tên cột trong Excel/Paste sang tên trường trong object product
  const mapExcelDataToProducts = (data) => {
    return data.map((item) => {
      const sizesRaw = item["sizes"] || item["kích thước"] || item["size"] || "";
      const colorsRaw = item["colors"] || item["màu"] || item["color"] || "";
      const galleryRaw =
        item["ảnh phụ"] ||
        item["images.gallery"] ||
        item["gallery"] ||
        item["images"] ||
        "";

      const parseList = (v) =>
        (v || "")
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      return {
        name: item["tên sản phẩm"] || item["name"] || "",
        price: Number(
          (item["giá"] || item["price"] || 0)
            .toString()
            .replace(/[^\d.-]/g, "")
        ),
        description: item["mô tả"] || item["description"] || "",
        currency: item["tiền tệ"] || item["currency"] || "USD",
        sizes: parseList(sizesRaw),
        colors: parseList(colorsRaw).map((c) => ({ name: c, hex: "#000000" })),
        images: {
          main: item["ảnh chính"] || item["images.main"] || item["image"] || "",
          gallery: parseList(galleryRaw),
        },
      };
    });
  };

  // Hàm xử lý import cuối cùng
  const handleImport = (products) => {
    if (!products || products.length === 0) {
      setError("Không tìm thấy sản phẩm nào để import.");
      return;
    }
    // Gọi hàm onImport từ cha
    try {
      onImport(products);
      handleClose(); // Đóng modal sau khi import
    } catch (err) {
      console.error(err);
      setError("Lỗi khi import sản phẩm: " + (err && err.message ? err.message : ""));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Import sản phẩm hàng loạt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Tabs
          id="import-tabs"
          activeKey={key}
          onSelect={(k) => {
            setKey(k);
            setError(null);
          }}
          className="mb-3"
        >
          <Tab eventKey="file-excel" title="Import từ File Excel">
            <Form.Group controlId="formFileExcel">
              <Form.Label>Chọn file .xlsx hoặc .xls</Form.Label>
              <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            </Form.Group>
            <small className="form-text text-muted">
              File Excel phải có các cột: `name`, `price`, `description`, `currency`, `sizes` (cách nhau bởi dấu phẩy), `colors` (cách nhau bởi dấu phẩy), `images.main`, `images.gallery` (cách nhau bởi dấu phẩy).
            </small>
          </Tab>
          <Tab eventKey="paste-excel" title="Dán từ Excel">
            <Form.Group controlId="formPasteExcel">
              <Form.Label>Dán dữ liệu (copy từ Excel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                placeholder="Copy và dán dữ liệu từ file Excel vào đây. Dòng đầu tiên phải là header."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handlePasteImport} className="mt-3">
              Import từ dữ liệu dán
            </Button>
          </Tab>
          <Tab eventKey="file-json" title="Import từ File JSON">
            <Form.Group controlId="formFileJSON">
              <Form.Label>Chọn file .json</Form.Label>
              <Form.Control type="file" accept=".json" onChange={handleFileChange} />
            </Form.Group>
            <small className="form-text text-muted">
              File JSON phải là một mảng (array) các object sản phẩm có cấu trúc chuẩn.
            </small>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default ImportProductsModal;