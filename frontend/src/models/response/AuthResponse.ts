import type { IUser } from "../IUser";

export interface AuthResponse {
    access_token: string;
}

export interface ProfileResponse {
    message: string;
    user: IUser;
}

export interface ResetCodeResponse {
    resetToken: string;
}

export interface MessageResponse {
    message: string;
}
