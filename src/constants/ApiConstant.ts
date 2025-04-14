const HOST = "localhost";
const PORT = "8087";
const BASE_URL = `http://${HOST}:${PORT}`;

export const Domains = {
    API_2FA: `${BASE_URL}/api/2fa`,
    API_AUTH: `${BASE_URL}/api/auth`,
    API_USER: `${BASE_URL}/api/user`,
    API_CONVERSATION: `${BASE_URL}/api/conversation`,
    API_MESSAGE: `${BASE_URL}/api/message`,
    API_FILE: `${BASE_URL}/api/file`,
};
