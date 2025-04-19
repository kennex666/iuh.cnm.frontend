import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { isUserComplete, User } from '@/src/models/User';
import { Profile } from '@/src/models/Profile';
import { UserStorage } from '@/src/storage/UserStorage';
import { UserService } from '@/src/api/services/UserService';
import { AuthService } from '@/src/api/services/AuthService';
import { AuthStorage } from '@/src/storage/AuthStorage';
import { useRouter } from 'expo-router';
import SocketService from '@/src/api/services/SocketService';

interface LoginCredentials {
    phone: string;
    password: string;
    otp?: string | null;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    errorCode?: number | string;
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

// Tạo context với giá trị mặc định
const UserContext = createContext<UserContextType>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => ({ success: false }),
    logout: async () => {},
    update: async () => ({ success: false }),
    refreshUserData: async () => false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: UserProviderProps) => {
    const router = useRouter();
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const socketService = SocketService.getInstance();

    const computeProfile = useCallback((userData: Partial<User> | null): Profile | null => {
        if (!userData) return null;

        const { password, createdAt, updatedAt, ...profileData } = userData as User;
        return profileData as Profile;
    }, []);

    const profile = computeProfile(user);

    const isAuthenticated = !!user;

    const loadUserData = useCallback(async (): Promise<boolean> => {
        try {
            const token = await AuthStorage.getAccessToken();

            if (!token) {
                console.log('No access token found, user is not authenticated');
                return false;
            }

            const result = await UserService.me();

            if (result.success && result.user) {
                console.log('Using fresh user data from server');
                setUser(result.user);
                await UserStorage.saveUser(result.user);
                socketService.connect(token);
                return true;
            }

            console.warn('Failed to fetch fresh user data:', result.message);
            const storedUser = await UserStorage.getUser();

            if (storedUser) {
                console.log('Using cached user data from storage');
                setUser(storedUser);
                socketService.connect(token);
                return true;
            }

            console.warn('No valid user data available');
            return false;
        } catch (error) {
            console.error('Error loading user data:', error);
            return false;
        }
    }, []);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userLoaded = await loadUserData();

                if (!userLoaded) {
                    await logout(true);
                }
            } catch (error) {
                console.error('Error initializing user:', error);
                await logout(true);
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser().then(() => {
            console.log('User initialization complete');
        });

        return () => {};
    }, [loadUserData]);

    const login = async ({ phone, password, otp = null }: LoginCredentials): Promise<ApiResponse> => {
        try {
            const result = await AuthService.login({ phone, password, otp });

            if (result.success && result.user && result.accessToken && result.refreshToken) {
                setUser(result.user);
                await UserStorage.saveUser(result.user as User);
                await AuthStorage.saveTokens(result.accessToken, result.refreshToken);
                socketService.connect(result.accessToken);

                return {
                    success: true,
                    message: 'Đăng nhập thành công!',
                };
            }

            return {
                success: false,
                message: result.message || 'Đăng nhập thất bại!',
                errorCode: result?.errorCode || 0
            };
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                errorCode: 500,
            };
        }
    };

    const logout = async (redirect: boolean = true): Promise<void> => {
        try {
            await UserStorage.removeUser();
            await AuthStorage.removeTokens();
            setUser(null);
            socketService.disconnect();

            if (redirect) {
                router.replace("/(auth)");
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const update = async (updatedUser: Partial<User>): Promise<ApiResponse> => {
        try {
            if (!user) {
                return {
                    success: false,
                    message: 'Không có thông tin người dùng!'
                };
            }

            const result = await UserService.update(updatedUser);

            if (!result.success) {
                return {
                    success: false,
                    message: result.message || 'Cập nhật thông tin thất bại!'
                };
            }

            const updatedUserResponse = result.user || { ...user, ...updatedUser };

            if (isUserComplete(updatedUserResponse)) {
                setUser(updatedUserResponse);
                await UserStorage.saveUser(updatedUserResponse);
                return {
                    success: true,
                    message: 'Cập nhật thông tin thành công!'
                };
            } else {
                console.error('Incomplete user data:', updatedUserResponse);
                return {
                    success: false,
                    message: 'Cập nhật thông tin thất bại: dữ liệu không đầy đủ',
                    errorCode: 400,
                };
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                message: 'Cập nhật thông tin thất bại!',
                errorCode: 500,
            };
        }
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
                login,
                logout,
                update,
                refreshUserData
            }}
        >
            {children}
        </UserContext.Provider>
    );
};