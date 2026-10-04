import { makeAutoObservable } from "mobx";
import axios from "axios";
import type { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import { ACCESS_TOKEN_KEY, RESET_TOKEN_KEY } from "../http";

export default class AuthStore {
    user: IUser | null = null;
    isAuth = false;
    isCheckingAuth = true;

    constructor() {
        makeAutoObservable(this);
    }

    get isAdmin() {
        return this.user?.role === 'ADMIN';
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser | null) {
        this.user = user;
    }

    setCheckingAuth(bool: boolean) {
        this.isCheckingAuth = bool;
    }

    async login(email: string, password: string) {
        const response = await AuthService.login(email, password);
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
        await this.profile();
    }

    async register(email: string, password: string, name: string, phone: string) {
        // name и phone необязательные — пустые строки не отправляем
        const response = await AuthService.register(email, password, name || undefined, phone || undefined);
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
        await this.profile();
    }

    async profile() {
        const response = await AuthService.profile();
        this.setUser(response.data.user);
        this.setAuth(true);
    }

    async checkAuth() {
        if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
            this.setCheckingAuth(false);
            return;
        }

        try {
            await this.profile();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                this.logout();
            }
        } finally {
            this.setCheckingAuth(false);
        }
    }

    async changePassword(oldPassword: string, newPassword: string) {
        const response = await AuthService.changePassword(oldPassword, newPassword);
        return response.data;
    }

    async forgotPassword(email: string) {
        const response = await AuthService.forgotPassword(email);
        return response.data;
    }

    async verifyResetCode(email: string, code: string) {
        const response = await AuthService.verifyResetCode(email, code);
        sessionStorage.setItem(RESET_TOKEN_KEY, response.data.resetToken);
    }

    async resetPassword(newPassword: string) {
        const response = await AuthService.resetPassword(newPassword);
        sessionStorage.removeItem(RESET_TOKEN_KEY);
        return response.data;
    }

    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        this.setAuth(false);
        this.setUser(null);
    }
}
