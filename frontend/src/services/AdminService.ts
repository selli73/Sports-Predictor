import type { AxiosResponse } from "axios";
import api from "../http";
import type { AdminResponse } from "../models/response/AdminResponse";

export default class AdminService {
    static importUpcomingMatches(): Promise<AxiosResponse<AdminResponse>> {
        return api.post('/football/upcomingMatchesNplAct');
    }

    static importFinishedMatches(): Promise<AxiosResponse<AdminResponse>> {
        return api.post('/football/finishedMatchesNplAct');
    }

    static calculateAiProbability(): Promise<AxiosResponse<AdminResponse>> {
        return api.post('/gemini/ai-probability');
    }

    static addPoints(): Promise<AxiosResponse<AdminResponse>> {
        return api.post('/points/add');
    }
}
