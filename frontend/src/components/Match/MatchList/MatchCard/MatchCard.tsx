import { observer } from "mobx-react-lite";
import type { IUpcomingMatch } from "../../../../models/IMatch";
import type { IPrediction } from "../../../../models/IPrediction";
import { formatMatchDate, isMatchStarted } from "../../../../utils/format";
import { TeamInfo } from "./TeamInfo";
import { AiProbability } from "./AiProbability";
import { PredictionButtons } from "./PredictionButtons";
import { Lineups } from "./Lineups";
import './match-card.css';

type MatchCardProps = {
    match: IUpcomingMatch;
    prediction?: IPrediction;
};

export const MatchCard = observer(({ match, prediction }: MatchCardProps) => {
    const isStarted = isMatchStarted(match.startAt);

    return (
        <article className='match-card card'>
            <header className='match-card-header'>
                <time className='match-card-date' dateTime={match.startAt}>{formatMatchDate(match.startAt)}</time>
                {
                    prediction
                        ? <span className='badge badge--accent'>Прогноз сделан</span>
                        : isStarted && <span className='badge'>Матч начался</span>
                }
            </header>

            <div className='match-card-teams'>
                <TeamInfo team={match.homeTeam} side='home' />
                <span className='match-card-vs'>vs</span>
                <TeamInfo team={match.awayTeam} side='away' />
            </div>

            <AiProbability prediction={match.matchAIPrediction[0]} />

            <PredictionButtons match={match} prediction={prediction} isStarted={isStarted} />

            <Lineups homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
        </article>
    )
})
