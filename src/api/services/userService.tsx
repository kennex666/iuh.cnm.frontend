import axios from 'axios';
import {User} from '@/src/models/User';

const ENDPOINT = 'https://67f506d5913986b16fa2e323.mockapi.io';

export const userService = {
    async getUserByPhone(phone: string): Promise<User | null> {
        try {
            const response = await axios.get(`${ENDPOINT}/User`);
            const matchedUser = response.data.find((user: User) => user.phone === phone);
            return matchedUser || null;
        } catch (error) {
            console.error('Error fetching user by phone:', error);
            return null;
        }
    },

    async login(phone: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const user = await this.getUserByPhone(phone);

            if (!user) return {success: false, message: 'Số điện thoại không tồn tại'};
            if (user.password !== password) return {success: false, message: 'Mật khẩu không chính xác'};

            return {success: true, user: user};
        } catch (error) {
            console.error('Login error:', error);
            return {success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau'};
        }
    },

    async update(user: User): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            if (!user.id) return { success: false, message: 'Không tìm thấy ID người dùng' };

            user.updatedAt = Date.now();

            const response = await axios.put(`${ENDPOINT}/User/${user.id}`, user);
            if (response.status === 200) return { success: true, user: response.data };
            else return { success: false, message: 'Cập nhật thất bại' };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, message: 'Có lỗi xảy ra khi cập nhật thông tin' };
        }
    }
};