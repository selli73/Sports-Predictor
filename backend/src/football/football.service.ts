import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import { MatchFinishType, MatchStatus, MatchWinner } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FootballService {
    constructor(private _prismaService: PrismaService, private readonly _configService: ConfigService) {}

    async getUpcomingMatches() {
        const matches = await this._prismaService.match.findMany({
            where: { status: MatchStatus.UPCOMING },
            select: {
                id: true,
                startAt: true,
                homeTeam: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                awayTeam: {
                    select: {
                        id: true,
                        name: true
                    }
                }

            }
        });

        const result = await Promise.all(matches.map(async (match) => {
            const quantityWinHome = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.homeTeam.id,
                            winner: MatchWinner.HOME
                        },
                        {
                            awayTeamId: match.homeTeam.id,
                            winner: MatchWinner.AWAY
                        },                        
                    ]
                }
            });

            const quanttyLossesHome = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.homeTeam.id,
                            winner: MatchWinner.AWAY
                        },
                        {
                            awayTeamId: match.homeTeam.id,
                            winner: MatchWinner.HOME
                        }
                    ]
                }
            });

            const quantityDraftHome = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.homeTeam.id,
                            winner: MatchWinner.DRAW
                        },
                        {
                            awayTeamId: match.homeTeam.id,
                            winner: MatchWinner.DRAW
                        }
                    ]
                }
            });

            const quantityWinAway = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.awayTeam.id,
                            winner: MatchWinner.HOME
                        },
                        {
                            awayTeamId: match.awayTeam.id,
                            winner: MatchWinner.AWAY
                        }
                    ]
                }
            });

            const quantityLossesAway = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.awayTeam.id,
                            winner: MatchWinner.AWAY
                        },
                        {
                            awayTeamId: match.awayTeam.id,
                            winner: MatchWinner.HOME
                        }
                    ]
                }
            });

            const quantityDrawAway = await this._prismaService.match.count({
                where: {
                    status: MatchStatus.FINISHED,
                    OR: [
                        {
                            homeTeamId: match.awayTeam.id,
                            winner: MatchWinner.DRAW
                        },
                        {
                            awayTeamId: match.awayTeam.id,
                            winner: MatchWinner.DRAW
                        }
                    ]
                }
            });

            return {
                matchId: match.id,
                startAt: match.startAt,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                quantityWinHome,
                quanttyLossesHome,
                quantityDraftHome,
                quantityWinAway,
                quantityLossesAway,
                quantityDrawAway
            };
        }));

        return result;
    }


    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async scrapeFlashScoreMatchesUpcomingWorldChempionship() {
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
            const url = this._configService.getOrThrow('URL_WORLD_CUP_2026');
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });

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

            for (const match of scrapedMatches) {
                const homeTeamEntity = await this._prismaService.team.upsert({
                    where: { name: match.homeTeam },
                    update: {},
                    create: { name: match.homeTeam }
                });
                const awayTeamEntity = await this._prismaService.team.upsert({
                    where: { name: match.awayTeam },
                    update: {},
                    create: { name: match.awayTeam }
                });

                const [dayMonth, time] = match.startDate.split(' ');
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


    async scrapeFlashScoreMatchesFinishedWorldChempionship() {
        
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: '/usr/bin/google-chrome',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        
        try {            
            const page = await browser.newPage();    
            const url = this._configService.getOrThrow('URL_ALL_WORLD_CUP_MATCHES_2026');
            
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });

            const html = await page.content();
            
            const $ = load(html);

            const scrapedMatches: { homeTeam: string, awayTeam: string, startDate: string, scoreHome: number, scoreAway: number, homePenaltyScore: string | null, awayPenaltyScore: string | null, penaltiesPlayed: boolean, result: MatchWinner}[] = [];
            $('div[id^="g_1_"]').each((index, element) => {

                const homeBlock = $(element).find('.event__homeParticipant');
                const awayBlock = $(element).find('.event__awayParticipant');

                const scoreHome = Number($(element).find('.event__score--home').contents().first().text().trim());
                const scoreAway = Number($(element).find('.event__score--away').contents().first().text().trim());
                const homePenaltyScore = $(element).find('.event__score--home sup').text().replace(/[()]/g, '');
                const awayPenaltyScore = $(element).find('.event__score--away sup').text().replace(/[()]/g, '');
                const penaltiesPlayed = homePenaltyScore.length > 0 && awayPenaltyScore.length > 0;
                
                const homeTeam = homeBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();
                const awayTeam = awayBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();

                let result: MatchWinner;
                if (penaltiesPlayed) {
                    if (Number(homePenaltyScore) > Number(awayPenaltyScore)) {
                        result = MatchWinner.HOME;
                    } else {
                        result = MatchWinner.AWAY;
                    }
                }
                else {
                    if (scoreHome > scoreAway) {
                        result = MatchWinner.HOME;
                    } else if (scoreAway > scoreHome) {
                        result = MatchWinner.AWAY;
                    }
                    else {
                        result = MatchWinner.DRAW;
                    }
                }                

                const startDate = $(element).find('span[data-testid="wcl-stageTime"]').text().trim().replace(/[A-Za-z]+/g, '');
                if (homeTeam && awayTeam) {
                    scrapedMatches.push({
                        homeTeam,
                        awayTeam,
                        startDate,
                        scoreHome,
                        scoreAway,
                        homePenaltyScore,
                        awayPenaltyScore,
                        penaltiesPlayed,
                        result
                    });
                }
            })

            for (const match of scrapedMatches) {
                const homeTeamEntity = await this._prismaService.team.upsert({
                    where: {
                        name: match.homeTeam
                    },
                    create: {
                        name: match.homeTeam                        
                    },
                    update: { }
                });

                const awayTeamEntity = await this._prismaService.team.upsert({
                    where: {
                        name: match.awayTeam
                    },
                    create: {
                        name: match.awayTeam
                    },
                    update: { }
                });

                const [date, time] = match.startDate.split(' ');
                const [day, month] = date.split('.');
                const [hours, minutes] = time.split(':');
                const matchKey = `${homeTeamEntity.id}-${awayTeamEntity.id}-2026-${month}-${day}`;
                const matchDate = new Date(2026, Number(month) - 1, Number(day), Number(hours), Number(minutes));

                await this._prismaService.match.upsert({
                    where: { matchKey },
                    create: {
                        matchKey,
                        homeTeamId: homeTeamEntity.id,
                        awayTeamId: awayTeamEntity.id,
                        status: MatchStatus.FINISHED,
                        startAt: matchDate,
                        homeTeamScore: match.scoreHome,
                        awayTeamScore: match.scoreAway,
                        homePenaltyScore: match.penaltiesPlayed ? Number(match.homePenaltyScore) : null,
                        awayPenaltyScore: match.penaltiesPlayed ? Number(match.awayPenaltyScore) : null,
                        finishType: match.penaltiesPlayed ? MatchFinishType.PENALTIES : MatchFinishType.REGULAR,
                        winner: match.result  
                    },
                    update: { }
                })
            }            
        } catch(error) {
            console.log(error);
        } finally {
            browser.close();
        }
    }
}