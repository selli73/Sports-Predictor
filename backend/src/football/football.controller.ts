import { Controller, Get } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get('matches')
  getUpcomingMatches() {
    return this.footballService.scrapeFlashScoreWorldChempionship();
  }
}
