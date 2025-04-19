import {UserService as ApiUserService} from '@/src/api/services/UserService';
import {UserStorage} from '@/src/storage/UserStorage';
import {isUserComplete, User} from '@/src/models/User';
import {Profile} from '@/src/models/Profile';
import {AuthStorage} from '@/src/storage/AuthStorage';
import {ApiResponse} from '@/src/contexts/user/ApiResponse';
import SocketService from '@/src/api/services/SocketService';

class UserManager {
    private socketService = SocketService.getInstance();

    computeProfile(user: Partial<User> | null): Profile | null {
        if (!user) return null;

        const {password, createdAt, updatedAt, ...profileData} = user as User;
        return profileData as Profile;
    }


    async getUserData(): Promise<ApiResponse<Partial<User>>> {
        try {
            const token = await AuthStorage.getAccessToken();

            if (!token) {
                return {
                    success: false,
                    message: 'Không tìm thấy access token',
                };
            }

            const result = await ApiUserService.me();

            if (result.success && result.user) {
                await UserStorage.saveUser(result.user);
                this.socketService.connect(token);

                return {
                    success: true,
                    message: 'Lấy thông tin người dùng thành công',
                    data: result.user
                };
            }

            const storedUser = await UserStorage.getUser();

            if (storedUser) {
                this.socketService.connect(token);
                return {
                    success: true,
                    message: 'Lấy thông tin người dùng từ bộ nhớ',
                    data: storedUser
                };
            }

            return {
                success: false,
                message: 'Không tìm thấy thông tin người dùng',
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi tải thông tin người dùng',
                errorCode: 500
            };
        }
    }

    async updateUser(updatedUser: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const currentUser = await UserStorage.getUser();
            if (!currentUser) {
                return {
                    success: false,
                    message: 'Không có thông tin người dùng!'
                };
            }

            const result = await ApiUserService.update(updatedUser);

            if (!result.success) {
                return {
                    success: false,
                    message: result.message || 'Cập nhật thông tin thất bại!'
                };
            }

            const updatedUserResponse = result.user || {...currentUser, ...updatedUser} as User;

            if (isUserComplete(updatedUserResponse)) {
                await UserStorage.saveUser(updatedUserResponse);
                return {
                    success: true,
                    message: 'Cập nhật thông tin thành công!',
                    data: updatedUserResponse
                };
            } else {
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
    }
}

export default new UserManager();
