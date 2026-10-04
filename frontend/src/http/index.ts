import axios from "axios";

export const API_URL = import.meta.env.VITE_API_BACKEND_URL;
console.log(API_URL);
export const ACCESS_TOKEN_KEY = 'access_token';
export const RESET_TOKEN_KEY = 'resetToken';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(response => response, error => {
    const isAuthRequest = error.config?.url?.startsWith('/user/');

    // Токен истек (живет 1 день) — выходим и отправляем на страницу входа
    if (error.response?.status === 401 && !isAuthRequest && localStorage.getItem(ACCESS_TOKEN_KEY)) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.location.assign('/login');
    }

    return Promise.reject(error);
});

export function getErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) {
        return 'Произошла неизвестная ошибка';
    }

    // Нет ответа или proxy Vite вернул пустую 5xx — backend не запущен
    if (!error.response || (error.response.status >= 500 && !error.response.data)) {
        return 'Сервер недоступен. Проверьте, что backend запущен';
    }

    // ValidationPipe возвращает message массивом строк
    const message = error.response.data?.message;

    if (Array.isArray(message)) {
        return message.join(', ');
    }

    return message || fallback;
}

export default api;
