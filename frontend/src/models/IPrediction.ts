import type { IMatch, MatchOutcome } from "./IMatch";

export interface IPrediction {
    id: string;
    userId: string;
    matchId: string;
    outcome: MatchOutcome;
    pointsWon: number;
    createAt: string;
    match: IMatch;
}
