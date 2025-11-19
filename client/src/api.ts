import axios from "axios";

// 🔹 Backend base URL
// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://seotron-backend.onrender.com";

// -------------------------
// Helper: Get Auth Header
// -------------------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  // FIX: Return empty object if no token (prevents "Bearer null" errors)
  if (!token) return {}; 
  return { Authorization: `Bearer ${token}` };
};

// -------------------------
// Handle API errors
// -------------------------
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // If the server returns a 401, force the user to log out and redirect
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
    // Save token immediately
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

// -------------------------
// Onboarding and Analytics APIs
// -------------------------
export const saveOnboardingData = async (onboardingData: any) => {
  try {
    const res = await axios.post(
      `${API_BASE}/users/me/onboard`,
      onboardingData,
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    // Matches 'analytics.router' prefix="/api" in main.py
    const res = await axios.get(`${API_BASE}/api/analytics`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

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

  return es;
};

// -------------------------
// SEO APIs (Fix applied here)
// -------------------------
export const analyzeURL = async (url: string) => {
  try {
    // ✨ FIX: Changed from /api/analyze to /seo/analyze
    // Ensure your main.py has: app.include_router(seo.router, prefix="/seo", ...)
    const res = await axios.post(
      `${API_BASE}/seo/analyze`,
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
      `${API_BASE}/seo/keyword`, // Assumed to be in SEO router
      { keyword },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

// -------------------------
// AI API Call (Gemini)
// -------------------------
export const askAiForReport = async (query: string, context: any) => {
  try {
    // ✨ FIX: Changed path to match seo.py ("/ask_ai") and main.py prefix ("/seo")
    const res = await axios.post(
      `${API_BASE}/seo/ask_ai`, 
      { query, context },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error: any) {
    return {
      error:
        error.response?.data?.detail ||
        "AI Request Failed. Check Server Logs.",
    };
  }
};