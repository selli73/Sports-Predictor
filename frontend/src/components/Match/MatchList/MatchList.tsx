import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";
import { Loader } from "../../Loader/Loader";
import { MatchCard } from "./MatchCard/MatchCard";
import './match-list.css';

export const MatchList = observer(() => {
    const { matchStore, predictionStore } = useContext(Context);
    const { matches, isLoading, error, hasMore } = matchStore;

    if (matches.length === 0) {
        if (isLoading) {
            return <Loader text='Загружаем матчи...' />;
        }

        if (error) {
            return (
                <div className='match-list-error'>
                    <ErrorMessage errorMessage={error} />
                    <button className='button' onClick={() => matchStore.getUpcoming()}>Повторить</button>
                </div>
            );
        }

        return (
            <div className='card empty-state'>
                <div className='empty-state-title'>Предстоящих матчей пока нет</div>
                <p>Загляните позже — новые матчи появятся после обновления расписания</p>
            </div>
        );
    }

    return (
        <section className='match-list'>
            <div className='match-list-grid'>
                {
                    matches.map(match => (
                        <MatchCard key={match.id} match={match} prediction={predictionStore.predictionByMatchId.get(match.id)} />
                    ))
                }
            </div>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            {
                hasMore && (
                    <button className='button match-list-more' onClick={() => matchStore.loadMore()} disabled={isLoading}>
                        {isLoading ? 'Загрузка...' : 'Показать еще'}
                    </button>
                )
            }
        </section>
    )
})
