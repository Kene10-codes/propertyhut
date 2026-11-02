export type Role = "user" | "agent" | "admin";


export interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: Role;
  isLoading: boolean;
  password: string;
  error: {
    email: string;
    password: string;
  }
}

export interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: {
    email: string;
    password: string;
  }
}

export type LoginAction = 
|{ type: "SET_EMAIL", payload: string }
|{ type: "SET_PASSWORD", payload: string }
|{ type: "LOGIN_START"}
|{ type: "LOGIN_SUCCESS", payload: {
    email: string,
    password: string
} }
|{ type: "LOGIN_ERROR", payload: {
  field: "email" | "password" | undefined,
  message: string
} }
|{ type: "FORM_RESET"}