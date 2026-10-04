import type { IMatchAIPrediction, MatchOutcome, MatchStatus, Tournament } from "../models/IMatch";

export const outcomeLabels: Record<MatchOutcome, string> = {
    HOME: 'П1',
    DRAW: 'Х',
    AWAY: 'П2'
};

export const statusLabels: Record<MatchStatus, string> = {
    UPCOMING: 'Скоро',
    IN_PROGRESS: 'Идет',
    HALF_TIME: 'Перерыв',
    EXTRA_TIME: 'Доп. время',
    PENALTIES: 'Пенальти',
    FINISHED: 'Завершен'
};

export const tournamentLabels: Record<Tournament, string> = {
    WORLD_CHAMPIONSHIP: 'Чемпионат мира',
    NPL_ACT: 'NPL ACT · Австралия'
};

export function describeOutcome(outcome: MatchOutcome, homeTeam: string, awayTeam: string) {
    if (outcome === 'HOME') return `Победа ${homeTeam}`;
    if (outcome === 'AWAY') return `Победа ${awayTeam}`;
    return 'Ничья';
}

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatMatchDate(value: string) {
    const date = new Date(value);
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const diffDays = Math.round((startOfDay(date) - startOfDay(new Date())) / DAY_MS);

    if (diffDays === 0) return `Сегодня, ${time}`;
    if (diffDays === 1) return `Завтра, ${time}`;
    if (diffDays === -1) return `Вчера, ${time}`;

    const day = date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
    });

    return `${day}, ${time}`;
}

export function isMatchStarted(startAt: string) {
    return new Date(startAt).getTime() <= Date.now();
}

// Gemini может вернуть вероятности и в долях (0.45), и в процентах (45) —
// нормируем к сумме 100%, чтобы шкала всегда была корректной
export function toPercents(prediction: IMatchAIPrediction) {
    const { homeWinProbability: home, drawProbability: draw, awayWinProbability: away } = prediction;
    const total = home + draw + away;

    if (total <= 0) {
        return { home: 0, draw: 0, away: 0 };
    }

    return {
        home: Math.round(home / total * 100),
        draw: Math.round(draw / total * 100),
        away: Math.round(away / total * 100)
    };
}

// pluralize(5, ['очко', 'очка', 'очков']) -> 'очков'
export function pluralize(count: number, forms: [string, string, string]) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
    return forms[2];
}

export function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('');
}
