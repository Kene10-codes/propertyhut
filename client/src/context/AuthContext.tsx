import { createContext, ReactNode, Dispatch, useReducer } from 'react';
import { LoginAction, LoginState } from '../types';
import { initialState, loginReducer } from '../reducer/reducer';

// Define the Context Type
export interface AuthContextType  {
     state: LoginState;
     dispatch: Dispatch<LoginAction>;
     
}

interface AuthProviderProps {
    children: ReactNode;
}

// Createthe Conext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(loginReducer, initialState)
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
           { children }
        </AuthContext.Provider>
    )
}



