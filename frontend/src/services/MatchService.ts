import type { AxiosResponse } from "axios";
import api from "../http";
import type { IUpcomingMatch } from "../models/IMatch";

export default class MatchService {
    static getUpcoming(page: number, limit: number): Promise<AxiosResponse<IUpcomingMatch[]>> {
        return api.get('/match/upcoming', {
            params: {
                page,
                limit
            }
        });
    }
}
