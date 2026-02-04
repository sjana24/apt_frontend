import axiosInstance from "../middleware/axiosInstance";
import { storage } from "../utils/storage";

const userService = {
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      console.log("Sending password change request...");
      const response = await axiosInstance.post("auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      console.log("Password change response:", response.data);

      // Update tokens if returned (to keep user logged in with new password)
      if (response.data.access && response.data.refresh) {
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        storage.setItem("access_token", response.data.access, rememberMe);
        storage.setItem("refresh_token", response.data.refresh, rememberMe);
        console.log("Tokens updated successfully");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error changing password:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      throw error;
    }
  },
};

export default userService;
