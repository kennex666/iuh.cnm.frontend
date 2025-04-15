const HOST = "localhost";
const PORT = "8087";
const BASE_URL = `http://${HOST}:${PORT}`;

export enum ApiEndpoints {
    API_2FA = "/api/2fa",
    API_AUTH = "/api/auth",
    API_USER = "/api/user",
    API_CONVERSATION = "/api/conversation",
    API_MESSAGE = "/api/message",
    API_FILE = "/api/file",
    API_FRIEND_REQUEST = "/api/friend-request"
}
