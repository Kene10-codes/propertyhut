import { LoginAction, LoginState, SignupAction, SignupState } from "../types";

export const initialState: LoginState = {
  email: "",
  password: "",
  isLoading: false,
  error: {
    email: "",
    password: "",
  },
};

export function loginReducer(state: LoginState, action: LoginAction) {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
        error: {
          ...state.error,
          email: "",
        },
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        error: {
          ...state.error,
          password: "",
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
            (action.payload.field as string) === "email"
              ? action.payload.message
              : state.error.email,
          password:
            (action.payload.field as string) === "password"
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


// Signup state
export const signupInitialState: SignupState = {
  firstName: "",
  lastName: "",
  phone: "",
  role: "user",
  email: "",
  password: "",
  isLoading: false,
  error: {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
  },
};

//Define signup reducer
export function signupReducer(state: SignupState, action: SignupAction) {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return {
        ...state,
        firstName: action.payload,
        error: {
          ...state.error,
          firstName: "",
        },
      };

    case "SET_LAST_NAME":
      return {
        ...state,
        lastName: action.payload,
        error: {
          ...state.error,
          lastName: "",
        },
      };

    case "SET_PHONE":
      return {
        ...state,
        phone: action.payload,
        error: {
          ...state.error,
          phone: "",
        },
      };

    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
        error: {
          ...state.error,
          email: "",
        },
      };

    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        error: {
          ...state.error,
          password: "",
        },
      };

    case "SET_ROLE":
      return {
        ...state,
        role: action.payload,
        error: {
          ...state.error,
          role: "",
        },
      };

    case "SIGNUP_START":
      return { ...state, isLoading: true };

    case "SIGNUP_SUCCESS":
      return { ...signupInitialState };

    case "SIGNUP_ERROR":
      return {
        ...state,
        isLoading: false,
        error: {
          ...state.error,
          email:
            (action.payload.field as string) === "email"
              ? action.payload.message
              : state.error.email,
          password:
            (action.payload.field as string) === "password"
              ? action.payload.message
              : state.error.password,
            phone: 
              (action.payload.field as string) === "phone"
              ? action.payload.message
              : (state.error as SignupState["error"] & { phone?: string }).phone ?? "",
            firstName: 
              (action.payload.field as string) === "firstName"
              ? action.payload.message
              : (state.error as SignupState["error"] & { firstName?: string }).firstName ?? "",  
            lastName: 
              (action.payload.field as string) === "lastName"
              ? action.payload.message
              : (state.error as SignupState["error"] & { lastName?: string }).lastName ?? "",  
            role:
              (action.payload.field as string) === "role"
              ? action.payload.message
              : (state.error as SignupState["error"] & { role?: string }).role ?? "",
        },
      };

    case "FORM_RESET":
      return signupInitialState;

    default:
      const _exhaustiveCheck: never = action;
      return state;
  }
}
