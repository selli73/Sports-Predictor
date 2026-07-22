import { Controller, Post, UseGuards } from '@nestjs/common';
import { FootballService } from './football.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../roles/decorators/roles.decorator';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';

@Controller('football')
@ApiBearerAuth()
@Roles(Role.ADMIN) @UseGuards(JwtAuthGuard, RolesGuard)
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Post('upcomingMatchesNplAct')
  @ApiOperation({ summary: 'Recording of upcoming matches', description: 'Recording upcoming matches from Flashscore NPL ACT Australia' })
  importUpcomingMatchesNplAct() {
    return this.footballService.importUpcomingMatchesNplAct();
  }

  @Post('finishedMatchesNplAct')
  @ApiOperation({ summary: 'Recording of finished matches', description: 'Recording finished matches from Flashscore NPL ACT Australia' })
  importFineshedNplActMatches() {
    return this.footballService.importFinishedMatchesNplAct();
  }
}
