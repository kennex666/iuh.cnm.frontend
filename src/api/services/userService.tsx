import axios from 'axios';
import { User } from '@/src/models/User';

const API_BASE_URL = 'https://67f506d5913986b16fa2e323.mockapi.io';

export const userService = {
  // Lấy user theo số điện thoại
    async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/User`);
      // Fetch all users and filter manually to ensure exact match
      const matchedUser = response.data.find(
        (user: User) => user.phone === phone
      );
      return matchedUser || null;
    } catch (error) {
      console.error('Error fetching user by phone:', error);
      return null;
    }
  },

  // Đăng nhập với số điện thoại và mật khẩu
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