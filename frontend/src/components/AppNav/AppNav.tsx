import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { Logo } from "../Logo/Logo";
import './app-nav.css';

export const AppNav = observer(() => {
    const { authStore } = useContext(Context);
    const navigate = useNavigate();

    const tabs = [
        { to: '/matches', label: 'Матчи' },
        { to: '/predictions', label: 'Мои прогнозы' },
        { to: '/leaderboard', label: 'Рейтинг' },
        { to: '/profile', label: 'Профиль' }
    ];

    if (authStore.isAdmin) {
        tabs.push({ to: '/admin', label: 'Админ' });
    }

    function handleLogout() {
        navigate('/login', { replace: true });
        authStore.logout();
    }

    return (
        <header className="app-header">
            <div className="app-header-inner">
                <NavLink to="/matches" className="app-header-logo" aria-label="На главную">
                    <Logo />
                </NavLink>

                <nav className="app-nav">
                    {
                        tabs.map(tab => (
                            <NavLink
                                key={tab.to}
                                to={tab.to}
                                className={({ isActive }) => `app-nav-tab ${isActive ? 'is-active' : ''}`}
                            >
                                {tab.label}
                            </NavLink>
                        ))
                    }
                </nav>

                <div className="app-header-user">
                    <span className="app-header-email" title={authStore.user?.email}>{authStore.user?.email}</span>
                    <button className="button button--ghost app-header-logout" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>
        </header>
    )
})
