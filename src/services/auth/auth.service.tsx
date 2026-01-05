import axios from 'axios';
import axiosInstance from '../../middleware/axiosInstance';

const authService = {
    // 1. Signup Function
    signup: async (userData) => {
        try {
            const response = await axiosInstance.post('main/signup/', userData);
            return response.data;
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. Login Function
    login: async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/auth/token', credentials);
            // Assuming your backend returns { access: "...", refresh: "..." }
            // console.log("xxxx",response.data.user.access);
            if (response.data.user.access) {
                localStorage.setItem('access_token', response.data.user.access);
                localStorage.setItem('refresh_token', response.data.user.refresh);
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
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axiosInstance.post('main/token/refresh/', {
                refresh: refreshToken
            });
            
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
            }
            return response.data.access;
        } catch (error) {
            // If refresh fails, the user must log in again
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            console.error("Session expired. Please login again.");
            throw error;
        }
    },

    // 4. Logout Function
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login page
    }
};

export default authService;