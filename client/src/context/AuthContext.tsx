import { createContext, ReactNode, Dispatch, useReducer } from 'react';
import type { LoginAction, LoginState, SignupAction, SignupState } from '../types';
import { initialState, loginReducer, signupInitialState, signupReducer } from '../reducer/reducer';

// Define the Context Type
export interface AuthContextType  {
     state: LoginState;
     dispatch: Dispatch<LoginAction>;
     signupState: SignupState;
     signupDispatch: Dispatch<SignupAction>;
     
}

interface AuthProviderProps {
    children: ReactNode;
}


// Createthe Conext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const [signupState, signupDispatch] = useReducer(signupReducer, signupInitialState);
    return (
        
        <AuthContext.Provider value={{ state, dispatch, signupState, signupDispatch }}>
            {children}
        </AuthContext.Provider>
    );
}



