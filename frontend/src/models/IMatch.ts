import type { IMatchTeam, ITeam } from "./ITeam";

export type MatchOutcome = 'HOME' | 'AWAY' | 'DRAW';

export type MatchStatus = 'UPCOMING' | 'IN_PROGRESS' | 'HALF_TIME' | 'EXTRA_TIME' | 'PENALTIES' | 'FINISHED';

export type MatchFinishType = 'REGULAR' | 'PENALTIES';

export type Tournament = 'WORLD_CHAMPIONSHIP' | 'NPL_ACT';

export interface IMatchAIPrediction {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    model: 'GEMINI';
}

// GET /match/upcoming
export interface IUpcomingMatch {
    id: string;
    matchKey: string;
    homeTeamId: string;
    awayTeamId: string;
    startAt: string;
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
    matchAIPrediction: IMatchAIPrediction[];
}

// Матч целиком, как он приходит внутри GET /predictions/my
export interface IMatch {
    id: string;
    matchKey: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeam: ITeam;
    awayTeam: ITeam;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
    homePenaltyScore: number | null;
    awayPenaltyScore: number | null;
    outcome: MatchOutcome | null;
    finishType: MatchFinishType | null;
    tournament: Tournament;
    status: MatchStatus;
    startAt: string;
    isCalculated: boolean;
    createdAt: string;
    updatedAt: string;
}
