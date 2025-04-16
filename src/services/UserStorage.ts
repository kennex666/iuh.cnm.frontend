import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '@/src/models/User';
import {StorageKeys} from "@/src/constants/StorageKeyConstant";


const USER_STORAGE_KEY = StorageKeys.USER

export const UserStorage = {

    async saveUser(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    },

    async getUser(): Promise<Partial<User> | null> {
        try {
            const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting user from storage:', error);
            return null;
        }
    },

    async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user from storage:', error);
        }
    }
};