import { useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { AdminActionCard } from "./AdminActionCard";
import './admin.css';

export const AdminPage = observer(() => {
    const { authStore, adminStore } = useContext(Context);

    if (!authStore.isAdmin) {
        return (
            <div className='card empty-state'>
                <div className='empty-state-title'>Нет доступа</div>
                <p>Этот раздел доступен только администраторам</p>
                <Link to='/matches'>Вернуться к матчам</Link>
            </div>
        );
    }

    return (
        <div className='page'>
            <div className='page-header'>
                <div>
                    <h1 className='page-title'>Администрирование</h1>
                    <p className='page-subtitle'>Ручной запуск фоновых задач backend</p>
                </div>
            </div>

            <div className='admin-grid'>
                <AdminActionCard
                    step={1}
                    title='Импорт предстоящих матчей'
                    description='Загружает расписание NPL ACT (Австралия) с Flashscore и сохраняет новые матчи'
                    buttonText='Импортировать'
                    onRun={() => adminStore.importUpcomingMatches()}
                />
                <AdminActionCard
                    step={2}
                    title='AI-вероятности (Gemini)'
                    description='Отправляет предстоящие матчи в Gemini и сохраняет вероятности исходов'
                    buttonText='Рассчитать'
                    onRun={() => adminStore.calculateAiProbability()}
                />
                <AdminActionCard
                    step={3}
                    title='Импорт результатов'
                    description='Загружает счет завершенных матчей и переводит их в статус «Завершен»'
                    buttonText='Импортировать'
                    onRun={() => adminStore.importFinishedMatches()}
                />
                <AdminActionCard
                    step={4}
                    title='Начисление очков'
                    description='Начисляет по 10 очков за угаданные исходы. Также запускается автоматически каждые 10 минут'
                    buttonText='Начислить'
                    onRun={() => adminStore.addPoints()}
                />
            </div>
        </div>
    )
})
