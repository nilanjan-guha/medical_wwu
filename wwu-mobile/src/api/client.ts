import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const auth = useAuthStore.getState();
    if (!auth.refreshToken) {
      await auth.logout();
      return Promise.reject(error);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: auth.refreshToken
      });

      useAuthStore.setState({ accessToken: res.data.accessToken });
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      await auth.logout();
      return Promise.reject(refreshError);
    }
  }
);
