import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from "@/src/constants/StorageKeyConstant";

const ACCESS_TOKEN_KEY = StorageKeys.ACCESS_TOKEN;
const REFRESH_TOKEN_KEY = StorageKeys.REFRESH_TOKEN;

let tokenCache: {
    accessToken: string | null,
    refreshToken: string | null
} = {
    accessToken: null,
    refreshToken: null
};

export const AuthStorage = {
    async saveTokens(accessToken: string, refreshToken: string): Promise<boolean> {
        if (!accessToken || !refreshToken) {
            console.warn('Invalid tokens provided to saveTokens');
            return false;
        }

        try {
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, accessToken],
                [REFRESH_TOKEN_KEY, refreshToken],
            ]);

            tokenCache.accessToken = accessToken;
            tokenCache.refreshToken = refreshToken;
            return true;
        } catch (error: any) {
            console.error('Error saving tokens to storage:', error?.message || error);
            return false;
        }
    },

    async getAccessToken(bypassCache: boolean = false): Promise<string | null> {
        if (tokenCache.accessToken && !bypassCache) {
            return tokenCache.accessToken;
        }

        try {
            const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
            tokenCache.accessToken = token;
            return token;
        } catch (error: any) {
            console.error('Error getting access token from storage:', error?.message || error);
            return null;
        }
    },

    async getRefreshToken(bypassCache: boolean = false): Promise<string | null> {
        if (tokenCache.refreshToken && !bypassCache) {
            return tokenCache.refreshToken;
        }

        try {
            const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            tokenCache.refreshToken = token;
            return token;
        } catch (error: any) {
            console.error('Error getting refresh token from storage:', error?.message || error);
            return null;
        }
    },

    async removeTokens(): Promise<boolean> {
        try {
            await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
            tokenCache.accessToken = null;
            tokenCache.refreshToken = null;
            return true;
        } catch (error: any) {
            console.error('Error removing tokens from storage:', error?.message || error);
            return false;
        }
    },

    clearCache(): void {
        tokenCache.accessToken = null;
        tokenCache.refreshToken = null;
    }
};