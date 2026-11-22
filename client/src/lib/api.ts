import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/tokenManager";

const clientEnv = (
  import.meta as ImportMeta & {
    env: {
      DEV?: boolean;
      VITE_LOCAL_API_URL?: string;
      VITE_PRODUCTION_API_URL?: string;
    };
  }
).env;

const normalizeApiUrl = (url: string) => url.replace(/\/+$/, "");
const localApiUrl = normalizeApiUrl(
  clientEnv.VITE_LOCAL_API_URL ?? "http://localhost:3100/api",
);
const productionApiUrl = normalizeApiUrl(
  clientEnv.VITE_PRODUCTION_API_URL ??
    "https://propertyhut.onrender.com/api",
);

const apiBaseUrlPromise = (async () => {
  if (!clientEnv.DEV) {
    return productionApiUrl;
  }

  try {
    await axios.get(`${localApiUrl}/health`, { timeout: 2000 });
    console.info("Using local API:", localApiUrl);
    return localApiUrl;
  } catch {
    console.info("Local API unavailable; using production API:", productionApiUrl);
    return productionApiUrl;
  }
})();

const api = axios.create({
  baseURL: localApiUrl,
  withCredentials: true,
});

// Attach access token to requests
api.interceptors.request.use(async (config) => {
  config.baseURL = await apiBaseUrlPromise;

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
        refreshPromise = apiBaseUrlPromise
          .then((baseURL) =>
            axios.post(
              `${baseURL}/auth/refresh`,
              {},
              { withCredentials: true },
            ),
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
