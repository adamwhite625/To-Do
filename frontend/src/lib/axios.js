import axios from "axios";
// Chúng ta sẽ import store sau khi tạo xong file store để tránh vòng lặp import
// Cách giải quyết: Import store trực tiếp bên trong interceptor

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Quan trọng: Cho phép gửi cookie
});

// 1. Gửi Access Token kèm theo mỗi request
api.interceptors.request.use((config) => {
  // Lấy token từ Zustand store (sẽ tạo ở bước sau)
  const { accessToken } =
    require("../stores/useAuthStore").useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 2. Tự động Refresh Token khi hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // Bỏ qua nếu lỗi từ chính API auth
    if (originalRequest.url.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Nếu lỗi 403 (Forbidden) và chưa thử lại lần nào
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API lấy token mới
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // Lưu vào Store
        require("../stores/useAuthStore")
          .useAuthStore.getState()
          .setAccessToken(newAccessToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi -> Đăng xuất
        require("../stores/useAuthStore").useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
