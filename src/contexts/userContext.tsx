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
    logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

/*
* AuthProvider là một component cung cấp context cho toàn bộ ứng dụng.
*
* Nó sẽ lưu trữ thông tin người dùng và trạng thái đăng nhập.
*
* Các component con có thể sử dụng useAuth để truy cập thông tin này.
*
* Tự động tải thông tin người dùng từ local storage khi khởi tạo.
*
* - user: Thông tin người dùng hiện tại. Null nếu chưa đăng nhập.
* - isLoading: Trạng thái đang tải thông tin người dùng.
* - login: Hàm đăng nhập, nhận số điện thoại và mật khẩu.
* - logout: Hàm đăng xuất.
 */
export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm này sẽ được gọi khi component AuthProvider được mount
    // Tự động kiểm tra xem có thông tin người dùng trong local storage có tồn tại không
    // Nếu có, cập nhật state user và isLoading
    // Nếu không, set isLoading thành false
    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await storage.getUser();
            setUser(storedUser);
            setIsLoading(false);
        };

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
