import axios from 'axios';

const API_URL = 'http://localhost:9999/orders'; // Địa chỉ API orders

// Lấy tất cả các đơn hàng
export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // Trả về danh sách đơn hàng
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


// Xóa đơn hàng
export const deleteOrder = async (orderId) => {
    try {
        // Gửi yêu cầu xóa đơn hàng từ API
        const response = await axios.delete(`${API_URL}/${orderId}`);
        
        if (response.status === 200) {
            return { success: true };  // Nếu xóa thành công
        } else {
            return { success: false, message: "Failed to delete order." };  // Nếu có lỗi
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        return { success: false, message: "Error deleting order." };  // Nếu có lỗi mạng hoặc lỗi API
    }
};
