import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { FootballModule } from '../football/football.module';

@Module({
  imports: [FootballModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
