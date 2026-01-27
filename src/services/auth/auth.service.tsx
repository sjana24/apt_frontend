import axios from "axios";
import axiosInstance from "../../middleware/axiosInstance";
import { storage } from "../../utils/storage";

const authService = {
  // 1. Signup Function
  signup: async (userData) => {
    try {
      const response = await axiosInstance.post("auth/signup", userData);
      return response.data;
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 2. Login Function
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await axiosInstance.post("auth/token", credentials);
      // Assuming your backend returns { access: "...", refresh: "..." }
      console.log("xxxx", response.data.user.user.full_name);
      if (response.data.user.access) {
        storage.setItem("userId", response.data.user.user.id, rememberMe);
        storage.setItem(
          "fullname",
          response.data.user.user.full_name,
          rememberMe,
        );
        storage.setItem("access_token", response.data.user.access, rememberMe);
        storage.setItem(
          "refresh_token",
          response.data.user.refresh,
          rememberMe,
        );
      }
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 3. Refresh Token Function
  refreshToken: async () => {
    try {
      const refreshToken = storage.getItem("refresh_token");
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      const response = await axiosInstance.post("main/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.data.access) {
        storage.setItem("access_token", response.data.access, rememberMe);
      }
      return response.data.access;
    } catch (error) {
      // If refresh fails, the user must log in again
      storage.clear();
      console.error("Session expired. Please login again.");
      throw error;
    }
  },

  // 4. Logout Function
  logout: () => {
    storage.clear();
    // window.location.href = '/'; // Redirect to login page
  },

  // 5. Forgot Password Function (Request OTP)
  forgotPassword: async (email: string) => {
    try {
      const response = await axiosInstance.post("auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // 6. Verify OTP Function
  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await axiosInstance.post("auth/verify-otp", {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error("Verify OTP Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 7. Reset Password Function (with OTP)
  resetPassword: async (email: string, otp: string, new_password: string) => {
    try {
      const response = await axiosInstance.post("auth/reset-password", {
        email,
        otp,
        new_password,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default authService;
