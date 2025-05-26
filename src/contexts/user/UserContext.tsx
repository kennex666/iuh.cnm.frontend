import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {User} from '@/src/models/User';
import {Profile} from '@/src/models/Profile';
import {useRouter} from 'expo-router';
import {ApiResponse} from "@/src/contexts/user/manager/ApiResponse";
import UserManager from "@/src/contexts/user/manager/UserManager";
import AuthManager from "@/src/contexts/user/manager/AuthManager";

interface LoginCredentials {
    phone: string;
    password: string;
    otp?: string | null;
}

interface UserContextType {
    user: Partial<User> | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (credentials: LoginCredentials) => Promise<ApiResponse>;
    logout: (redirect?: boolean) => Promise<void>;
    update: (updatedUser: Partial<User>) => Promise<ApiResponse>;
    refreshUserData: () => Promise<boolean>;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => ({success: false}),
    logout: async () => {
    },
    update: async () => ({success: false}),
    refreshUserData: async () => false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}: UserProviderProps) => {
    const router = useRouter();
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loadUserData = async (): Promise<boolean> => {
        const result = await UserManager.getUserData();

        if (result.success && result.data) {
            setUser(result.data);
            setProfile(UserManager.computeProfile(result.data));
            setIsAuthenticated(true);
            return true;
        }

        return false;
    };

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userLoaded = await loadUserData();

                if (!userLoaded) {
                    await handleLogout(true);
                }
            } catch (error) {
                console.error('Error initializing user:', error);
                await handleLogout(true);
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    const handleLogin = async (credentials: LoginCredentials): Promise<ApiResponse> => {
        const result = await AuthManager.login(credentials);

        if (result.success && result.data) {
            setUser(result.data);
            setProfile(UserManager.computeProfile(result.data));
            setIsAuthenticated(true);
        }

        return result;
    };

    const handleLogout = async (redirect: boolean = true): Promise<void> => {
        await AuthManager.logout();
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);

        if (redirect) {
            router.replace("/(auth)");
        }
    };

    const handleUpdate = async (updatedUser: Partial<User>): Promise<ApiResponse> => {
        console.log('Updating user:', updatedUser);
        const result = await UserManager.updateUser(updatedUser);
        console.log('Update result:', result);

        if (result.success && result.data) {
            setUser(result.data);
            setProfile(UserManager.computeProfile(result.data));
        }

        return result;
    };

    const refreshUserData = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            return await loadUserData();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                profile,
                isAuthenticated,
                isLoading,
                login: handleLogin,
                logout: handleLogout,
                update: handleUpdate,
                refreshUserData
            }}
        >
            {children}
        </UserContext.Provider>
    );
};