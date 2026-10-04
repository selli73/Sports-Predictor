import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { AppNav } from "../AppNav/AppNav";
import { Loader } from "../Loader/Loader";
import './auth-gate.css';

export const AuthGate = observer(() => {
    const { authStore } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        if (!authStore.isAuth) {
            authStore.checkAuth();
        }
    }, [authStore]);

    // BrowserRouter не сбрасывает прокрутку при переходе между страницами
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (!authStore.isAuth && authStore.isCheckingAuth) {
        return <Loader fullscreen />;
    }

    if (!authStore.isAuth) {
        return <Navigate to='/login' replace state={{ from: location.pathname }} />;
    }

    return (
        <>
            <AppNav />
            <main className='app-main'>
                <Outlet />
            </main>
        </>
    )
})
