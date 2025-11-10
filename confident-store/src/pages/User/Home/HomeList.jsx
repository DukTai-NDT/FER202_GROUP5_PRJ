import React, { useState } from 'react';

// --- BỘ ICON SVG CHO ĐẸP (Thêm nhiều dòng) ---
// Icon cho Menu
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
// Icon cho Search
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
// Icon cho 'Xem thêm'
const IconMore = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

// --- DỮ LIỆU MẪU (Fake data) ---
const fakeProducts = [
  {
    id: 1,
    name: "Áo thun cao cấp",
    category: "Thời trang Nam",
    price: "350,000đ",
    imageUrl: `https://placehold.co/400x400/3498db/ffffff?text=Ao+Thun`,
    inStock: true,
  },
  {
    id: 2,
    name: "Quần Jeans Skinny",
    category: "Thời trang Nữ",
    price: "550,000đ",
    imageUrl: `https://placehold.co/400x400/e74c3c/ffffff?text=Quan+Jeans`,
    inStock: true,
  },
  {
    id: 3,
    name: "Giày Sneaker Trắng",
    category: "Giày dép",
    price: "1,200,000đ",
    imageUrl: `https://placehold.co/400x400/2ecc71/ffffff?text=Giay`,
    inStock: false,
  },
  {
    id: 4,
    name: "Đồng hồ thông minh",
    category: "Phụ kiện",
    price: "4,500,000đ",
    imageUrl: `https://placehold.co/400x400/f39c12/ffffff?text=Dong+Ho`,
    inStock: true,
  },
  {
    id: 5,
    name: "Tai nghe Bluetooth",
    category: "Công nghệ",
    price: "1,800,000đ",
    imageUrl: `https://placehold.co/400x400/9b59b6/ffffff?text=Tai+Nghe`,
    inStock: true,
  },
  {
    id: 6,
    name: "Balo Du lịch",
    category: "Phụ kiện",
    price: "850,000đ",
    imageUrl: `https://placehold.co/400x400/1abc9c/ffffff?text=Balo`,
    inStock: true,
  },
];

// --- COMPONENT CHÍNH: TRANG DASHBOARD ĐẸP ---
function HomeList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={styles.appContainer}>
      
      {/* --- 1. SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI) --- */}
      <div style={{ ...styles.sidebar, width: sidebarOpen ? '240px' : '0px' }}>
        <h2 style={styles.sidebarTitle}>CONFIDENT</h2>
        <nav>
          <a href="#" style={styles.sidebarLink}>Dashboard</a>
          <a href="#" style={styles.sidebarLink}>Sản phẩm</a>
          <a href="#" style={styles.sidebarLink}>Đơn hàng</a>
          <a href="#" style={styles.sidebarLink}>Khách hàng</a>
          <a href="#" style={styles.sidebarLink}>Phân tích</a>
          <a href="#" style={styles.sidebarLink}>Cài đặt</a>
        </nav>
      </div>

      {/* --- 2. NỘI DUNG CHÍNH (BÊN PHẢI) --- */}
      <div style={styles.mainContent}>
        
        {/* --- HEADER (THANH TÌM KIẾM VÀ USER) --- */}
        <header style={styles.header}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={styles.menuButton}
          >
            <IconMenu />
          </button>
          <div style={styles.searchBar}>
            <IconSearch />
            <input type="text" placeholder="Tìm kiếm sản phẩm..." style={styles.searchInput} />
          </div>
          <div style={styles.userProfile}>
            <img 
              src="https://placehold.co/40x40/ecf0f1/34495e?text=User" 
              alt="User" 
              style={{ width: 40, height: 40, borderRadius: '50%' }} 
            />
          </div>
        </header>

        {/* --- TIÊU ĐỀ TRANG --- */}
        <div style={styles.pageHeader}>
          <h1>Danh sách Sản phẩm</h1>
          <button style={styles.primaryButton}>+ Thêm Sản phẩm</button>
        </div>

        {/* --- LƯỚI SẢN PHẨM (PRODUCT GRID) --- */}
        <div style={styles.productGrid}>
          {fakeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      </div>
    </div>
  );
}

// --- COMPONENT PHỤ: THẺ SẢN PHẨM (PRODUCT CARD) ---
function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        style={styles.cardImage} 
      />
      <div style={styles.cardContent}>
        <span style={styles.cardCategory}>{product.category}</span>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <div style={styles.cardFooter}>
          <span style={styles.cardPrice}>{product.price}</span>
          {product.inStock ? (
            <span style={styles.stockIn}>Còn hàng</span>
          ) : (
            <span style={styles.stockOut}>Hết hàng</span>
          )}
        </div>
      </div>
      <button style={styles.cardMenuButton}>
        <IconMore />
      </button>
    </div>
  );
}

// --- STYLES (HÀNG TRĂM DÒNG CSS-IN-JS ĐỂ FAKE) ---
const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Màu nền xám nhạt
    fontFamily: "'Inter', sans-serif", // Font đẹp
  },
  // 1. Sidebar Styles
  sidebar: {
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3498db', // Màu thương hiệu
    padding: '20px',
    textAlign: 'center',
    letterSpacing: '1px',
    borderBottom: '1px solid #eee',
  },
  sidebarLink: {
    display: 'block',
    padding: '15px 20px',
    color: '#555',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  // 2. Main Content Styles
  mainContent: {
    flex: 1,
    padding: '25px',
    overflowY: 'auto',
  },
  // 3. Header Styles
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '15px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '25px',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#555',
  },
  searchBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '8px 12px',
    marginLeft: '20px',
    marginRight: '20px',
    color: '#888',
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    flex: 1,
    marginLeft: '10px',
    fontSize: '15px',
  },
  userProfile: {
    // styles cho user
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  // 4. Product Grid Styles
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
  },
  // 5. Product Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '20px',
  },
  cardCategory: {
    fontSize: '12px',
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '5px 0 15px 0',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3498db',
  },
  stockIn: {
    color: '#2ecc71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  stockOut: {
    color: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardMenuButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '50%',
    padding: '5px',
    cursor: 'pointer',
    color: '#555',
  },
};

export default HomeList;