// axiosInstance.js
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_SERVER = 'http://localhost:5000/mobile'; // Thay thế bằng URL API của bạn

const axiosInstance = axios.create({
  baseURL: API_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: Gắn Access Token vào header Authorization
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const accessToken = credentials.password;
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error accessing Keychain:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Làm mới Access Token khi gặp lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) {
          throw new Error('No refresh token stored');
        }

        const refreshToken = credentials.username; // Giả sử bạn lưu refreshToken trong username

        const response = await axios.post(`${API_SERVER}/token`, {
          refreshToken,
        });

        const { accessToken, newRefreshToken } = response.data;

        // Lưu Access Token và Refresh Token mới
        await Keychain.setGenericPassword(newRefreshToken, accessToken);

        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Error refreshing token:', err);
        // Xử lý khi làm mới token thất bại (ví dụ: điều hướng đến trang đăng nhập)
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
