export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    avatarURL: string;
    coverURL: string;
    dob: number;
    isOnline: boolean;
    createdAt: number;
    updatedAt: number;
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
