import axios from "axios";

const API_URL = "http://localhost:9999/products";
const MAX_PRODUCTS = 6; // Max items to fetch
const ITEMS_PER_PAGE = 6; // Number of items per page

export const getProducts = async (page = 1) => {
  try {
    const response = await axios.get(
      `${API_URL}?_page=${page}&_limit=${ITEMS_PER_PAGE}`
    );

    // Check if API response is an array
    if (!Array.isArray(response.data)) {
      console.error("Invalid API response:", response.data);
      return [];
    }

    return response.data.map(({ name, price, images }) => ({
      name,
      price,
      image: images?.main || "", // Ensure images.main exists
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data; // Return the newly created product
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product by ID
export const updateProduct = async (id, updatedProductData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedProductData);
    return response.data; // Return the updated product
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product." };
  }
};
