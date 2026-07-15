import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { GeminiModule } from './gemini/gemini.module';
import { FootballModule } from './football/football.module';
import { PredictionsModule } from './predictions/predictions.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), ScheduleModule.forRoot(),
  PrismaModule, UserModule, MailModule, GeminiModule, FootballModule, PredictionsModule],
})
export class AppModule {}