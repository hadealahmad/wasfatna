'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    canModerate: boolean;
    login: (token: string, user: User) => void;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to set cookie
    const setAuthCookie = (token: string) => {
        document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
    };

    const removeAuthCookie = () => {
        document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    };

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            try {
                // Ensure cookie is synced
                setAuthCookie(storedToken);

                const parsedUser = JSON.parse(storedUser) as User;
                setToken(storedToken);
                setUser(parsedUser);

                // Verify token is still valid
                api.auth.getUser(storedToken)
                    .then((response) => {
                        const userData = response as { user: User };
                        setUser(userData.user);
                        localStorage.setItem(USER_KEY, JSON.stringify(userData.user));
                    })
                    .catch(() => {
                        // Token invalid, clear auth state
                        localStorage.removeItem(TOKEN_KEY);
                        localStorage.removeItem(USER_KEY);
                        removeAuthCookie();
                        setToken(null);
                        setUser(null);
                    })
                    .finally(() => setIsLoading(false));
            } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                removeAuthCookie();
                setIsLoading(false);
            }
        } else {
            removeAuthCookie();
            setIsLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        setAuthCookie(newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = async () => {
        if (token) {
            try {
                await api.auth.logout(token);
            } catch {
                // Ignore logout errors
            }
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        removeAuthCookie();
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        isModerator: user?.role === 'moderator',
        canModerate: user?.role === 'admin' || user?.role === 'moderator',
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
