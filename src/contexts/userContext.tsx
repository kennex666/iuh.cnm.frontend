import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {User} from '@/src/models/User';
import {storage} from '@/src/services/userStorage';
import {userService} from '@/src/api/services/userService';

interface AuthContextType {
    user: Partial<User> | null;
    isLoading: boolean;
    login: (phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => ({success: false}),
    logout: async () => {
    }
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Tự động tải thông tin user khi khởi động app
        const loadUser = async () => {
            const storedUser = await storage.getUser();
            setUser(storedUser);
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (phone: string, password: string) => {
        const result = await userService.login(phone, password);

        if (result.success && result.user) {
            setUser(result.user);
            await storage.saveUser(result.user);
        }

        return {
            success: result.success,
            message: result.message
        };
    };

    const logout = async () => {
        await storage.removeUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};