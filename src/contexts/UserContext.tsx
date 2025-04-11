import React, {createContext, useContext, useEffect, useState} from 'react';
import {isUserComplete, User} from '@/src/models/User';
import {UserStorage} from '@/src/services/UserStorage';
import {UserService} from '@/src/api/services/UserService';
import {AuthContextType, AuthLogin} from "@/src/models/props/AuthContextType";
import {AuthProviderProp} from "@/src/models/types/AuthProviderProp";
import {AuthService} from '@/src/api/services/AuthService';
import {AuthStorage} from '@/src/services/AuthStorage';

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => ({success: false}),
    logout: async () => {},
    update: async () => ({success: false}),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: AuthProviderProp) => {
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await UserStorage.getUser();
                if (storedUser) {
                    setUser(storedUser);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser().catch((error) => {
            console.error('Error loading user:', error);
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
                return {success: true, message: 'Đăng nhập thành công!'};
            }

            return {
                success: false,
                message: result.message || 'Đăng nhập thất bại!',
                errorCode: result?.errorCode || 0
            };
        } catch (error) {
            console.error('Login error:', error);
            return {success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau'};
        }
    };

    const logout = async () => {
        try {
            await UserStorage.removeUser();
            await AuthStorage.removeTokens();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const update = async (updatedUser: Partial<User>) => {
        try {
            if (!user) return {success: false, message: 'Không có thông tin người dùng!'};

            const result = await UserService.update(updatedUser);

            if (!result.success) {
                return {success: false, message: result.message || 'Cập nhật thông tin thất bại!'};
            }

            const updatedUserResponse = result.user || {...user, ...updatedUser};

            if (isUserComplete(updatedUserResponse)) {
                setUser(updatedUserResponse);
                await UserStorage.saveUser(updatedUserResponse);
                return {success: true, message: 'Cập nhật thông tin thành công!'};
            } else {
                console.error('Incomplete user data:', updatedUserResponse);
                return {success: false, message: 'Cập nhật thông tin thất bại: dữ liệu không đầy đủ'};
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return {success: false, message: 'Cập nhật thông tin thất bại!'};
        }
    };

    return (
        <AuthContext.Provider value={{user, isLoading, login, logout, update}}>
            {children}
        </AuthContext.Provider>
    );
};