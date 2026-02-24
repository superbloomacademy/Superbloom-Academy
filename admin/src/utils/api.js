import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalConfig.headers["Authorization"] = `Bearer ${token}`;
          return api(originalConfig);
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const res = await api.get("/auth/refresh");
        const accessToken = res.data.accessToken;

        // update default header
        api.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        originalConfig.headers["Authorization"] =
          `Bearer ${accessToken}`;

        return api(originalConfig);
      } catch (e) {
        processQueue(e, null);

        localStorage.removeItem("sb_token");
        localStorage.removeItem("sb_user");

        delete api.defaults.headers.common["Authorization"];

        window.location.href = "/login";

        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
