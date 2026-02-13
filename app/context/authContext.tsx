import { SERVER_URL } from "@/services/services";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";


interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    role: string;
    username: string;
}

interface AuthContextType {
    userToken: string | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    refreshToken: () => Promise<void>;
}



export const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("accessToken");
                if (accessToken) {
                    setUserToken(accessToken);
                }
            } catch (error) {
                console.error("Error loading token:", error);
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, []);


    const register = async (data: RegisterData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/users/register`, data);
            
           
          
            if (response.data.success) {
                console.log("Registration successful:", response.data.message);
            }
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };


    const login = async (data: LoginData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/users/login`, data);
            
            if (response.data.data.accessToken && response.data.data.refreshToken) {
                await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
                await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
                setUserToken(response.data.data.accessToken);
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${SERVER_URL}/users/logout`);
            
         
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            setUserToken(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/users/refresh-token`);
            
            if (response.data.data.accessToken && response.data.data.refreshToken) {
              
                await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
                await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
                setUserToken(response.data.data.accessToken);
            }
        } catch (error) {
            console.error("Refresh token error:", error);
         
            await logout();
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, loading, login, logout, register, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
