import axios from "axios";
import { storage } from "../utils/storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create the instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Optional: Add a request interceptor to attach tokens automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// The Response Interceptor (The "Magic")
axiosInstance.interceptors.response.use(
  (response) => response, // If request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getItem("refresh_token");
        const rememberMe = localStorage.getItem("rememberMe") === "true";

        // Call Django to get a new access token
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          storage.setItem("access_token", res.data.access, rememberMe);
          //   sessionStorage.setItem('refresh_token', res.data.refresh);

          // Update the failed request header and retry it
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is also expired, log the user out
        storage.clear();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
