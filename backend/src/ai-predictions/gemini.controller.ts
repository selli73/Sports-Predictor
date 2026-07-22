import { Controller, Post, UseGuards } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('gemini')
@ApiBearerAuth()
@Roles(Role.ADMIN) @UseGuards(JwtAuthGuard, RolesGuard) 
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ai-probability')
  @ApiOperation({ summary: 'Calculating the probability of a match outcome' }) @ApiResponse({ status: 201, description: 'The probability of matches being successful is recorded' })
  aiInteraction() {
    return this.geminiService.aiMatchProbability();
  }
}