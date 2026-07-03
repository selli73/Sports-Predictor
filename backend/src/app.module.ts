import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { GeminiModule } from './gemini/gemini.module';
import { FootballModule } from './football/football.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), PrismaModule, UserModule, MailModule, GeminiModule, FootballModule],
})
export class AppModule {}
