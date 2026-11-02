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


export const signup = (data: SignupData) => api.post("/auth/signup", data);

export const login = (data: LoginData) => api.post("/auth/login", data);
