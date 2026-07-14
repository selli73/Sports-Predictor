import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
@Injectable()
export class FootballService {
    constructor(private _prismaService: PrismaService, private readonly _configService: ConfigService) {}

    async scrapeFlashScoreWorldChempionship() {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        try {
            const page = await browser.newPage();    
            const url = 'https://www.flashscore.com/football/world/world-championship/';
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });

            await page.waitForSelector('.event__match');

            const html = await page.content();
            const cheer = load(html);

            const scrapedMatches: { homeTeam: string, awayTeam: string, startDate: string }[] = [];
            const latestScoresSection = cheer('h2:contains("Latest Scores")').closest('section');
            const todayMatchesSection = cheer(`h2:contains(Today's Matches)`).closest('section');
            cheer('[id^="g_1_"]').each((index, element) => {

                if (latestScoresSection.length && latestScoresSection.has(element).length > 0) {
                    return;
                }

                const homeBlock = cheer(element).find('.event__homeParticipant');
                const awayBlock = cheer(element).find('.event__awayParticipant');

                const homeTeam = homeBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();
                const awayTeam = awayBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();

                let startDate: string;
                const now = new Date();
                if (todayMatchesSection.length && todayMatchesSection.has(element).length > 0) {
                    startDate = now.getDate() + '.' + (now.getMonth() + 1 > 9? now.getMonth() + 1 : '0'+ (now.getMonth() + 1)) + '. ' + cheer(element).find('span[data-testid="wcl-stageTime"]').text().trim();
                } else {
                    startDate = cheer(element).find('span[data-testid="wcl-stageTime"]').text().trim();                
                }
                
                
                if (homeTeam && awayTeam) {
                    scrapedMatches.push({
                    homeTeam,
                    awayTeam,
                    startDate
                });
                }
            });
            
            console.log(scrapedMatches);

            for (const element of scrapedMatches) {
                const homeTeamEntity = await this._prismaService.team.upsert({
                    where: { name: element.homeTeam },
                    update: {},
                    create: { name: element.homeTeam }
                });
                const awayTeamEntity = await this._prismaService.team.upsert({
                    where: { name: element.awayTeam },
                    update: {},
                    create: { name: element.awayTeam }
                });

                const [dayMonth, time] = element.startDate.split(' ');
                const [day, month] = dayMonth.split('.');
                const [hours, minutes] = time.split(':');
                const matchKey = `${homeTeamEntity.id}-${awayTeamEntity.id}-2026-${month}-${day}`;
                const matchDate = new Date(2026, Number(month) - 1, Number(day), Number(hours), Number(minutes));

                await this._prismaService.match.upsert({
                    where: { matchKey },
                    update: { },
                    create: {
                        matchKey,
                        homeTeamId: homeTeamEntity.id,
                        awayTeamId: awayTeamEntity.id,
                        status: 'UPCOMING',
                        startAt: matchDate,
                    }
                });
            }

            return {
                success: true,
                count: scrapedMatches.length
            };
        } catch(error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }
}