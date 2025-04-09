import {User} from "@/src/models/User";

export interface AuthContextType {
    user: Partial<User> | null;
    isLoading: boolean;
    login: (phone: string, password: string)
        => Promise<{ success: boolean; message?: string }>;
    logout: ()
        => Promise<void>;
    update: (updatedUser: Partial<User>)
        => Promise<{ success: boolean; message?: string }>;
}
