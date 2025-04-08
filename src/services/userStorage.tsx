import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/src/models/User';

const USER_STORAGE_KEY = '@IUH_CNM_APP:user';

export const storage = {
  // Lưu thông tin user
  async saveUser(user: User): Promise<void> {
    try {
      // Loại bỏ password trước khi lưu
      const { password, ...userToStore } = user;
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  },

  // Lấy thông tin user
  async getUser(): Promise<Partial<User> | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  },

  // Xóa thông tin user (đăng xuất)
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  }
};