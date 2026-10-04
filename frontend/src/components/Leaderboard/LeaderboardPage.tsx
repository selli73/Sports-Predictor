import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";
import { Loader } from "../Loader/Loader";
import { getInitials, pluralize } from "../../utils/format";
import './leaderboard.css';

export const LeaderboardPage = observer(() => {
    const { leaderboardStore, authStore } = useContext(Context);
    const { leaders, isLoading, error } = leaderboardStore;

    useEffect(() => {
        leaderboardStore.getLeaderboard();
    }, [leaderboardStore]);

    function renderContent() {
        if (leaders.length === 0 && isLoading) {
            return <Loader text='Загружаем рейтинг...' />;
        }

        if (error) {
            return <ErrorMessage errorMessage={error} />;
        }

        if (leaders.length === 0) {
            return (
                <div className='card empty-state'>
                    <div className='empty-state-title'>Рейтинг пока пуст</div>
                    <p>Сделайте прогноз и станьте первым в таблице</p>
                </div>
            );
        }

        return (
            <ol className='leaderboard card'>
                {
                    leaders.map((leader, index) => {
                        const place = index + 1;
                        const isMe = leader.id === authStore.user?.userId;
                        const name = leader.name || 'Игрок без имени';

                        return (
                            <li key={leader.id} className={`leaderboard-row ${isMe ? 'is-me' : ''} ${place <= 3 ? `is-top is-top-${place}` : ''}`}>
                                <span className='leaderboard-place'>{place}</span>
                                <span className='leaderboard-avatar' aria-hidden='true'>{getInitials(name)}</span>
                                <span className='leaderboard-name'>
                                    {name}
                                    {isMe && <span className='badge badge--accent'>Вы</span>}
                                </span>
                                <span className='leaderboard-points'>
                                    {leader.totalPoints}
                                    <small>{pluralize(leader.totalPoints, ['очко', 'очка', 'очков'])}</small>
                                </span>
                            </li>
                        );
                    })
                }
            </ol>
        );
    }

    return (
        <div className='page'>
            <div className='page-header'>
                <div>
                    <h1 className='page-title'>Рейтинг игроков</h1>
                    <p className='page-subtitle'>Топ-10 по количеству очков. За каждый угаданный исход — 10 очков</p>
                </div>
            </div>
            {renderContent()}
        </div>
    )
})
