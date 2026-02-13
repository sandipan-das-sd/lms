import { SERVER_URL } from "@/services/services";

import axios from "axios";
import * as SecureStore from 'expo-secure-store';
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

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: string;
    avatar: {
        _id: string;
        localPath: string;
        url: string;
    };
    isEmailVerified: boolean;
    loginType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface AuthContextType {
    userToken: string | null;
    loading: boolean;
    user: UserProfile | null;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    refreshToken: () => Promise<void>;
    getCurrentUser: () => Promise<UserProfile | null>;
    updateAvatar: (avatarUri: string) => Promise<UserProfile | null>;
}



export const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync("accessToken");
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
                await SecureStore.setItemAsync("accessToken", response.data.data.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.data.data.refreshToken);
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
            
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            setUserToken(null);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/users/refresh-token`);
            
            if (response.data.data.accessToken && response.data.data.refreshToken) {
                await SecureStore.setItemAsync("accessToken", response.data.data.accessToken);
                await SecureStore.setItemAsync("refreshToken", response.data.data.refreshToken);
                setUserToken(response.data.data.accessToken);
            }
        } catch (error) {
            console.error("Refresh token error:", error);
            await logout();
            throw error;
        }
    };

    const getCurrentUser = async (): Promise<UserProfile | null> => {
        try {
            const token = await SecureStore.getItemAsync("accessToken");
            if (!token) {
                return null;
            }

            const response = await axios.get(`${SERVER_URL}/users/current-user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error("Get current user error:", error);
            return null;
        }
    };

    const updateAvatar = async (avatarUri: string): Promise<UserProfile | null> => {
        try {
            const token = await SecureStore.getItemAsync("accessToken");
            if (!token) {
                throw new Error("No access token found");
            }

            const formData = new FormData();
            formData.append('avatar', {
                uri: avatarUri,
                type: 'image/jpeg',
                name: 'avatar.jpg',
            } as any);

            const response = await axios.patch(`${SERVER_URL}/users/avatar`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error("Update avatar error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, loading, user, login, logout, register, refreshToken, getCurrentUser, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};
