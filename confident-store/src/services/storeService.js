import axios from "axios";

const API_URL = "http://localhost:9999/products"; // Đổi thành API thật nếu có

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
