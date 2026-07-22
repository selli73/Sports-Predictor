import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [MatchModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
