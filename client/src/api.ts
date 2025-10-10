// client/src/api.ts
import axios from "axios";

// 🔹 Backend base URL
const API_BASE = "http://127.0.0.1:8000";

// -------------------------
// Helper: Get Auth Header
// -------------------------
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// -------------------------
// Helper: Handle API errors
// -------------------------
const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("token"); // Optional: clear expired token
            window.location.href = "/login";  // Redirect to login page
        }
    }
    console.error("API Error:", error);
    throw error;
};

// -------------------------
// User APIs
// -------------------------

export const signupUser = async (data: { username: string; email: string; password: string }) => {
    try {
        const res = await axios.post(`${API_BASE}/users/signup`, data);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const loginUser = async (data: { email: string; password: string }) => {
    try {
        const res = await axios.post(`${API_BASE}/users/login`, data);
        localStorage.setItem("token", res.data.access_token);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const res = await axios.get(`${API_BASE}/users/me`, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${API_BASE}/users/all`, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUser = async (id: string, data: any) => {
    try {
        const res = await axios.put(`${API_BASE}/users/${id}`, data, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteUser = async (id: string) => {
    try {
        const res = await axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

// -------------------------
// SEO APIs
// -------------------------

export const analyzeURL = async (url: string) => {
    try {
        const res = await axios.post(`${API_BASE}/api/analyze`, { url }, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const analyzeKeyword = async (keyword: string) => {
    try {
        const res = await axios.post(`${API_BASE}/api/keyword`, { keyword }, { headers: getAuthHeader() });
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};
