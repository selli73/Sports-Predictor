import { useContext, useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { Logo } from "../Logo/Logo";
import './auth-form.css';

type AuthLayoutProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
};

export const AuthLayout = observer(({ title, subtitle, children }: AuthLayoutProps) => {
    const { authStore } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        if (!authStore.isAuth) {
            authStore.checkAuth();
        }
    }, [authStore]);

    // Уже авторизован (или только что вошел) — возвращаем туда, откуда пришел
    if (authStore.isAuth) {
        const from = (location.state as { from?: string } | null)?.from;
        return <Navigate to={from || '/matches'} replace />;
    }

    return (
        <div className='auth-page'>
            <div className='auth-card card'>
                <div className='auth-logo'>
                    <Logo />
                </div>
                <h1 className='auth-title'>{title}</h1>
                {
                    subtitle && <p className='auth-subtitle'>{subtitle}</p>
                }
                {children}
            </div>
        </div>
    )
})
