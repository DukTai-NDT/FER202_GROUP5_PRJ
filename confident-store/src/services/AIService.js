// // Lấy dữ liệu tổng hợp từ API cho context AI
// export const fetchStoreContextData = async () => {
//   try {
//     const [productsRes, cartRes, ordersRes] = await Promise.all([
//       axios.get('http://localhost:9999/products'),
//       axios.get('http://localhost:9999/cart'),
//       axios.get('http://localhost:9999/orders'),
//     ]);
//     return {
//       products: productsRes.data,
//       cart: cartRes.data,
//       orders: ordersRes.data,
//     };
//   } catch (error) {
//     console.error('Lỗi khi lấy dữ liệu context cho AI:', error);
//     return { products: [], cart: [], orders: [] };
//   }
// };
// Xoá toàn bộ lịch sử chat
export const clearChatHistory = async () => {
  try {
    // Ghi đè object /chatHistory với mảng rỗng
    await axios.put(`${JSON_SERVER_URL}/chatHistory`, { messages: [] });
  } catch (error) {
    console.error("Lỗi khi xoá lịch sử chat:", error);
  }
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const JSON_SERVER_URL = "http://localhost:9999";
if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set in .env.local file");
  alert("Chưa cấu hình API Key cho Gemini!");
}

// 2. Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * 
 * @param {Array} history - Lịch sử chat (ví dụ: [{ role: "user", parts: [{text: "..."}] }, { role: "model", parts: [{text: "..."}] }])
 * @param {string} message 
 * @returns {Promise<string>} 
 */
export const getChatResponse = async (historyFromComponent, newMessage, storeContextData) => {
  try {
    let chatHistory = historyFromComponent.slice(0, -1);
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory = chatHistory.slice(1);
    }

    // Fetch latest products, cart, orders for context
    let contextData = storeContextData;
    if (!contextData || !contextData.products || !contextData.cart || !contextData.orders) {
      // Only fetch if not already provided
      try {
        const [productsRes, cartRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:9999/products'),
          axios.get('http://localhost:9999/cart'),
          axios.get('http://localhost:9999/orders'),
        ]);
        contextData = {
          products: productsRes.data,
          cart: cartRes.data,
          orders: ordersRes.data,
        };
      } catch (fetchErr) {
        contextData = { products: [], cart: [], orders: [] };
      }
    }

    // Inject current date
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10); // yyyy-mm-dd
    const todayVN = today.toLocaleDateString('vi-VN'); // dd/mm/yyyy

    const contextPrompt = `
      ---
      **BỐI CẢNH (CONTEXT):**
      Bạn là trợ lý AI quản lý của một cửa hàng.
      Hôm nay là ngày: ${todayVN} (ISO: ${todayISO})
      Nhiệm vụ của bạn là trả lời câu hỏi DỰA TRÊN DỮ LIỆU CỬA HÀNG được cung cấp dưới đây.

      **QUY TẮC BẮT BUỘC:**
      1.  **ƯU TIÊN TUYỆT ĐỐI** dữ liệu được cung cấp.
      2.  Nếu câu hỏi có thể được trả lời bằng dữ liệu, hãy trích xuất và trả lời.
      3.  Nếu câu hỏi không thể trả lời bằng dữ liệu này (ví dụ: "Thủ đô của Pháp là gì?" hoặc hỏi về sản phẩm không có trong danh sách), hãy trả lời: "Tôi không tìm thấy thông tin này trong dữ liệu cửa hàng."
      4.  Không bịa đặt thông tin.

      **DỮ LIỆU CỬA HÀNG HIỆN TẠI:**
      \`\`\`json
      ${JSON.stringify(contextData, null, 2)}
      \`\`\`
      ---
    `;

    // 2. Gộp chỉ thị, bối cảnh và câu hỏi của người dùng
    // Bằng cách này, AI sẽ đọc chỉ thị và dữ liệu *ngay trước khi* đọc câu hỏi
    const messageWithContext = `
      ${contextPrompt}

      **CÂU HỎI CỦA NGƯỜI DÙNG:**
      ${newMessage}
    `;

    // 3. Gửi tin nhắn đã gộp
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(messageWithContext);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Lỗi khi gọi API chat:", error);
    // Thêm log chi tiết để debug nếu vẫn lỗi
    // console.error("Lịch sử đã gửi (sau khi sửa):", chatHistory); // chatHistory có thể không tồn tại nếu lỗi sớm
    console.error("Tin nhắn mới:", newMessage);
    return "Đã xảy ra lỗi, không thể kết nối với AI. (Chi tiết trong console)";
  }
};

/**
 * Gửi dữ liệu dashboard để nhận tổng hợp
 * @param {Object} dashboardData - Dữ liệu dashboard
 * @returns {Promise<string>} - Tóm tắt từ AI
 */
export const getDashboardSummary = async (dashboardData) => {
  const prompt = `
    Bạn là một trợ lý admin cho một website bán hàng.
    Dưới đây là dữ liệu kinh doanh:
    ${JSON.stringify(dashboardData)}

    Hãy cung cấp một bản phân tích ngắn gọn (khoảng 3-5 gạch đầu dòng) về:
    1. Tình hình kinh doanh chung (dựa trên doanh số tháng và đơn hàng hôm nay).
    2. Chỉ ra sản phẩm bán chạy nhất.
    3. Đưa ra một gợi ý hành động cụ thể (ví dụ: "Nên đẩy mạnh marketing cho sản phẩm X" hoặc "Hàng Y sắp hết, cần nhập thêm").
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Lỗi khi gọi API summarize:", error);
    return "Không thể tạo tổng hợp AI.";
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/chatHistory`);
    // Trả về mảng messages bên trong
    return response.data.messages || []; 
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử chat:", error);
    // Trả về một tin nhắn mặc định nếu lỗi
    return [{ role: "model", parts: "Không thể tải lịch sử chat." }];
  }
};

export const saveChatHistory = async (messages) => {
  try {
    // Ghi đè toàn bộ object /chatHistory bằng dữ liệu mới
    await axios.put(`${JSON_SERVER_URL}/chatHistory`, { messages: messages });
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử chat:", error);
  }
};