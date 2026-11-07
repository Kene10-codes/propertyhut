import axios from "axios";

const API_URL =
  (import.meta as ImportMeta & { env: { VITE_API_URL?: string } }).env
    .VITE_API_URL ?? "http://localhost:3000/api";


import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/tokenManager";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Prevent multiple simultaneous refresh requests
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
          )
          .then((response) => {
            const newToken = response.data.accessToken;

            setAccessToken(newToken);

            return newToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      clearAccessToken();

      window.dispatchEvent(
        new Event("auth:session-expired")
      );

      return Promise.reject(refreshError);
    }
  }
);

export {api};
