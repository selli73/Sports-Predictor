import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { InteractionGeminiDto } from './dto/gemini.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ask')
  aiInteraction(@Body() dto: InteractionGeminiDto) {
    return this.geminiService.sendPrompt(dto.prompt);
  }
}
