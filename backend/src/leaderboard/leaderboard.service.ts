import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LeaderboardService {
    
    constructor(private _prismaService: PrismaService, @Inject(CACHE_MANAGER) private _cacheManager: Cache) {}
    
    async getLeaderboard() {
        const cacheData = await this._cacheManager.get('leaderboard');
        
        if (cacheData) {
            return cacheData;
        }
        const leaderboard = await this._prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                totalPoints: true
            },
            orderBy: {
                totalPoints: 'desc'
            },
            take: 10
        });

        await this._cacheManager.set('leaderboard', leaderboard, 1000*60*60);

        return leaderboard;
    }
}