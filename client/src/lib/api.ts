import axios from "axios";
import type { LoginFormData, SignupFormData } from "../types/auth";

const API_URL =
  (import.meta as ImportMeta & { env: { VITE_API_URL?: string } }).env
    .VITE_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bk_token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export const signup = (data: SignupFormData) => api.post("/signup", data);

export const login = (data: LoginFormData) => api.post("/login", data);
