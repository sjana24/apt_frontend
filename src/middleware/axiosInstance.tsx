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
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// The Response Interceptor (The "Magic")
axiosInstance.interceptors.response.use(
  (response) => response, // If request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried refreshing yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refresh_token');

        // Call Django to get a new access token
        const res = await axios.post('http://localhost:8000/auth/refresh', {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          sessionStorage.setItem('access_token', res.data.access);
          //   sessionStorage.setItem('refresh_token', res.data.refresh);

          // Update the failed request header and retry it
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is also expired, log the user out
        sessionStorage.clear();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;