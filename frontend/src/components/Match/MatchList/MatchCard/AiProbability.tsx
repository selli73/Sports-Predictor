import type { IMatchAIPrediction } from "../../../../models/IMatch";
import { toPercents } from "../../../../utils/format";
import './ai-probability.css';

type AiProbabilityProps = {
    prediction?: IMatchAIPrediction;
};

export const AiProbability = ({ prediction }: AiProbabilityProps) => {
    if (!prediction) {
        return (
            <div className='ai-probability ai-probability--empty'>
                <span className='ai-probability-badge'>AI</span>
                Прогноз нейросети для этого матча еще не рассчитан
            </div>
        );
    }

    const percents = toPercents(prediction);

    const segments = [
        { key: 'home', label: 'П1', value: percents.home },
        { key: 'draw', label: 'Х', value: percents.draw },
        { key: 'away', label: 'П2', value: percents.away }
    ];

    return (
        <div className='ai-probability'>
            <div className='ai-probability-header'>
                <span className='ai-probability-badge'>AI · Gemini</span>
                <span className='ai-probability-title'>Вероятность исхода</span>
            </div>
            <div className='ai-probability-bar' role='img' aria-label={`П1 ${percents.home}%, ничья ${percents.draw}%, П2 ${percents.away}%`}>
                {
                    segments.map(segment => (
                        <span key={segment.key} className={`ai-probability-segment is-${segment.key}`} style={{ width: `${segment.value}%` }} />
                    ))
                }
            </div>
            <div className='ai-probability-legend'>
                {
                    segments.map(segment => (
                        <span key={segment.key} className='ai-probability-legend-item'>
                            <i className={`ai-probability-dot is-${segment.key}`} />
                            {segment.label}
                            <strong>{segment.value}%</strong>
                        </span>
                    ))
                }
            </div>
        </div>
    )
}
