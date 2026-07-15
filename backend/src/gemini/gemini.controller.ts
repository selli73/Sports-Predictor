import { Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ai-probability')
  aiInteraction() {
    return this.geminiService.aiMatchProbability();
  }
}
