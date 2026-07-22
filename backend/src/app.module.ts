import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { GeminiModule } from './ai-predictions/gemini.module';
import { FootballModule } from './football/football.module';
import { PredictionsModule } from './predictions/predictions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchModule } from './match/match.module';
import { PointsModule } from './points/points.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), ScheduleModule.forRoot(),
  CacheModule.register({
    isGlobal: true,
    stores: [new KeyvRedis('redis://localhost:6379')]
  }),
  PrismaModule, UserModule, MailModule, GeminiModule, FootballModule, PredictionsModule, MatchModule, PointsModule, LeaderboardModule],
})
export class AppModule {}