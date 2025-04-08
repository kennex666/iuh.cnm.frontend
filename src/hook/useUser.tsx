import {useAuth} from '@/src/contexts/userContext';

export function useUser() {
    const {user} = useAuth();

    return {
        user,
        isAuthenticated: !!user,
        profile: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            avatarURL: user.avatarURL,
            coverURL: user.coverURL,
            dob: user.dob,
            isOnline: user.isOnline,
        } : null
    };
}
