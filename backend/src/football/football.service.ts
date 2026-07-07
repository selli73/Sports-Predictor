import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';

@Injectable()
export class FootballService {
    constructor(private _prismaService: PrismaService, private readonly _configService: ConfigService, private readonly httpService: HttpService) {}


    async scrapeFlashScore() {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            const url = 'https://www.flashscore.com/football/world/world-championship/';
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });
            const html = await page.content();

            const cheer = load(html);
            const scrapedMatches: { homeTeam: string; awayTeam: string; timeStr: string }[] = [];
            cheer('.event__match').each((index, element) => {
                const homeTeam = cheer(element).find('.event__participant--home').text().trim();
                const awayTeam = cheer(element).find('.event__participant--away').text().trim();
                const timeStr = cheer(element).find('.event__time').text().trim();

                if (homeTeam && awayTeam) {
                    scrapedMatches.push({
                        homeTeam,
                        awayTeam,
                        timeStr
                    });
                }
                
            })
            console.log('Найдено матчей: ',scrapedMatches.length);

            for (const match of scrapedMatches) {
                const homeTeamEntity = await this._prismaService.team.upsert({
                    where: { name: match.homeTeam },
                    update: {  },
                    create: { name: match.homeTeam,  }
                });

                const awayTeamEntity = await this._prismaService.team.upsert({
                    where: { name: match.awayTeam },
                    update: {  },
                    create: { name: match.awayTeam }
                });

                const matchId = `${homeTeamEntity.id}-${awayTeamEntity.id}-2026`;
                const [dayMonth, time] = match.timeStr.split(' ');
                const [day, month] = dayMonth.split('.');
                const [hours, minutes] = time.split(':');
                const matchDate = new Date(2026, Number(month) - 1, Number(day), Number(hours), Number(minutes));
                await this._prismaService.match.upsert({
                    where: { id: matchId },
                    update: {},
                    create: { homeTeamId: homeTeamEntity.id, awayTeamId: awayTeamEntity.id, startAt: matchDate, status: 'UPCOMING' }
                });

                return {
                    success: true,
                    count: scrapedMatches.length
                };
            }

        } catch(error) {
            console.log(error);

        } finally {
            await browser.close();
        }
    }
}