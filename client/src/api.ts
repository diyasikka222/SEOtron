// client/src/api.ts
import axios from "axios";

// 🔹 Backend base URL
const API_BASE = "http://127.0.0.1:8000"; // Change if backend is on a different port

// -------------------------
// Helper: Get Auth Header
// -------------------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// -------------------------
// User APIs
// -------------------------

// Signup
export const signupUser = async (data: { username: string; email: string; password: string }) => {
  const res = await axios.post(`${API_BASE}/users/signup`, data);
  return res.data;
};

// Login
export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_BASE}/users/login`, data);
  // Save token in localStorage
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE}/users/me`, { headers: getAuthHeader() });
  return res.data;
};

// Get all users (admin or protected)
export const getAllUsers = async () => {
  const res = await axios.get(`${API_BASE}/users/all`, { headers: getAuthHeader() });
  return res.data;
};

// Update user
export const updateUser = async (id: string, data: any) => {
  const res = await axios.put(`${API_BASE}/users/${id}`, data, { headers: getAuthHeader() });
  return res.data;
};

// Delete user
export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeader() });
  return res.data;
};

// -------------------------
// SEO APIs
// -------------------------

// Analyze website URL
export const analyzeURL = async (url: string) => {
  try {
    const res = await axios.post(`${API_BASE}/api/analyze`, { url });
    return res.data;
  } catch (error) {
    console.error("Error in analyzeURL:", error);
    throw error;
  }
};

// Analyze keyword
export const analyzeKeyword = async (keyword: string) => {
  try {
    const res = await axios.post(`${API_BASE}/api/keyword`, { keyword });
    return res.data;
  } catch (error) {
    console.error("Error in analyzeKeyword:", error);
    throw error;
  }
};
