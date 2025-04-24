import axios from 'axios';
import {AuthStorage} from '@/src/storage/AuthStorage';
import {Platform} from 'react-native';
import { URL_BE } from '../constants/ApiConstant';

const getApiUrl = () => {
    if (Platform.OS === 'web') {
        return `${URL_BE}/api`;
    } else if (Platform.OS === 'android') {
        return `http://10.0.2.2:8087/api`;
    } else {
        return `http://${process.env.EXPO_PUBLIC_API_URL}:8087/api`;
    }
};

export const API_URL = getApiUrl();

export const setupAxios = async () => {
    axios.defaults.baseURL = API_URL;
    axios.defaults.timeout = 15000;
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    axios.interceptors.request.use(
        async (config) => {
            console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
            const token = await AuthStorage.getAccessToken();

            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => {
            console.log('[Axios Request Error]', error);
            return Promise.reject(error);
        }
    );

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

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
            }

            return Promise.reject(error);
        }
    );
};