import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from "@/src/constants/StorageKeyConstant";


const ACCESS_TOKEN_KEY = StorageKeys.ACCESS_TOKEN;
const REFRESH_TOKEN_KEY = StorageKeys.REFRESH_TOKEN;

export const AuthStorage = {

    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
        try {
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, accessToken],
                [REFRESH_TOKEN_KEY, refreshToken],
            ]);
        } catch (error) {
            console.error('Error saving tokens to storage:', error);
        }
    },

    async getAccessToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting access token from storage:', error);
            return null;
        }
    },

    async getRefreshToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting refresh token from storage:', error);
            return null;
        }
    },

    async removeTokens(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
        } catch (error) {
            console.error('Error removing tokens from storage:', error);
        }
    }
};