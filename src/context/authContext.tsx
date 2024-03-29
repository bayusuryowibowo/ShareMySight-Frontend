"use client";
// Importing types for Next.js
import { ReactNode } from "react";
import { useCookies } from "next-client-cookies";
import { createContext } from "react";
import { useRouter } from "next/navigation";

// Defining the AuthContext type
type AuthContextType = {
    isAuthenticated?: boolean;
    login?: (token: string) => void;
    logout?: () => void;
};

// Creating the AuthContext with an initial empty object
export const AuthContext = createContext<AuthContextType | any>(undefined);

// AuthProviderProps type for the AuthProvider component
type AuthProviderProps = {
    children: ReactNode;
};

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const cookies = useCookies();
    const isAuthenticated = !!cookies.get("client_token");

    const login = (token: string) => {
        cookies.set("client_token", token);
        router.push("/video-call");
    };

    const logout = () => {
        cookies.remove("client_token");
        router.push("/login");
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
