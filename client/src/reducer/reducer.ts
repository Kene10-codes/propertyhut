import { LoginAction, LoginState, SignupState } from "../types";

export const initialState: LoginState = {
  email: "",
  password: "",
  isLoading: false,
  error: {
     email: "",
     password: ""
  }
};

export function loginReducer(state: LoginState, action: LoginAction) {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
        error: {
            ...state.error,
            email: ""
        },
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        error: {
            ...state.error,
            password: ""
        },
      };
    case "LOGIN_START":
      return { ...state, isLoading: true };

    case "LOGIN_SUCCESS":
      return { ...initialState };

    case "LOGIN_ERROR":
      return {
        ...state,
        isLoading: false,
        error: {
          ...state.error,
          email:
            action.payload.field === "email"
              ? action.payload.message
              : state.error.email,
          password:
            action.payload.field === "password"
              ? action.payload.message
              : state.error.password,
        },
      };

    case "FORM_RESET":
      return initialState;

    default:
      const _exhaustiveCheck: never = action;
      return state;
  }
}

// Signup reducer
const signupInitialState: SignupState = {
  firstName: "",
  lastName: "",
  phone: "",
  role: "user" as "user" | "agent" | "admin",
  email: "",
  password: "",
  isLoading: false,
  error: {
     email: "",
     password: ""
  }
}
