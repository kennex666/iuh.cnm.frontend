import axios from 'axios';
import {AuthStorage} from '@/src/services/AuthStorage';
import {Platform} from 'react-native';

// API URL based on platform
const getApiUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://192.168.1.25:8087/api';
    } else if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to access localhost of the host machine
        return 'http://10.0.2.2:8087/api';
    } else {
        // iOS simulator can use localhost
        return 'http://localhost:8087/api';
    }
};

export const API_URL = getApiUrl();

export const setupAxios = async () => {
    // Set the base URL
    axios.defaults.baseURL = API_URL;

    // Add a timeout
    axios.defaults.timeout = 15000;

    // Ensure proper content type
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    // Add request logging
    axios.interceptors.request.use(
        async (config) => {
            console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);

            // Get the token from storage
            const token = await AuthStorage.getAccessToken();

            // If token exists, add it to the headers
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            console.log('[Axios Request Error]', error);
            return Promise.reject(error);
        }
    );

    // Add response logging
    axios.interceptors.response.use(
        (response) => {
            console.log(`[Axios Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
            return response;
        },
        async (error) => {
            console.log('[Axios Response Error]', {
                message: error.message,
                code: error.code,
                status: error.response?.status || 'No status',
                data: error.response?.data || 'No data'
            });

            const originalRequest = error.config;

            // If error is 401 and we haven't tried to refresh the token yet
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // TODO: Implement token refresh logic here
                // For now just return the error
            }

            return Promise.reject(error);
        }
    );
};