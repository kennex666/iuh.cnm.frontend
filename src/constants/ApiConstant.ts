import Constants from 'expo-constants';

const HOST_BE = Constants.expoConfig?.extra?.HOST_BE;
const PORT_BE = Constants.expoConfig?.extra?.PORT_BE;
const URL_BE = `http://${HOST_BE}:${PORT_BE}`;

export const ApiEndpoints = {
    API_2FA: `${URL_BE}/api/2fa`,
    API_AUTH: `${URL_BE}/api/auth`,
    API_USER: `${URL_BE}/api/user`,
    API_CONVERSATION: `${URL_BE}/api/conversations`,
    API_MESSAGE: `${URL_BE}/api/messages`,
    API_FILE: `${URL_BE}/api/file`,
    API_FRIEND_REQUEST: `${URL_BE}/api/friendRequests`,
    SOCKET_URL: `${URL_BE}`
};
