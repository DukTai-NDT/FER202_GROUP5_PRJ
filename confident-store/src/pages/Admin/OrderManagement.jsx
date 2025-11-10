import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Card, Row, Col } from "react-bootstrap";
import { getOrders, deleteOrder } from "../../services/orderService";
import * as XLSX from "xlsx"; // Import thư viện xuất Excel

const OrderManagement = () => {

    const [orders, setOrders] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State để hiển thị Modal xác nhận xóa
    const [currentOrderId, setCurrentOrderId] = useState(null); // State để lưu id đơn hàng đang được xác nhận xóa
    const [productDetails, setProductDetails] = useState(null); // State để lưu thông tin chi tiết đơn hàng
    const [order, setOrder] = useState([]);
    useEffect(() => {
        // Lấy đơn hàng từ API khi trang được render
        getOrders()
            .then((data) => setOrders(data))
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);
    const handleExportExcel = () => {
        if (orders.length === 0) {
            alert("No orders to export!");
            return;
        }
    
        // Chuẩn bị dữ liệu Excel
        const excelData = orders.map(order => ({
            "Order ID": order.id,
            "Customer Name": order.customer.name,
            "Email": order.customer.email,
            "Phone": order.customer.phone,
            "Address": order.customer.address,
            "Total": `${order.total} ${order.currency || 'USD'}`,
            "Payment Method": order.paymentMethod,
            "Status": order.status,
            "Date": new Date(order.date).toLocaleString(),
            "Items": order.items.map(item => `${item.name} (Size: ${item.size}, Color: ${item.color}, Qty: ${item.quantity})`).join("\n")
        }));
    
        // Tạo worksheet từ dữ liệu
        const ws = XLSX.utils.json_to_sheet(excelData);
    
        // Tạo workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
    
        // Xuất file Excel
        XLSX.writeFile(wb, "Order_List.xlsx");
    };
    // Xử lý khi nhấn vào nút xóa
    const handleDelete = async () => {
        if (currentOrderId) {
            try {
                const result = await deleteOrder(currentOrderId);
                if (result.success) {
                    // Xóa đơn hàng khỏi danh sách trong state sau khi xóa thành công
                    setOrders(orders.filter((order) => order.id !== currentOrderId));
                    setShowDeleteConfirm(false);  // Đóng modal xác nhận xóa
                } else {
                    alert(result.message || "Error deleting order");
                }
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Error deleting order");
            }

        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Error deleting order");
      }
    }
  };

  // Mở Modal xác nhận xóa
  const handleDeleteConfirm = (orderId) => {
    setCurrentOrderId(orderId); // Lưu ID đơn hàng đang xác nhận
    setShowDeleteConfirm(true); // Hiển thị Modal xác nhận xóa
  };

  const handleShowDetails = (order) => {
    setProductDetails(order); // Cập nhật chi tiết đơn hàng vào state
    setShowDetails(true); // Mở modal để hiển thị chi tiết
  };

  return (
    <div>
      <h2>Order Management</h2>
      <Button variant="success" className="mb-3" onClick={handleExportExcel}>
        Export to Excel
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer.name}</td>
              <td>{`${order.total} ${order.currency || "USD"}`}</td>
              <td>{order.status}</td>
              <td>{new Date(order.date).toLocaleString()}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowDetails(order)}
                  className="me-2"
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirm(order.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Hiển thị chi tiết đơn hàng */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productDetails && (
            <>
              <h5>Customer Information</h5>
              <p>Name: {productDetails.customer.name}</p>
              <p>Email: {productDetails.customer.email}</p>
              <p>Phone: {productDetails.customer.phone}</p>
              <p>Address: {productDetails.customer.address}</p>

              <h6>Items:</h6>
              <Row>
                {productDetails.items.map((item) => (
                  <Col md={4} key={item.id}>
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          Size: {item.size}, Color: {item.color} <br />
                          Quantity: {item.quantity} <br />
                          Price: ${item.price * item.quantity}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
