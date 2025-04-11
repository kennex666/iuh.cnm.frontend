const HOST = "localhost";
const PORT = "8087";
const BASE_URL = `http://${HOST}:${PORT}`;

export const API_DOMAIN = {
    API_AUTH: `${BASE_URL}/api/auth`,
    API_USER: `${BASE_URL}/api/user`,
    API_2FA: `${BASE_URL}/api/2fa`,
};
