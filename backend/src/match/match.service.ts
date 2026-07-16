import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class MatchService {
    
    constructor(private _prisma: PrismaService) {}

    async getMatchesUpcoming(page: number, limit: number) {
        const matches = await this._prisma.match.findMany({
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
}