import type { IPrediction } from "../../../../models/IPrediction";
import { describeOutcome, formatMatchDate, outcomeLabels, statusLabels, tournamentLabels } from "../../../../utils/format";
import { TeamLogo } from "../../../TeamLogo/TeamLogo";
import { PredictionResult } from "./PredictionResult";
import './prediction-card.css';

type PredictionCardProps = {
    prediction: IPrediction;
};

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
    const { match } = prediction;
    const isLive = match.status !== 'UPCOMING' && match.status !== 'FINISHED';
    const hasScore = match.homeTeamScore !== null && match.awayTeamScore !== null;
    const hasPenalties = match.homePenaltyScore !== null && match.awayPenaltyScore !== null;

    return (
        <article className='prediction-card card'>
            <header className='prediction-card-header'>
                <span className='prediction-card-meta'>
                    {tournamentLabels[match.tournament]} · {formatMatchDate(match.startAt)}
                </span>
                <span className={`badge ${isLive ? 'badge--warning badge--live' : ''}`}>
                    {statusLabels[match.status]}
                </span>
            </header>

            <div className='prediction-card-match'>
                <div className='prediction-card-team'>
                    <TeamLogo name={match.homeTeam.name} logo={match.homeTeam.logo} size='sm' />
                    <span className='prediction-card-team-name'>{match.homeTeam.name}</span>
                </div>
                <div className='prediction-card-score'>
                    {hasScore ? `${match.homeTeamScore} : ${match.awayTeamScore}` : '– : –'}
                    {
                        hasPenalties && (
                            <span className='prediction-card-penalties'>пен. {match.homePenaltyScore} : {match.awayPenaltyScore}</span>
                        )
                    }
                </div>
                <div className='prediction-card-team is-away'>
                    <span className='prediction-card-team-name'>{match.awayTeam.name}</span>
                    <TeamLogo name={match.awayTeam.name} logo={match.awayTeam.logo} size='sm' />
                </div>
            </div>

            <footer className='prediction-card-footer'>
                <span className='prediction-card-pick'>
                    Ваш прогноз:{' '}
                    <strong>{outcomeLabels[prediction.outcome]} · {describeOutcome(prediction.outcome, match.homeTeam.name, match.awayTeam.name)}</strong>
                </span>
                <PredictionResult prediction={prediction} />
            </footer>
        </article>
    )
}
