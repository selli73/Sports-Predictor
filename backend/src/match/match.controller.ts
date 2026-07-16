import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('upcoming')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  getMatchesUpcoming(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
    return this.matchService.getMatchesUpcoming(page, limit);
  }
}
