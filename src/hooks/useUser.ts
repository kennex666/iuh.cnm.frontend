import {useAuth} from '@/src/contexts/userContext';
import {Profile} from '@/src/models/Profile';

export function useUser() {
    const {user} = useAuth();

    // Kiểm tra xem người dùng đã được xác thực hay chưa
    const isAuthenticated = !!user;

    // Nếu người dùng đã được xác thực, tạo một đối tượng profile từ thông tin của người dùng
    const profile = user ? ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        avatarURL: user.avatarURL,
        coverURL: user.coverURL,
        dob: user.dob,
        isOnline: user.isOnline,
    } as Profile) : null;

    return {user, isAuthenticated, profile};
}