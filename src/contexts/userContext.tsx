import React, {createContext, useContext, useEffect, useState} from 'react';
import {User} from '@/src/models/User';
import {storage} from '@/src/services/userStorage';
import {userService} from '@/src/api/services/userService';
import {AuthContextType} from "@/src/models/AuthContextType";
import {AuthProviderProps} from "@/src/models/AuthProviderProps";


const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => ({success: false}),
    logout: async () => {
    }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        const storedUser = await storage.getUser();
        setUser(storedUser);
        setIsLoading(false);
    };

    useEffect(() => {
        loadUser().catch((error) => {
            console.error('Error loading user:', error);
            setIsLoading(false);
        });
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
