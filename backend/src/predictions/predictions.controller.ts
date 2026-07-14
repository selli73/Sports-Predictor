import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import type { IJwtUserRequest } from '../user/typings';

@Controller('predictions')
@UseGuards(JwtAuthGuard)
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post('createPrediction')
  create(@Req() req: IJwtUserRequest, dto: CreatePredictionDto) {
    return this.predictionsService.create(req.user.userId, dto);
  }

  @Get('my')
  getMyPrediction(@Req() req: IJwtUserRequest) {
    return this.predictionsService.getUserPredictions(req.user.userId);
  }
}
