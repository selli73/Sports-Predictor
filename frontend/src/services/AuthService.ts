import type { AxiosResponse } from "axios";
import api, { RESET_TOKEN_KEY } from "../http";
import type { AuthResponse, MessageResponse, ProfileResponse, ResetCodeResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post('/user/login', {
            email,
            password
        });
    }

    static register(email: string, password: string, name?: string, phone?: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post('/user/register', {
            email,
            password,
            name,
            phone
        });
    }

    static profile(): Promise<AxiosResponse<ProfileResponse>> {
        return api.get('/profile/me');
    }

    static changePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<MessageResponse>> {
        return api.patch('/user/change-password', {
            oldPassword,
            newPassword
        });
    }

    static forgotPassword(email: string): Promise<AxiosResponse<MessageResponse>> {
        return api.post('/user/forgot-password', {
            email
        });
    }

    static verifyResetCode(email: string, code: string): Promise<AxiosResponse<ResetCodeResponse>> {
        return api.post('/user/reset-code-verification', {
            email,
            code
        });
    }

    static resetPassword(newPassword: string): Promise<AxiosResponse<MessageResponse>> {
        return api.post('/user/reset-password', {
            newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(RESET_TOKEN_KEY)}`
            }
        });
    }
}
