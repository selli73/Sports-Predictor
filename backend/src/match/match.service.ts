import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus, MatchWinner } from '@prisma/client';

@Injectable()
export class MatchService {
    
    constructor(private _prismaService: PrismaService) {}

    async getMatchesUpcoming(page: number, limit: number) {
        const matches = await this._prismaService.match.findMany({
            relationLoadStrategy: 'join',
            where: {
                status: MatchStatus.UPCOMING
            },
            select: {
                id: true,
                matchKey: true,
                homeTeamId: true,
                awayTeamId: true,
                startAt: true,
                homeTeam: {
                    select: {
                        name: true,
                        country: true,
                        logo: true,
                        players: true
                    }
                },
                awayTeam: {
                    select: {
                        name: true,
                        country: true,
                        logo: true,
                        players: true
                    }
                },
                matchAIPrediction: {
                    select: {
                        homeWinProbability: true,
                        drawProbability: true,
                        awayWinProbability: true,
                        model: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { startAt: 'asc' }
        });

        return matches;
    }

    async getUpcomingMatchesFromDB() {
            const matches = await this._prismaService.match.findMany({
                where: { status: MatchStatus.UPCOMING },
                select: {
                    id: true,
                    startAt: true,
                    homeTeam: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    awayTeam: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
    
                }
            });
    
            const result = await Promise.all(matches.map(async (match) => {
                const quantityWinHome = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.homeTeam.id,
                                winner: MatchWinner.HOME
                            },
                            {
                                awayTeamId: match.homeTeam.id,
                                winner: MatchWinner.AWAY
                            },                        
                        ]
                    }
                });
    
                const quanttyLossesHome = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.homeTeam.id,
                                winner: MatchWinner.AWAY
                            },
                            {
                                awayTeamId: match.homeTeam.id,
                                winner: MatchWinner.HOME
                            }
                        ]
                    }
                });
    
                const quantityDraftHome = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.homeTeam.id,
                                winner: MatchWinner.DRAW
                            },
                            {
                                awayTeamId: match.homeTeam.id,
                                winner: MatchWinner.DRAW
                            }
                        ]
                    }
                });
    
                const quantityWinAway = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.awayTeam.id,
                                winner: MatchWinner.HOME
                            },
                            {
                                awayTeamId: match.awayTeam.id,
                                winner: MatchWinner.AWAY
                            }
                        ]
                    }
                });
    
                const quantityLossesAway = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.awayTeam.id,
                                winner: MatchWinner.AWAY
                            },
                            {
                                awayTeamId: match.awayTeam.id,
                                winner: MatchWinner.HOME
                            }
                        ]
                    }
                });
    
                const quantityDrawAway = await this._prismaService.match.count({
                    where: {
                        status: MatchStatus.FINISHED,
                        OR: [
                            {
                                homeTeamId: match.awayTeam.id,
                                winner: MatchWinner.DRAW
                            },
                            {
                                awayTeamId: match.awayTeam.id,
                                winner: MatchWinner.DRAW
                            }
                        ]
                    }
                });
    
                return {
                    matchId: match.id,
                    startAt: match.startAt,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    quantityWinHome,
                    quanttyLossesHome,
                    quantityDraftHome,
                    quantityWinAway,
                    quantityLossesAway,
                    quantityDrawAway
                };
            }));
    
            return result;
        }
}