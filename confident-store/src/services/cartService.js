import axios from "axios";

const CART_API_URL = "http://localhost:9999/cart";
const ORDER_API_URL = "http://localhost:9999/orders";

export const getCart = async () => {
  try {
    const response = await axios.get(CART_API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const addToCart = async (cartItem) => {
  try {
    const cartResponse = await axios.get(CART_API_URL);
    const existingItem = cartResponse.data.find(
      (item) =>
        item.productId === cartItem.productId &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingItem) {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      await axios.put(`${CART_API_URL}/${existingItem.id}`, updatedItem);
      return updatedItem;
    } else {
      const response = await axios.post(CART_API_URL, cartItem);
      return response.data;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};

export const updateCartItem = async (id, newQuantity) => {
  try {
    const response = await axios.patch(`${CART_API_URL}/${id}`, { quantity: newQuantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
};

export const removeCartItem = async (id) => {
  try {
    await axios.delete(`${CART_API_URL}/${id}`);
  } catch (error) {
    console.error("Error removing cart item:", error);
  }
};

// 📌 Function Check Out - Chuyển toàn bộ giỏ hàng thành đơn hàng
export const checkout = async () => {
  try {
    // Lấy giỏ hàng
    const cartItems = await getCart();
    if (cartItems.length === 0) return { success: false, message: "Your cart is empty!" };

    // Tạo đơn hàng
    const order = {
      id: Date.now(), // Tạo ID tự động
      items: cartItems,
      total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: "Pending", // Trạng thái mặc định
    };

    await axios.post(ORDER_API_URL, order);

    // Xóa giỏ hàng sau khi thanh toán thành công
    await Promise.all(cartItems.map((item) => axios.delete(`${CART_API_URL}/${item.id}`)));

    return { success: true, message: "Checkout successful!", order };
  } catch (error) {
    console.error("Error during checkout:", error);
    return { success: false, message: "Checkout failed. Please try again!" };
  }
};

export const clearCart = async () => {
    try {
      const cartItems = await getCart();
      await Promise.all(cartItems.map((item) => axios.delete(`${CART_API_URL}/${item.id}`)));
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  
export const placeOrder = async (orderData) => {
    try {
      const response = await axios.post(ORDER_API_URL, orderData);
      await clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      return null;
    }
  };