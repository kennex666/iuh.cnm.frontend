import {User} from "@/src/models/User";


export interface AuthLogin {
    phone: string;
    password: string;
    otp?: string | null;
}
export interface AuthContextType {
    user: Partial<User> | null;
    isLoading: boolean;
    login: ({phone, password, otp}: AuthLogin)
        => Promise<{ success: boolean; message?: string; errorCode?: number | string }>;
    logout: ()
        => Promise<void>;
    update: (updatedUser: Partial<User>)
        => Promise<{ success: boolean; message?: string }>;
}
