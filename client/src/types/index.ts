export type Role = "user" | "agent" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  lastName: string;
  firstName: string;
  phone: string;
  role: Role;
}

export interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  isLoading: boolean;
  password: string;
  error: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  };
}

export interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: {
    email: string;
    password: string;
    general: string;
  };
}

export type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS" }
  | {
      type: "LOGIN_ERROR";
      payload: {
        field: "email" | "password" | "general" | undefined;
        message: string;
      };
    }
  | { type: "FORM_RESET" };

export type SignupAction =
  | { type: "SET_FIRST_NAME"; payload: string }
  | { type: "SET_LAST_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SIGNUP_START" }
  | {
      type: "SIGNUP_SUCCESS";
      payload: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: Role;
      };
    }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_ROLE"; payload: Role }
  | {
      type: "SIGNUP_ERROR";
      payload: {
        field: "email" | "password" | "role" | "phone" | "firstName" | "lastName" | undefined;
        message: string;
      };
    }
  | { type: "FORM_RESET" };
