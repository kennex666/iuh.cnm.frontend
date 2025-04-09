import axios from 'axios';
import {User} from '@/src/models/User';

const ENDPOINT = 'https://67f506d5913986b16fa2e323.mockapi.io';

export const userService = {
    async getUserByPhone(phone: string): Promise<User | null> {
        try {
            const response = await axios.get(`${ENDPOINT}/User`);
            const matchedUser = response.data.find(
                (user: User) => user.phone === phone
            );
            return matchedUser || null;
        } catch (error) {
            console.error('Error fetching user by phone:', error);
            return null;
        }
    },

    async login(phone: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const user = await this.getUserByPhone(phone);

            if (!user) {
                return {
                    success: false,
                    message: 'Số điện thoại không tồn tại'
                };
            }

            if (user.password !== password) {
                return {
                    success: false,
                    message: 'Mật khẩu không chính xác'
                };
            }

            return {
                success: true,
                user: user
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau'
            };
        }
    }
};