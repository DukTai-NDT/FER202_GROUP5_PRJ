import axios from "axios";

// API URL for the backend (JSON Server on port 9999)
const API_URL = "http://localhost:9999/users"; // JSON Server endpoint

export const updateUserProfile = async (updatedUserData) => {
  try {
    // Get current user info from localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Ensure the username is not being changed
    if (currentUser.username !== updatedUserData.username) {
      throw new Error("Username cannot be changed.");
    }

    // Prepare updated user data
    const updatedUser = {
      id: currentUser.id.toString(),  // Make sure the id is treated as a string
      ...updatedUserData, // Spread the updated data
    };

    // Send PUT request to update user profile on the backend
    const response = await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);

    if (response.status === 200) {
      // Update localStorage with the new user data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true, message: "Profile updated successfully." };
    } else {
      throw new Error("Failed to update profile.");
    }
  } catch (error) {
    return { success: false, message: error.message || "Profile update failed." };
  }
};


export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// [ADMIN] Tạo user mới
export const adminCreateUser = async (userData) => {
  try {
    // Gán các giá trị mặc định cho user mới
    const newUser = {
      ...userData,
      id: Date.now().toString(), // Tạo ID tạm thời
      role: userData.role || 'user',
      status: 'active'
      // Bạn nên yêu cầu admin đặt mật khẩu ở đây
      // password: "defaultPassword123" 
    };
    const response = await axios.post(API_URL, newUser);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// [ADMIN] Cập nhật user bất kỳ (thay đổi cả role, status)
export const adminUpdateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// [ADMIN] Xóa một user
export const adminDeleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: error.message };
  }
};