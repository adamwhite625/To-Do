import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Hàm helper để lấy token từ store (tránh circular import)
const getAccessToken = async () => {
  try {
    // Import động để tránh circular dependency
    const { useAuthStore } = await import("../stores/useAuthStore.js");
    const { accessToken } = useAuthStore.getState();
    return accessToken || null;
  } catch (e) {
    // Nếu store chưa sẵn sàng, trả về null
    return null;
  }
};

// Hàm helper để set token vào store
const setAccessToken = async (token) => {
  try {
    const { useAuthStore } = await import("../stores/useAuthStore.js");
    useAuthStore.getState().setAccessToken(token);
  } catch (e) {
    // Nếu store chưa sẵn sàng, bỏ qua
  }
};

// Hàm helper để clear state
const clearAuthState = async () => {
  try {
    const { useAuthStore } = await import("../stores/useAuthStore.js");
    useAuthStore.getState().clearState();
  } catch (e) {
    // Nếu store chưa sẵn sàng, bỏ qua
  }
};

// 1. Request Interceptor: Gửi Access Token kèm theo mỗi request
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Tự động Refresh Token khi hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có originalRequest, reject luôn
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Nếu lỗi từ endpoint auth, không cần retry
    if (originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Nếu lỗi 403 (Token expired) và chưa retry lần nào
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const refreshResponse = await api.post("/auth/refresh");
        const newAccessToken = refreshResponse.data?.accessToken;

        if (newAccessToken) {
          // Lưu token mới vào store
          setAccessToken(newAccessToken);

          // Update header của request cũ
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Gửi lại request cũ
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh thất bại, clear state và reject
        clearAuthState();
        return Promise.reject(refreshError);
      }
    }
    // Nếu lỗi khác, reject luôn
    return Promise.reject(error);
  }
);

export default api;
