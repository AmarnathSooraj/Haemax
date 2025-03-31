import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth"; // ✅ Supports env variable for deployment

// ✅ Get Token from localStorage (Reusable Function)
const getToken = () => localStorage.getItem("token");

// ✅ Signup Function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    return error.response?.data || { error: "Something went wrong" };
  }
};

// ✅ Login Function
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // ✅ Store token on login
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return error.response?.data || { error: "Invalid credentials" };
  }
};

// ✅ Logout Function
export const logout = () => {
  localStorage.removeItem("token"); // ✅ Clear token on logout
};

// ✅ Fetch Protected Data with Auth Header
export const fetchProtectedData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/protected`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Protected Route Error:", error.response?.data || error.message);
    return error.response?.data || { error: "Unauthorized" };
  }
};
