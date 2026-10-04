import type { AxiosResponse } from "axios";
import api from "../http";
import type { MatchOutcome } from "../models/IMatch";
import type { IPrediction } from "../models/IPrediction";

export default class PredictionService {
    static create(matchId: string, outcome: MatchOutcome) {
        return api.post('/predictions/createPrediction', {
            matchId,
            outcome
        });
    }

    static getMy(): Promise<AxiosResponse<IPrediction[]>> {
        return api.get('/predictions/my');
    }
}
