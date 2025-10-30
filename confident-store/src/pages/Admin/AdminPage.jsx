import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios"; // Dùng để gọi json-server
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import AIChat from "../../components/Admin/AIChat"; // Component chat từ lần trước
import { getDashboardSummary } from "../../services/AIService";
import ReactMarkdown from 'react-markdown';


// Đăng ký các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:9999"; // URL của json-server

// *** TỈ GIÁ GIẢ ĐỊNH (Bạn có thể thay đổi) ***
const MOCK_USD_TO_VND_RATE = 25000;

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState(null);
    const SUMMARY_STORAGE_KEY = "adminAiSummary";
  // *** THÊM STATE TIỀN TỆ ***
  const [currency, setCurrency] = useState("USD"); // Mặc định là USD


  useEffect(() => {
    const storedData = localStorage.getItem(SUMMARY_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const now = new Date().getTime();

        // Kiểm tra xem dữ liệu còn hạn không
        if (parsedData.expires > now) {
          setAiSummary(parsedData.summary);
        } else {
          // Hết hạn thì xóa
          localStorage.removeItem(SUMMARY_STORAGE_KEY);
        }
      } catch (e) {
        // Lỗi parse JSON, xóa key
        localStorage.removeItem(SUMMARY_STORAGE_KEY);
      }
    }
  }, []);
  // 1. Fetch dữ liệu (Giữ nguyên)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(`${API_URL}/orders`);
        const productsRes = await axios.get(`${API_URL}/products`);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError("Không thể tải dữ liệu từ json-server. Bạn đã chạy `json-server` chưa?");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // 2. Xử lý và tính toán dữ liệu (CẬP NHẬT)
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const ordersToday = orders.filter(
      (order) => new Date(order.date).toDateString() === today
    );

    // Tính doanh thu gốc (USD)
    const salesThisMonthUSD = orders
      .filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Xử lý chuyển đổi
    let displaySales = salesThisMonthUSD;
    if (currency === "VND") {
      displaySales = salesThisMonthUSD * MOCK_USD_TO_VND_RATE;
    }

    return {
      totalOrdersToday: ordersToday.length,
      totalSalesThisMonth: displaySales, // Đây là số đã được convert
      currencyLabel: currency, // Nhãn là 'USD' hoặc 'VND'
    };
  }, [orders, currency]); // *** Thêm 'currency' vào dependency ***

  // 3. Chuẩn bị dữ liệu cho Bar Chart (CẬP NHẬT)
  const barChartData = useMemo(() => {
    const labels = [];
    const salesDataUSD = []; // Dữ liệu gốc USD
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      const isoDateString = date.toDateString();
      labels.push(dateString);

      const salesOnDate = orders
        .filter(o => new Date(o.date).toDateString() === isoDateString)
        .reduce((sum, o) => sum + o.total, 0);
      
      salesDataUSD.push(salesOnDate);
    }

    // Xử lý chuyển đổi cho biểu đồ
    let displayData = salesDataUSD;
    let chartLabel = `Doanh thu (${currency})`;

    if (currency === "VND") {
      displayData = salesDataUSD.map(sale => sale * MOCK_USD_TO_VND_RATE);
    }

    return {
      labels,
      datasets: [
        {
          label: chartLabel, // Nhãn động
          data: displayData,   // Dữ liệu động
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };
  }, [orders, currency]); // *** Thêm 'currency' vào dependency ***

  // 4. Hàm gọi AI (Giữ nguyên)
  const handleGenerateSummary = async () => {
    setIsLoadingAI(true);
    setAiSummary("");
    
    // Gửi dữ liệu gốc (USD) cho AI phân tích
    const baseStats = {
       totalOrdersToday: stats.totalOrdersToday,
       totalSalesThisMonthUSD: stats.totalSalesThisMonth / (currency === 'VND' ? MOCK_USD_TO_VND_RATE : 1),
       totalProducts: products.length,
       sampleProduct: products.length > 0 ? products[0].name : "N/A"
    }

    try {
      const summary = await getDashboardSummary(baseStats);
      setAiSummary(summary); // Cập nhật UI

      // --- MỚI: Lưu vào localStorage ---
      // Tính thời gian hết hạn: nửa đêm hôm nay
      const expiry = new Date().setHours(23, 59, 59, 999); 
      
      const dataToStore = {
        summary: summary,
        expires: expiry
      };
      
      localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(dataToStore));
      // --- KẾT THÚC LƯU ---

    } catch (err) {
      setAiSummary("Lỗi khi tạo tóm tắt: " + err.message);
    }
    setIsLoadingAI(false);
  };

  // Hàm xử lý nhấn nút convert
  const toggleCurrency = () => {
    setCurrency(curr => (curr === "USD" ? "VND" : "USD"));
  };

  const chatContextData = useMemo(() => {
    // Lấy 5 sản phẩm và 5 đơn hàng mới nhất để làm mẫu
    // Gửi TẤT CẢ sản phẩm/đơn hàng có thể làm AI quá tải
    const sampleProducts = products.map(p => ({ 
      id: p.id, 
      name: p.name, 
      price: p.price 
    }));
    
    const sampleOrders = orders.slice(0, 5).map(o => ({ 
      id: o.id, 
      total: o.total, 
      date: o.date, 
      itemCount: o.items ? o.items.length : 0 
    }));

    return {
      storeStatistics: stats, // Gửi các số liệu thống kê (doanh thu, đơn hàng)
      totalProductCount: products.length,
      totalOrderCount: orders.length,
      sampleProducts: sampleProducts,
      sampleOrders: sampleOrders,
    };
  }, [products, orders, stats]);

  return (
    <Container fluid>
      <Row className="my-3">
        {/* CẬP NHẬT DÒNG TIÊU ĐỀ ĐỂ THÊM NÚT */}
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Trang chủ Admin</h2>
            <p>Chào mừng trở lại!</p>
          </div>
          
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Cards */}
      <Row>
        <Col md={6} className="mb-3">
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Đơn hàng hôm nay</Card.Title>
              <Card.Text as="h3">{stats.totalOrdersToday}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Doanh thu tháng này</Card.Title>
            <Card.Text as="div">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                            {stats.totalSalesThisMonth.toLocaleString(
                                currency === "VND" ? "vi-VN" : "en-US"
                            )}
                        </div>
                        <div className="text-white-50" style={{ fontSize: "0.9rem" }}>
                            {stats.currencyLabel}
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={toggleCurrency}
                            className="me-2"
                        >
                            Xem bằng {currency === "USD" ? "VND" : "USD"}
                        </Button>
                        <small className="text-white-50">Tỉ giá giả định: {MOCK_USD_TO_VND_RATE.toLocaleString()}</small>
                    </div>
                </div>
            </Card.Text>
            </Card.Body>
            </Card>
            </Col>
            </Row>
      <Row>
        <Col md={7}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Phân tích nhanh từ Gemini AI</Card.Title>
              <Button onClick={handleGenerateSummary} disabled={isLoadingAI} className="mb-3">
                {isLoadingAI ? <Spinner as="span" animation="border" size="sm" /> : 'Tạo phân tích'}
              </Button>
              
              {/* --- (CẬP NHẬT) --- */}
              {aiSummary && (
                <Alert variant="light">
                  {/* Thay thế <pre> bằng <ReactMarkdown> */}
                  {/* Nó sẽ tự động render các gạch đầu dòng (bullet points) */}
                  <ReactMarkdown>
                    {aiSummary}
                  </ReactMarkdown>
                </Alert>
              )}
              {/* --- (KẾT THÚC CẬP NHẬT) --- */}
              
            </Card.Body>
          </Card>
          
          <Card className="mb-3">
             <Card.Body>
                <Card.Title>Doanh thu 7 ngày qua</Card.Title>
                {/* Biểu đồ này đã tự động cập nhật vì barChartData đã thay đổi */}
                <Bar data={barChartData} options={{ responsive: true }} />
             </Card.Body>
          </Card>
        </Col>
        
        <Col md={5}>
          <AIChat storeContextData={chatContextData} />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;