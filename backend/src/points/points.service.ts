import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchStatus } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PointsService {
    
    constructor(private _prismaService: PrismaService, @Inject(CACHE_MANAGER) private _cacheManager: Cache) {}
    
    @Cron(CronExpression.EVERY_10_MINUTES)
    async addPoints() {
        const finishedMatches = await this._prismaService.match.findMany({
            where: {
                status: MatchStatus.FINISHED,
                isCalculated: false
            }
        });

        if (finishedMatches.length === 0) {
            return {
                message: 'Нет завершенных матчей для расчета'
            };
        }

        for (const match of finishedMatches) {

            if (!match.outcome) {
                continue;
            }
            
            const matchPredictions = await this._prismaService.prediction.findMany({
                where: {
                    matchId: match.id,
                    outcome: match.outcome
                }
            });

            if (matchPredictions.length === 0) {
                await this._prismaService.match.update({
                    where: { id: match.id },
                    data: { isCalculated: true }
                })

                continue;
            }

            await this._prismaService.$transaction(async (tx) => {
                
                await tx.match.update({
                    where: {
                        id: match.id
                    },
                    data: {
                        isCalculated : true
                    }
                });

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
            });
        }
        
        await this._cacheManager.del('leaderboard')

        return {
            message: 'Баллы успешно добавлены'
        };
    }
}