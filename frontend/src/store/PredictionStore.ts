import { makeAutoObservable } from "mobx";
import type { MatchOutcome } from "../models/IMatch";
import type { IPrediction } from "../models/IPrediction";
import PredictionService from "../services/PredictionService";
import { getErrorMessage } from "../http";

export default class PredictionStore {
    predictions: IPrediction[] = [];
    isLoading = false;
    error = '';

    constructor() {
        makeAutoObservable(this);
    }

    get predictionByMatchId() {
        return new Map(this.predictions.map(prediction => [prediction.matchId, prediction]));
    }

    get stats() {
        const finished = this.predictions.filter(prediction => prediction.match.status === 'FINISHED');
        const correct = finished.filter(prediction => prediction.match.outcome === prediction.outcome);

        return {
            total: this.predictions.length,
            finished: finished.length,
            correct: correct.length,
            points: this.predictions.reduce((sum, prediction) => sum + prediction.pointsWon, 0)
        };
    }

    private setPredictions(predictions: IPrediction[]) {
        this.predictions = predictions;
    }

    private setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    private setError(error: string) {
        this.error = error;
    }

    async getMyPredictions() {
        try {
            this.setLoading(true);
            this.setError('');
            const response = await PredictionService.getMy();
            this.setPredictions(response.data);
        } catch (error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить прогнозы'));
        } finally {
            this.setLoading(false);
        }
    }

    async createPrediction(matchId: string, outcome: MatchOutcome) {
        await PredictionService.create(matchId, outcome);
        await this.getMyPredictions();
    }
}
