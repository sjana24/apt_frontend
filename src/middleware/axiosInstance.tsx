import axios from 'axios';

// Create the instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Your Django/Spring URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Optional: Add a request interceptor to attach tokens automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;