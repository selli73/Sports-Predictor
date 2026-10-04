import { useContext, useState } from "react";
import { Context } from "../../../../main";
import { getErrorMessage } from "../../../../http";
import type { IUpcomingMatch, MatchOutcome } from "../../../../models/IMatch";
import type { IPrediction } from "../../../../models/IPrediction";
import { describeOutcome } from "../../../../utils/format";
import ErrorMessage from "../../../Error/ErrorMessage";

type PredictionButtonsProps = {
    match: IUpcomingMatch;
    prediction?: IPrediction;
    isStarted: boolean;
};

export const PredictionButtons = ({ match, prediction, isStarted }: PredictionButtonsProps) => {
    const { predictionStore } = useContext(Context);
    const [selected, setSelected] = useState<MatchOutcome | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Прогноз нельзя изменить, а после начала матча — сделать
    const isLocked = Boolean(prediction) || isStarted;

    const options: { outcome: MatchOutcome; label: string; hint: string }[] = [
        { outcome: 'HOME', label: 'П1', hint: match.homeTeam.name },
        { outcome: 'DRAW', label: 'Х', hint: 'Ничья' },
        { outcome: 'AWAY', label: 'П2', hint: match.awayTeam.name }
    ];

    async function handleConfirm() {
        if (!selected) {
            return;
        }

        try {
            setError('');
            setIsSubmitting(true);
            await predictionStore.createPrediction(match.id, selected);
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось сохранить прогноз'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='prediction-buttons'>
            <div className='prediction-options' role='radiogroup' aria-label='Исход матча'>
                {
                    options.map(option => {
                        const isPicked = prediction?.outcome === option.outcome;
                        const isSelected = !prediction && selected === option.outcome;

                        return (
                            <button
                                key={option.outcome}
                                type='button'
                                role='radio'
                                aria-checked={isPicked || isSelected}
                                className={`prediction-option ${isSelected ? 'is-selected' : ''} ${isPicked ? 'is-picked' : ''}`}
                                disabled={isLocked || isSubmitting}
                                onClick={() => {
                                    setSelected(option.outcome);
                                    setError('');
                                }}
                            >
                                <span className='prediction-option-label'>{option.label}</span>
                                <span className='prediction-option-hint'>{option.hint}</span>
                            </button>
                        );
                    })
                }
            </div>

            {
                prediction && (
                    <p className='prediction-note is-done'>
                        Ваш прогноз: <strong>{describeOutcome(prediction.outcome, match.homeTeam.name, match.awayTeam.name)}</strong>
                    </p>
                )
            }
            {
                !prediction && isStarted && (
                    <p className='prediction-note'>Прием прогнозов на этот матч закрыт</p>
                )
            }
            {
                !isLocked && selected && (
                    <div className='prediction-confirm'>
                        <span className='prediction-confirm-text'>
                            {describeOutcome(selected, match.homeTeam.name, match.awayTeam.name)}. Изменить прогноз потом будет нельзя
                        </span>
                        <button className='button button--primary' onClick={handleConfirm} disabled={isSubmitting}>
                            {isSubmitting ? 'Сохраняем...' : 'Подтвердить'}
                        </button>
                    </div>
                )
            }
            {
                error && <ErrorMessage errorMessage={error} />
            }
        </div>
    )
}
