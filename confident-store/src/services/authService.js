import axios from "axios";

const API_URL = "http://localhost:9999/users";

// 📌 Đăng ký tài khoản mới
export const register = async (username, password, fullName, address, phone, email) => {
    try {
      // Check if username already exists
      const { data: existingUsers } = await axios.get(API_URL, { params: { username } });
      if (existingUsers.length > 0) {
        return { success: false, message: "Username already exists!" };
      }
  
      // Generate a new user ID as a string (using Date.now())
      const newUser = {
        id: Date.now().toString(), // Generate ID as a string
        username,
        password,
        fullName,
        address,
        phone,
        email,
        role: "user", // Default role
      };
  
      // Send POST request to create a new user
      const response = await axios.post(API_URL, newUser);
  
      if (response.status === 201) {
        return { success: true, message: "Registration successful!" };
      } else {
        throw new Error("Failed to register user.");
      }
    } catch (error) {
      return { success: false, message: error.message || "Registration failed!" };
    }
  };

// 📌 Đăng nhập tài khoản
export const login = async (username, password) => {
  try {
    const { data: users } = await axios.get(API_URL, {
      params: { username, password },
    });
    if (users.length === 0) {
      return { success: false, message: "Invalid username or password!" };
    }

    const user = users[0];
    if (user.status === "locked") {
      return { success: false, message: "Your account is locked. Please contact admin." };
    }
    
    localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
    return { success: true, user };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Login failed!" };
  }
};

// 📌 Lấy thông tin user đang đăng nhập
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// 📌 Đăng xuất
export const logout = () => {
  localStorage.removeItem("user");
};
