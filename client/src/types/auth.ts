export type Role = "user" | "agent" | "admin";


export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role?: Role;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
