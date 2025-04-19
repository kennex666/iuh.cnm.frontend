import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {isUserComplete, User} from '@/src/models/User';
import {UserStorage} from '@/src/storage/UserStorage';
import {UserService} from '@/src/api/services/UserService';
import {AuthService} from '@/src/api/services/AuthService';
import {AuthStorage} from '@/src/storage/AuthStorage';
import {useRouter} from 'expo-router';
import SocketService from '@/src/api/services/SocketService';

interface AuthLogin {
    phone: string;
    password: string;
    otp?: string | null;
}

interface AuthContextType {
    user: Partial<User> | null;
    isLoading: boolean;
    login: ({phone, password, otp}: AuthLogin)
        => Promise<{ success: boolean; message?: string; errorCode?: number | string }>;
    logout: ()
        => Promise<void>;
    update: (updatedUser: Partial<User>)
        => Promise<{ success: boolean; message?: string }>;
}

interface AuthProviderProp {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => ({success: false}),
    logout: async () => {},
    update: async () => ({success: false}),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: AuthProviderProp) => {
    const router = useRouter();
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const socketService = SocketService.getInstance();

    const loadUser = async () => {
        try {
            const token = await AuthStorage.getAccessToken();

            if (token) {
                const result = await UserService.me();

                if (result.success && result.user) {
                    console.log('Using fresh user data from server');
                    setUser(result.user);
                    await UserStorage.saveUser(result.user);
                    socketService.connect(token);
                } else {
                    console.warn('Failed to fetch fresh user data:', result.message);
                    const storedUser = await UserStorage.getUser();
                    if (storedUser) {
                        console.log('Using cached user data from storage');
                        setUser(storedUser);
                        socketService.connect(token);
                    } else {
                        console.warn('No valid user data available, logging out');
                        await logout();
                        router.replace("/(auth)");
                    }
                }
            } else {
                console.log('No access token found, logging out');
                await logout();
                router.replace("/(auth)");
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUser().catch((error) => {
            console.error('Error in useEffect:', error);
            setIsLoading(false);
        });
    }, []);

    const login = async ({phone, password, otp = null}: AuthLogin) => {
        try {
            const result = await AuthService.login({phone, password, otp});

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
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                errorCode: 500,
            };
        }
    };

    const logout = async () => {
        try {
            await UserStorage.removeUser();
            await AuthStorage.removeTokens();
            setUser(null);
            socketService.disconnect();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const update = async (updatedUser: Partial<User>) => {
        try {
            if (!user) return {
                success: false,
                message: 'Không có thông tin người dùng!'
            };

            const result = await UserService.update(updatedUser);

            if (!result.success) return {
                success: false,
                message: result.message || 'Cập nhật thông tin thất bại!'
            };

            const updatedUserResponse = result.user || {...user, ...updatedUser};

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

    return (
        <AuthContext.Provider value={{user, isLoading, login, logout, update}}>
            {children}
        </AuthContext.Provider>
    );
};