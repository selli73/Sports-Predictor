import { Controller, Post, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';

@Controller('points')
@ApiBearerAuth()
@Roles(Role.ADMIN) @UseGuards(JwtAuthGuard, RolesGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('add')
  @ApiOperation({ summary: 'Scoring points for correct match prediction' })
  @ApiResponse({ status: 201, description: 'Points added successfully' }) @ApiResponse({ status: 404, description: 'There are no completed matches' })
  addPoint() {
    return this.addPoint();
  }
}
