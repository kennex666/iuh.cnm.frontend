import {useAuth} from '@/src/contexts/userContext';

export function useUser() {
    const {user} = useAuth();

    return {
        user,
        isAuthenticated: !!user,
        profile: user ? {
            id: user.id,
            name: user.name,
            avatarURL: user.avatarURL,
            coverURL: user.coverURL,
            phone: user.phone,
            email: user.email
        } : null
    };
}