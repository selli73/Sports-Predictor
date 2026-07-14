import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PredictionsService {
  constructor(private _prisma: PrismaService) {}

  async create(userId: string, dto: CreatePredictionDto) {
    const match = await this._prisma.match.findUnique({
      where: { id: dto.matchId }
    });

    if (!match) {
      throw new NotFoundException('Матч не найден');
    }

    const now = new Date();

    if (now >= new Date(match.startAt)) {
      throw new BadRequestException('Нельзя сделать, потому что матч уже начался или завершился');
    }

    const existingPrediction = await this._prisma.prediction.findUnique({
      where: { userId_matchId: {
        userId,
        matchId: match.id
      }}
    });

    if (existingPrediction) {
      throw new ConflictException('Вы уже сделали прогноз на этот матч');
    }

    return this._prisma.prediction.create({
      data: {
        userId,
        matchId: match.id,
        outcome: dto.outcome
      }
    });
  }

  getUserPredictions(userId: string) {
    return this._prisma.prediction.findMany({
      where: {
        userId
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        }
      },
      orderBy: {
        createAt: 'desc'
      }
    });
  }
}
