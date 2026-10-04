import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { ChangePasswordForm } from "./ChangePasswordForm";
import './profile.css';

export const ProfilePage = observer(() => {
    const { authStore, predictionStore } = useContext(Context);
    const navigate = useNavigate();
    const { total, points } = predictionStore.stats;

    useEffect(() => {
        predictionStore.getMyPredictions();
    }, [predictionStore]);

    function handleLogout() {
        navigate('/login', { replace: true });
        authStore.logout();
    }

    const email = authStore.user?.email ?? '';

    return (
        <div className='page'>
            <div className='page-header'>
                <div>
                    <h1 className='page-title'>Профиль</h1>
                    <p className='page-subtitle'>Данные аккаунта и безопасность</p>
                </div>
            </div>

            <div className='profile-grid'>
                <section className='profile-card card'>
                    <div className='profile-user'>
                        <span className='profile-avatar' aria-hidden='true'>{email.charAt(0).toUpperCase()}</span>
                        <div className='profile-user-info'>
                            <span className='profile-email'>{email}</span>
                            <span className={`badge ${authStore.isAdmin ? 'badge--warning' : ''}`}>
                                {authStore.isAdmin ? 'Администратор' : 'Игрок'}
                            </span>
                        </div>
                    </div>

                    <dl className='profile-stats'>
                        <div>
                            <dt>Очков</dt>
                            <dd className='is-accent'>{points}</dd>
                        </div>
                        <div>
                            <dt>Прогнозов</dt>
                            <dd>{total}</dd>
                        </div>
                    </dl>

                    <button className='button button--danger button--block' onClick={handleLogout}>
                        Выйти из аккаунта
                    </button>
                </section>

                <ChangePasswordForm />
            </div>
        </div>
    )
})
