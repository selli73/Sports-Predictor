import type { IPrediction } from "../../../../models/IPrediction";
import { pluralize } from "../../../../utils/format";

type PredictionResultProps = {
    prediction: IPrediction;
};

export const PredictionResult = ({ prediction }: PredictionResultProps) => {
    const { match } = prediction;

    if (match.status !== 'FINISHED' || !match.outcome) {
        return <span className='badge'>Ожидает результата</span>;
    }

    if (match.outcome !== prediction.outcome) {
        return <span className='badge badge--danger'>Не угадано</span>;
    }

    // Очки начисляет cron на backend раз в 10 минут
    if (prediction.pointsWon === 0) {
        return <span className='badge badge--accent'>Угадано · очки скоро начислятся</span>;
    }

    return <span className='badge badge--accent'>+{prediction.pointsWon} {pluralize(prediction.pointsWon, ['очко', 'очка', 'очков'])}</span>;
}
