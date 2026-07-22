import { Controller, Post, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';

@Controller('points')
@UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('add')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Scoring points for correct match prediction' })
  @ApiResponse({ status: 201, description: 'Points added successfully' })
  addPoint() {
    return this.pointsService.addPoints();
  }
}
