import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('match')
 @ApiBearerAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('upcoming')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Getting upcoming matches' }) @ApiResponse({ status: 404, description: 'Couldnt find any upcoming matches' })
  getMatchesUpcoming(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
    return this.matchService.getMatchesUpcoming(page, limit);
  }
}
