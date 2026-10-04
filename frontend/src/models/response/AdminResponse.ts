// POST /football/* возвращает { seccuss, count } (опечатка на стороне backend),
// POST /gemini/ai-probability и /points/add — { message }
export interface AdminResponse {
    message?: string;
    seccuss?: boolean;
    count?: number;
    answer?: string;
}
