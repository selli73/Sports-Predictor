import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { FootballService } from '../football/football.service';
import { PrismaService } from '../prisma/prisma.service';
import { PredictionModel } from '@prisma/client';

@Injectable()
export class GeminiService {
    
    private _ai: GoogleGenAI;

    constructor(private _configService: ConfigService, private _footballService: FootballService, private _prisma: PrismaService ) {
        this._ai = new GoogleGenAI({
            apiKey: _configService.getOrThrow('GEMINI_API_KEY')
        });
    }

    async aiMatchProbability() {
        try {

            const matches = await this._footballService.getUpcomingMatches();

            const prompt = this._configService.getOrThrow('PROMPT_GEMINI') + JSON.stringify(matches);

            const interaction = await this._ai.interactions.create({
            model: 'gemini-3.5-flash',
            input: prompt});

            for (const match of JSON.parse(interaction.output_text!)) {
                await this._prisma.matchAIPrediction.upsert({
                    where: { matchId_model: {
                        matchId: match.matchId,
                        model: PredictionModel.GEMINI
                    }},
                    create: {
                        matchId: match.matchId,
                        homeWinProbability: match.homeWin,
                        drawProbability: match.draw,
                        awayWinProbability: match.awayWin,
                        model: PredictionModel.GEMINI
                    },
                    update: {
                        homeWinProbability: match.homeWin,
                        drawProbability: match.draw,
                        awayWinProbability: match.awayWin
                    }
                })
            }

            return {
                message: 'Вероятность матчей успешна записана',
                answer: interaction.output_text
            };
        } catch (err) {
            throw new InternalServerErrorException('Failed to communicate with Gemini API');            
        }
    }
}
