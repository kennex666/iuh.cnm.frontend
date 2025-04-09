import axios from 'axios';
import {User} from '@/src/models/User';
import { authStorage } from '@/src/services/authStorage';

const API_URL = '192.168.1.25:8087';


export const userService = {
    // async getUserByPhone(phone: string): Promise<User | null> {
    //     try {
    //         const response = await axios.get(`${ENDPOINT}/User`);
    //         const matchedUser = response.data.find((user: User) => user.phone === phone);
    //         return matchedUser || null;
    //     } catch (error) {
    //         console.error('Error fetching user by phone:', error);
    //         return null;
    //     }
    // },
    //
    // async login(phone: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    //     try {
    //         const user = await this.getUserByPhone(phone);
    //
    //         if (!user) return {success: false, message: 'Số điện thoại không tồn tại'};
    //         if (user.password !== password) return {success: false, message: 'Mật khẩu không chính xác'};
    //
    //         return {success: true, user: user};
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         return {success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau'};
    //     }
    // },

    async update(userData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string; data?: any }> {
        try {
            console.log('Updating user with data:', userData);

            // Get the access token
            const token = await authStorage.getAccessToken();
            if (!token) {
                console.error('No access token found');
                return { success: false, message: 'Không tìm thấy token xác thực' };
            }

            // Format the data - convert timestamp to ISO date string if dob exists
            const formattedData = {...userData};
            if (formattedData.dob) {
                // Convert timestamp to ISO date format (YYYY-MM-DD)
                const date = new Date(formattedData.dob);
                formattedData.dob = date.toISOString().split('T')[0];
                console.log('Converted dob to ISO format:', formattedData.dob);
            }

            // Make the API request with authorization header
            const response = await axios.put(
                `http://${API_URL}/api/user/update`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update API response:', response.data);

            if (response.data.success) {
                return {
                    success: true,
                    user: response.data.data,
                    message: response.data.errorMessage || 'Cập nhật thông tin thành công!',
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.errorMessage || 'Cập nhật thông tin thất bại'
                };
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Lỗi không xác định khi cập nhật thông tin'
            };
        }
    }

};