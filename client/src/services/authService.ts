import { api } from "../lib/api";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: "user" | "agent" | "admin";
  password: string;
}

interface ApiResponse {
  message: string;
  code?: string;
}

interface ApiResponse {
  message: string;
}

export const signupApi = async (data: SignupData) =>
  await api.post("/auth/signup", data);

export const loginApi = async (data: LoginData) =>
  await api.post("/auth/login", data);

export const verifyEmailApi = async (token: string): Promise<ApiResponse> => {
  const response = await api.post(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationEmailApi = async (
  email: string,
): Promise<ApiResponse> => {
  const response = await api.post("/auth/resend-verification", email);
  return response.data;
};


export const forgotPasswordApi = async (
  email: string,
): Promise<ApiResponse> => {
  const response = await api.post("/auth/forgot-password", { email });

  return response.data;
};

export const resetPasswordApi = async (
  token: string,
  password: string,
): Promise<ApiResponse> => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });

  return response.data;
};
