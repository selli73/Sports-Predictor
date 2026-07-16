import { Controller, Get } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get('matches')
  saveUpcomingMatches() {
    return this.footballService.scrapeFlashScoreMatchesUpcomingWorldChempionship();
  }

  @Get('finishedMatch')
  saveFinishedMatches() {
    return this.footballService.scrapeFlashScoreMatchesFinishedWorldChempionship();
  }
}
