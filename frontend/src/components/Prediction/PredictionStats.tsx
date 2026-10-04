import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";

export const PredictionStats = observer(() => {
    const { predictionStore } = useContext(Context);
    const { total, finished, correct, points } = predictionStore.stats;
    const accuracy = finished > 0 ? Math.round(correct / finished * 100) : null;

    const tiles = [
        { label: 'Прогнозов', value: total },
        { label: 'Угадано', value: `${correct} из ${finished}` },
        { label: 'Точность', value: accuracy === null ? '—' : `${accuracy}%` },
        { label: 'Очков', value: points, isAccent: true }
    ];

    return (
        <div className='prediction-stats'>
            {
                tiles.map(tile => (
                    <div key={tile.label} className='prediction-stat card'>
                        <span className='prediction-stat-label'>{tile.label}</span>
                        <span className={`prediction-stat-value ${tile.isAccent ? 'is-accent' : ''}`}>{tile.value}</span>
                    </div>
                ))
            }
        </div>
    )
})
