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
// Handle API errors
// -------------------------
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
  console.error("API Error:", error);
  throw error;
};

// -------------------------
// User APIs
// -------------------------
export const signupUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
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
    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ✨ --- NEW FUNCTION --- ✨
// This function sends the onboarding data to the backend.
// We assume a POST endpoint at /users/me/onboard
// -------------------------
export const saveOnboardingData = async (onboardingData: any) => {
  try {
    const res = await axios.post(
      `${API_BASE}/users/me/onboard`,
      onboardingData,
      { headers: getAuthHeader() },
    );
    return res.data; // Returns success message or updated user
  } catch (error) {
    handleApiError(error);
  }
};

// -------------------------
// Analytics APIs
// -------------------------
export const getAnalytics = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/analytics`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

// -------------------------
// SSE subscription
// -------------------------
export const subscribeToEvents = (
  onMessage: (data: any) => void,
  onError?: (err: any) => void,
) => {
  const es = new EventSource(`${API_BASE}/api/events`);

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Invalid SSE data", err);
    }
  };

  es.onerror = (err) => {
    console.warn("SSE connection error", err);
    if (onError) onError(err);
    es.close();
  };

  return es; // return so the component can close it on unmount
};

// SEO APIs
export const analyzeURL = async (url: string) => {
  try {
    const res = await axios.post(
      `${API_BASE}/api/analyze`,
      { url },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const analyzeKeyword = async (keyword: string) => {
  try {
    const res = await axios.post(
      `${API_BASE}/api/keyword`,
      { keyword },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};
