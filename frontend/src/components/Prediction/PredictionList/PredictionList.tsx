import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";
import { Loader } from "../../Loader/Loader";
import { PredictionCard } from "./PredictionCard/PredictionCard";
import './prediction-list.css';

type Filter = 'all' | 'pending' | 'finished';

const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'pending', label: 'Ожидают' },
    { value: 'finished', label: 'Завершены' }
];

export const PredictionList = observer(() => {
    const { predictionStore } = useContext(Context);
    const [filter, setFilter] = useState<Filter>('all');
    const { predictions, isLoading, error } = predictionStore;

    if (predictions.length === 0) {
        if (isLoading) {
            return <Loader text='Загружаем прогнозы...' />;
        }

        if (error) {
            return <ErrorMessage errorMessage={error} />;
        }

        return (
            <div className='card empty-state'>
                <div className='empty-state-title'>Вы еще не сделали ни одного прогноза</div>
                <p>Выберите матч и угадайте его исход</p>
                <Link className='button button--primary' to='/matches'>К матчам</Link>
            </div>
        );
    }

    const filtered = predictions.filter(prediction => {
        if (filter === 'pending') return prediction.match.status !== 'FINISHED';
        if (filter === 'finished') return prediction.match.status === 'FINISHED';
        return true;
    });

    return (
        <section className='prediction-list'>
            <div className='prediction-filters' role='tablist'>
                {
                    filters.map(item => (
                        <button
                            key={item.value}
                            type='button'
                            role='tab'
                            aria-selected={filter === item.value}
                            className={`prediction-filter ${filter === item.value ? 'is-active' : ''}`}
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </button>
                    ))
                }
            </div>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            {
                filtered.length === 0
                    ? <div className='card empty-state'>В этой категории прогнозов нет</div>
                    : filtered.map(prediction => (
                        <PredictionCard key={prediction.id} prediction={prediction} />
                    ))
            }
        </section>
    )
})
