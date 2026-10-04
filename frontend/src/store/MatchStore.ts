import { makeAutoObservable } from "mobx";
import type { IUpcomingMatch } from "../models/IMatch";
import MatchService from "../services/MatchService";
import { getErrorMessage } from "../http";

const LIMIT = 10;

export default class MatchStore {
    matches: IUpcomingMatch[] = [];
    page = 0;
    hasMore = false;
    isLoading = false;
    error = '';

    constructor() {
        makeAutoObservable(this);
    }

    private setMatches(matches: IUpcomingMatch[]) {
        this.matches = matches;
    }

    private setPage(page: number, received: number) {
        this.page = page;
        // backend не отдает total — если пришла неполная страница, дальше матчей нет
        this.hasMore = received === LIMIT;
    }

    private setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    private setError(error: string) {
        this.error = error;
    }

    async getUpcoming() {
        await this.load(1);
    }

    async loadMore() {
        if (this.isLoading || !this.hasMore) {
            return;
        }

        await this.load(this.page + 1);
    }

    private async load(page: number) {
        try {
            this.setLoading(true);
            this.setError('');
            const response = await MatchService.getUpcoming(page, LIMIT);
            this.setMatches(page === 1 ? response.data : [...this.matches, ...response.data]);
            this.setPage(page, response.data.length);
        } catch (error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить матчи'));
        } finally {
            this.setLoading(false);
        }
    }
}
