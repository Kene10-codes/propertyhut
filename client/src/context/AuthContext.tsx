import {
    createContext,
    ReactNode,
    Dispatch,
    useReducer,
    useState,
    useEffect,
} from "react";
import type {
    LoginAction,
    LoginState,
    SignupAction,
    SignupState,
    User,
} from "../types";
import {
    initialState,
    loginReducer,
    signupInitialState,
    signupReducer,
} from "../reducer/reducer";
import { api } from "../lib/api";
import { clearAccessToken, setAccessToken } from "../utils/tokenManager";
import { login } from "../services/authService";

// Define the Context Type
export interface AuthContextType {
    state: LoginState;
    dispatch: Dispatch<LoginAction>;
    signupState: SignupState;
    signupDispatch: Dispatch<SignupAction>;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Createthe Conext
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const [signupState, signupDispatch] = useReducer(
        signupReducer,
        signupInitialState,
    );
    // Restore authentication after page reload
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await api.post("/auth/refresh", {});

                setAccessToken(response.data.data.accessToken);

                const userResponse = await api.get("/auth/me");

                setUser(userResponse.data.data);
            } catch (error) {
                clearAccessToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();

        const handleSessionExpired = () => {
            clearAccessToken();
            setUser(null);
        };

        window.addEventListener("auth:session-expired", handleSessionExpired);

        return () => {
            window.removeEventListener("auth:session-expired", handleSessionExpired);
        };
    }, []);

    const login = async (
        email: string,
        password: string
    ) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const { accessToken, ...userData } = response.data.data;
        setAccessToken(accessToken);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            clearAccessToken();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                state,
                dispatch,
                signupState,
                signupDispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
