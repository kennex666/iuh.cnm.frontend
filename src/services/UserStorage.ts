import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '@/src/models/User';
import {StorageKeys} from "@/src/constants/StorageKeyConstant";


// Một hằng số lưu trữ khóa. Được sử dụng để lưu trữ thông tin người dùng trong bộ nhớ.
const USER_STORAGE_KEY = StorageKeys.USER

export const UserStorage = {

    /*
    * Lưu thông tin người dùng vào bộ nhớ
    *
    * Được sử dụng cho chức năng đăng nhập
    *
    * - Nhận đối tượng User làm tham số
    * - Loại bỏ thuộc tính password khỏi đối tượng trước khi lưu nhằm mục đích bảo mật
    * - Chuyển đổi đối tượng thành chuỗi JSON
    * - Lưu chuỗi JSON vào bộ nhớ bằng khóa USER_STORAGE_KEY
     */
    async saveUser(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    },

    /*
    * Lấy thông tin người dùng từ bộ nhớ
    *
    * Được sử dụng cho chức năng xác thực người dùng, kiểm tra trạng thái đăng nhập,...
    *
    * - Lấy dữ liệu từ bộ nhớ bằng khóa USER_STORAGE_KEY
     */
    async getUser(): Promise<Partial<User> | null> {
        try {
            const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting user from storage:', error);
            return null;
        }
    },

    /*
    * Xóa thông tin người dùng khỏi bộ nhớ
    *
    * Được sử dụng cho chức năng đăng xuất
    *
    * - Xóa dữ liệu khỏi bộ nhớ bằng khóa USER_STORAGE_KEY
     */
    async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user from storage:', error);
        }
    }
};