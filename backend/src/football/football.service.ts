import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MatchFinishType, MatchStatus, MatchOutcome, Tournament } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';

@Injectable()
export class FootballService {
    constructor(private _prismaService: PrismaService, private readonly _configService: ConfigService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async importUpcomingMatchesNplAct() {
        const url = this._configService.getOrThrow('URL_NPL_ACT_UPCOMING_MATCHES_2026');
        return this.getUpcomingMatches(url);
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async importFinishedMatchesNplAct() {
        const url = this._configService.getOrThrow('URL_NPL_ACT_RESULT_2026');
        return this.getFinishedMatches(url);
    }

    private async getUpcomingMatches(url: string) {
        const browser = await this.getBrowser();

        try {
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });

            const html = await page.content();

            const $ = load(html);
            const scrapedMatches : { homeTeam: string, awayTeam: string, startDate: string }[] = [];
            const todayMatchesSection = $(`h2:contains(Today's Matches)`).closest('section');
            $('div[id^="g_1_"]').each((index, element) => {
                const homeBlock = $(element).find('.event__homeParticipant');
                const awayBlock = $(element).find('.event__awayParticipant');

                const homeTeam = homeBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();
                const awayTeam = awayBlock.find('span[data-testid="wcl-scores-simple-text-01"]').text().trim();

                let startDate: string;
                const now = new Date();
                if (todayMatchesSection.length && todayMatchesSection.has(element).length > 0) {
                    startDate = now.getDate() + '.' + (now.getMonth() + 1 > 9? now.getMonth() + 1 : '0'+ (now.getMonth() + 1)) + '. ' + $(element).find('span[data-testid="wcl-stageTime"]').text().trim();
                } else {
                    startDate = $(element).find('span[data-testid="wcl-stageTime"]').text().trim();
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
                const homeTeamEntity = await this.getOrCreateTeam(match.homeTeam);
                const awayTeamEntity = await this.getOrCreateTeam(match.awayTeam);

                const matchKey = this.generateMatchKey(homeTeamEntity.id, awayTeamEntity.id, match.startDate);
                const matchDate = this.parseMatchDate(match.startDate);

                await this.saveMatch({ 
                    matchKey, 
                    startAt: matchDate, 
                    status: MatchStatus.UPCOMING, 
                    tournament: Tournament.NPL_ACT, 
                    homeTeamId: homeTeamEntity.id, 
                    awayTeamId: awayTeamEntity.id 
                });
            }

            return {
                seccuss: true,
                count: scrapedMatches.length
            };
        } catch(error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }

    private async getFinishedMatches(url: string) {
        const browser = await this.getBrowser()

        try {
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: 'networkidle2'
            });

            const html = await page.content();
            const $ = load(html);
            const scrapedMatches : { homeTeam: string, awayTeam: string, startDate: string, scoreHome: number, scoreAway: number, homePenaltyScore: string | null, awayPenaltyScore: string | null, penaltiesPlayed: boolean, result: MatchOutcome }[] = [];
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
                
                const result = this.calculateoutcome(penaltiesPlayed, homePenaltyScore, awayPenaltyScore, scoreHome, scoreAway);   
                 
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
            });

            for (const match of scrapedMatches) {
                const homeTeamEntity = await this.getOrCreateTeam(match.homeTeam);
                const awayTeamEntity = await this.getOrCreateTeam(match.awayTeam);
            
                const matchKey = this.generateMatchKey(homeTeamEntity.id, awayTeamEntity.id, match.startDate);
                const matchDate = this.parseMatchDate(match.startDate);

                await this.saveMatch({ matchKey, startAt: matchDate, status: MatchStatus.FINISHED, tournament: Tournament.NPL_ACT, homeTeamId: homeTeamEntity.id, awayTeamId: awayTeamEntity.id, penaltiesPlayed: match.penaltiesPlayed, outcome: match.result, homeTeamScore: match.scoreHome, awayTeamScore: match.scoreAway, homePenaltyScore: match.homePenaltyScore, awayPenaltyScore: match.awayPenaltyScore });                
            }

            return {
                seccuss: true,
                count: scrapedMatches.length
            };
        } catch(error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }

    private async getBrowser() {
        return puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
    }
    

    private async getOrCreateTeam(nameTeam: string) {
        return await this._prismaService.team.upsert({
            where: {
                name: nameTeam
            },
            create: {
                name: nameTeam
            },
            update: { }
        })
    }

    private parseMatchDate(startDate: string) {
        const [dayMonth, time] = startDate.split(' ');
        const [day, month] = dayMonth.split('.');
        const [hours, minutes] = time.split(':');

        return new Date(2026, Number(month) - 1, Number(day), Number(hours), Number(minutes));
    }

    private generateMatchKey(homeTeamId: string, awayTeamId: string, startDate: string) {
        const [date] = startDate.split(' ');
        const [day, month] = date.split('.');

        return `${homeTeamId}-${awayTeamId}-2026-${month}-${day}`;
    }

    private calculateoutcome(penaltiesPlayed: boolean, homePenaltyScore: string, awayPenaltyScore: string, scoreHome: number, scoreAway: number) {
        if (penaltiesPlayed) {
            return Number(homePenaltyScore) > Number(awayPenaltyScore)? MatchOutcome.HOME : MatchOutcome.AWAY;            
        }

        if (scoreHome > scoreAway) return MatchOutcome.HOME;
        if (scoreAway > scoreHome) return MatchOutcome.AWAY;
        
        return MatchOutcome.DRAW;
    }

    private async saveMatch(data: { matchKey: string, startAt: Date, status: MatchStatus, tournament: Tournament, homeTeamId: string, awayTeamId: string,
        penaltiesPlayed?: boolean, outcome?: MatchOutcome,  homeTeamScore?: number, awayTeamScore?: number, homePenaltyScore?: string | null, awayPenaltyScore?: string | null }) {
        await this._prismaService.match.upsert({
            where: {
                matchKey:data.matchKey
            },
            create: {
                matchKey: data.matchKey,
                homeTeamId: data.homeTeamId,
                awayTeamId: data.awayTeamId,
                homeTeamScore: data.homeTeamScore,
                awayTeamScore: data.awayTeamScore,
                homePenaltyScore: data.homePenaltyScore !== null? Number(data.homePenaltyScore) : null,
                awayPenaltyScore: data.awayPenaltyScore !== null? Number(data.awayPenaltyScore) : null,
                outcome: data.outcome,
                finishType: data.penaltiesPlayed ? MatchFinishType.PENALTIES : MatchFinishType.REGULAR,
                tournament: data.tournament,
                status: data.status,
                startAt: data.startAt
            },
            update: {
                homeTeamScore: data.homeTeamScore,
                awayTeamScore: data.awayTeamScore,
                homePenaltyScore: data.homePenaltyScore !== null? Number(data.homePenaltyScore) : null,
                awayPenaltyScore: data.awayPenaltyScore !== null? Number(data.awayPenaltyScore) : null,
                outcome: data.outcome,
                finishType: data.penaltiesPlayed ? MatchFinishType.PENALTIES : MatchFinishType.REGULAR,
                status: data.status
            }
        });
    }
}