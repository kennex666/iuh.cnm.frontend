import {User} from "@/src/models/User";

export interface AuthContextType {
    // Null nếu chưa đăng nhập
    user: Partial<User> | null;
    isLoading: boolean;
    login: (phone: string, password: string)
        => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}
