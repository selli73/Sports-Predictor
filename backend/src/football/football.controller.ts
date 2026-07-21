import { Controller, Post } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Post('upcomingMatchesNplAct')
  importUpcomingMatchesNplAct() {
    return this.footballService.importUpcomingMatchesNplAct();
  }

  @Post('finishedMatchesNplAct')
  importFineshedNplActMatches() {
    return this.footballService.importFinishedMatchesNplAct();
  }
}
