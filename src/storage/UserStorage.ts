import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '@/src/models/User';
import {StorageKeys} from "@/src/constants/StorageKeyConstant";

const USER_STORAGE_KEY = StorageKeys.USER;

let userCache: Partial<User> | null = null;

export const UserStorage = {
    async saveUser(user: User): Promise<boolean> {
        if (!user || typeof user !== 'object') {
            console.warn('Invalid user object provided to saveUser');
            return false;
        }

        try {
            const userString = JSON.stringify(user);
            await AsyncStorage.setItem(USER_STORAGE_KEY, userString);
            userCache = user;
            return true;
        } catch (error: any) {
            console.error('Error saving user to storage:', error?.message || error);
            return false;
        }
    },

    async getUser(bypassCache: boolean = false): Promise<Partial<User> | null> {
        if (userCache && !bypassCache) return userCache;

        try {
            const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
            if (!userJson) return null;

            const userData = JSON.parse(userJson) as Partial<User>;
            userCache = userData;
            return userData;
        } catch (error: any) {
            console.error('Error getting user from storage:', error?.message || error);
            return null;
        }
    },

    async removeUser(): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            userCache = null;
            return true;
        } catch (error: any) {
            console.error('Error removing user from storage:', error?.message || error);
            return false;
        }
    },

    clearCache(): void {
        userCache = null;
    }
};