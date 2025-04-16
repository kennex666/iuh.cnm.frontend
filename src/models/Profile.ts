export interface Profile {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    gender: string;
    avatarURL: string;
    coverURL: string;
    dob: string;
    isOnline: boolean;
}
