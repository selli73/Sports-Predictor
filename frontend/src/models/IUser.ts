export type Role = 'USER' | 'ADMIN';

export interface IUser {
    userId: string;
    email: string;
    role: Role;
}
