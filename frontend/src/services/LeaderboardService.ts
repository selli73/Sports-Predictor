import type { AxiosResponse } from "axios";
import api from "../http";
import type { ILeaderboardUser } from "../models/ILeaderboard";

export default class LeaderboardService {
    static getLeaderboard(): Promise<AxiosResponse<ILeaderboardUser[]>> {
        return api.get('/leaderboard');
    }
}
