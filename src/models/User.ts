export interface User {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    gender: string;
    password: string;
    avatarURL: string;
    coverURL: string;
    dob: string;
    isOnline: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

const requiredFields: (keyof User)[] = [
    'id',
    'name',
    'email',
    'phone',
    'gender',
    'password',
    'avatarURL',
    'coverURL',
    'dob',
    'isOnline',
    'createdAt',
    'updatedAt'
];

export const isUserComplete = (user: Partial<User>): user is User => {
    return requiredFields.every(field => field in user);
}
