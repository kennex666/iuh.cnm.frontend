const HOST_BE = process.env.EXPO_PUBLIC_HOST_BE;
const PORT_BE = process.env.EXPO_PUBLIC_PORT_BE;
export const URL_BE = `http://${HOST_BE}:${PORT_BE}`;

export const ApiEndpoints = {
    API_2FA: `${URL_BE}/api/2fa`,
    API_AUTH: `${URL_BE}/api/auth`,
    API_USER: `${URL_BE}/api/user`,
    API_CONVERSATION: `${URL_BE}/api/conversations`,
    API_MESSAGE: `${URL_BE}/api/messages`,
    API_FILE: `${URL_BE}/api/file`,
    API_FRIEND_REQUEST: `${URL_BE}/api/friendRequests`,
    API_ATTACHMENTS: `${URL_BE}/api/attachments`,
    API_REACTION: `${URL_BE}/api/reaction`,
    API_WEBRTC: `${URL_BE}/webrtc`,
    SOCKET_URL: `${URL_BE}`,
};
