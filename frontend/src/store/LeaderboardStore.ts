import { makeAutoObservable } from "mobx";
import type { ILeaderboardUser } from "../models/ILeaderboard";
import LeaderboardService from "../services/LeaderboardService";
import { getErrorMessage } from "../http";

export default class LeaderboardStore {
    leaders: ILeaderboardUser[] = [];
    isLoading = false;
    error = '';

    constructor() {
        makeAutoObservable(this);
    }

    private setLeaders(leaders: ILeaderboardUser[]) {
        this.leaders = leaders;
    }

    private setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    private setError(error: string) {
        this.error = error;
    }

    async getLeaderboard() {
        try {
            this.setLoading(true);
            this.setError('');
            const response = await LeaderboardService.getLeaderboard();
            this.setLeaders(response.data);
        } catch (error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить рейтинг'));
        } finally {
            this.setLoading(false);
        }
    }
}
