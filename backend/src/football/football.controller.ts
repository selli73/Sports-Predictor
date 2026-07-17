import { Controller, Get } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get('upcomingMatches')
  saveUpcomingMatches() {
    return this.footballService.scrapeFlashScoreMatchesUpcomingWorldChempionship();
  }

  @Get('finishedMatches')
  saveFinishedMatches() {
    return this.footballService.scrapeFlashScoreMatchesFinishedWorldChempionship();
  }
}
