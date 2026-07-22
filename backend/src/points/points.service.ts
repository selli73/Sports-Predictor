import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class PointsService {
    
    constructor(private _prismaService: PrismaService) {}
    
    @Cron(CronExpression.EVERY_10_MINUTES)
    async addPoints() {
        const finishedMatches = await this._prismaService.match.findMany({
            where: {
                status: MatchStatus.FINISHED,
                isCalculated: false
            }
        });

        if (!finishedMatches) {
            throw new NotFoundException('Завершенных матчей нет')
        }

        for (const match of finishedMatches) {

            if (!match.outcome) {
                continue;
            }
            const matchPredictions = await this._prismaService.prediction.findMany({
                where: {
                    matchId: match.id,
                    outcome: match.outcome,
                    pointsWon: 0
                }
            });

            await this._prismaService.$transaction(async (tx) => {
                for (const prediction of matchPredictions) {                    
                    await tx.prediction.update({
                        where: {
                            id: prediction.id
                        },
                        data: {
                            pointsWon: 10

                        }
                    });

                    await tx.user.update({
                        where: {
                            id: prediction.userId
                        },
                        data: {
                            totalPoints: {
                                increment: 10
                            }
                        }
                    });
                }

                await tx.match.update({
                    where: {
                        id: match.id
                    },
                    data: {
                        isCalculated : true
                    }
                });
            });                            
        }

        return {
            message: 'Баллы успешно добавлены'
        };
    }
}
