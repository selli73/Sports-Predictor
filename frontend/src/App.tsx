import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/Authorization/LoginForm";
import { RegisterForm } from "./components/Authorization/RegisterForm";
import { RecoveryPasswordForm } from "./components/Authorization/ForgotPassword/RecoveryPasswordForm";
import { AuthGate } from "./components/AuthGate/AuthGate";
import { MatchPage } from "./components/Match/MatchPage";
import { PredictionPage } from "./components/Prediction/PredictionPage";
import { LeaderboardPage } from "./components/Leaderboard/LeaderboardPage";
import { ProfilePage } from "./components/Profile/ProfilePage";
import { AdminPage } from "./components/Admin/AdminPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginForm />} />
                <Route path='/register' element={<RegisterForm />} />
                <Route path='/recovery-password' element={<RecoveryPasswordForm />} />

                <Route element={<AuthGate />}>
                    <Route path='/matches' element={<MatchPage />} />
                    <Route path='/predictions' element={<PredictionPage />} />
                    <Route path='/leaderboard' element={<LeaderboardPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/admin' element={<AdminPage />} />
                </Route>

                <Route path='*' element={<Navigate to='/matches' replace />} />
            </Routes>
        </BrowserRouter>
    )
}
