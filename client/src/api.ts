import axios from "axios";

// 🔹 Backend base URL
const API_BASE = "http://127.0.0.1:8000";
// const API_BASE = "https://seotron-backend.onrender.com";

// -------------------------
// Helper: Get Auth Header
// -------------------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  // CRITICAL: Must return Authorization header if token exists
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
// User APIs (Unchanged)
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

// -------------------------
// Onboarding and Analytics APIs (Unchanged)
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
// SEO APIs (Unchanged)
// -------------------------
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

// -------------------------
// ✨ UPDATED AI API CALL (GEMINI)
// -------------------------
export const askAiForReport = async (query: string, context: any) => {
  try {
    // NOTE: Changed endpoint to /api/ask_ai
    const res = await axios.post(
      `${API_BASE}/api/ask_ai`,
      { query, context },
      // CRITICAL: We assume the backend handles authentication internally.
      // We pass the header for premium users, but the backend must tolerate anonymous calls.
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error: any) {
    // Return error structure for the frontend modal to display
    return {
      error:
        error.response?.data?.detail ||
        "AI Request Failed (Network Error). Check Server Logs.",
    };
  }
};
