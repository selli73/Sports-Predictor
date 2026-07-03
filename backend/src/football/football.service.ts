import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { load } from 'cheerio';

@Injectable()
export class FootballService {
    constructor(private _prismaService: PrismaService, private readonly _configService: ConfigService, private readonly httpService: HttpService) {}

    // async getWorldCupMatches() {
    //     try { 
    //         const response = await firstValueFrom(this.httpService.get('get/games',{
    //         method: 'get',
    //         baseURL: this._configService.getOrThrow('URL_WORLD_CUP_2026'),
    //         }));
            
    //         const { games } = response.data;
            
    //         const upcomingGames = games.filter((game) => {                
    //             return game.finished === 'FALSE'
    //         }).sort((a, b) => {
    //             return new Date(a.local_date).getTime() - new Date(b.local_date).getTime()
    //         });

    //         return {
    //             status: response.status,
    //             text: response.statusText,                        
    //             data: upcomingGames
    //         }; 
    //     } catch (error) {
    //         console.log(error);
    //         if (isAxiosError(error)) {
    //             throw new HttpException(error.response?.data ?? 'World Cup API error', error.response?.status ?? HttpStatus.BAD_GATEWAY);
    //         }
    //         throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async getInformation() {
        const response = await firstValueFrom(this.httpService.get('https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
            {
                headers: {
                    'User-Agent': 'SportsPredictorBot/1.0 (aabulath@gmail.com)',
                },
            }
        ));
        
        const test = load(response.data);
        console.log(test('ul li a').text());
        
        return {
            data: response.data
        };
    }
}