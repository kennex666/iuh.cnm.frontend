import {AuthService as ApiAuthService} from '@/src/api/services/AuthService';
import {AuthStorage} from '@/src/storage/AuthStorage';
import {UserStorage} from '@/src/storage/UserStorage';
import {User} from '@/src/models/User';
import {ApiResponse} from '@/src/contexts/user/manager/ApiResponse';
import SocketService from '@/src/api/services/SocketService';

interface LoginCredentials {
    phone: string;
    password: string;
    otp?: string | null;
}

class AuthManager {
    private socketService = SocketService.getInstance();

    async login({phone, password, otp = null}: LoginCredentials): Promise<ApiResponse> {
        try {
            const result = await ApiAuthService.login({phone, password, otp});

            if (result.success && result.user && result.accessToken && result.refreshToken) {
                await UserStorage.saveUser(result.user as User);
                await AuthStorage.saveTokens(result.accessToken, result.refreshToken);
                this.socketService.connect(result.accessToken);

                return {
                    success: true,
                    message: 'Đăng nhập thành công!',
                    data: result.user
                };
            }

            return {
                success: false,
                message: 'Đăng nhập thất bại !',
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
    }

    async logout(): Promise<ApiResponse> {
        try {
            await UserStorage.removeUser();
            await AuthStorage.removeTokens();
            this.socketService.disconnect();

            return {
                success: true,
                message: 'Đăng xuất thành công!'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi đăng xuất'
            };
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await AuthStorage.getAccessToken();
        return !!token;
    }
}

export default new AuthManager();
