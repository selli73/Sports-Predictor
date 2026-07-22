import { Controller, Post, UseGuards } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('gemini')
@UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth()
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ai-probability')
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Calculating the probability of a match outcome' }) @ApiResponse({ status: 201, description: 'The probability of matches being successful is recorded' })
  aiInteraction() {
    return this.geminiService.aiMatchProbability();
  }
}