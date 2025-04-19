import {useAuth} from '@/src/contexts/UserContext';
import {Profile} from '@/src/models/Profile';
import {User} from "@/src/models/User";

export function useUser() {
    const {user} = useAuth();

    const isAuthenticated = !!user;

    const profile = user ? (({password, createdAt, updatedAt, ...profileData}) =>
        profileData as Profile)(user as User) : null;

    return {user, isAuthenticated, profile};
}
