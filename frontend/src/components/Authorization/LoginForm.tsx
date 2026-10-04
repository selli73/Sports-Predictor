import { useContext, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { getErrorMessage } from "../../http";
import ErrorMessage from "../Error/ErrorMessage";
import { AuthLayout } from "./AuthLayout";

export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authStore } = useContext(Context);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            // После успешного входа AuthLayout сам перенаправит на нужную страницу
            await authStore.login(email, password);
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось авторизоваться'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title='Вход' subtitle='Делайте прогнозы на матчи и поднимайтесь в рейтинге'>
            <form className='auth-form' onSubmit={handleSubmit}>
                <label className='field'>
                    <span className='field-label'>Email</span>
                    <input className='input' type='email' placeholder='you@example.com' autoComplete='email' required value={email} onChange={(event) => {
                        setEmail(event.target.value);
                        setError('');
                    }} />
                </label>
                <label className='field'>
                    <span className='field-label'>Пароль</span>
                    <input className='input' type='password' placeholder='••••••••' autoComplete='current-password' required value={password} onChange={(event) => {
                        setPassword(event.target.value);
                        setError('');
                    }} />
                </label>
                <Link className='forgot-password-link' to='/recovery-password'>Забыли пароль?</Link>
                {
                    error && <ErrorMessage errorMessage={error} />
                }
                <div className='auth-form-actions'>
                    <button className='button button--primary button--block' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Входим...' : 'Войти'}
                    </button>
                </div>
            </form>
            <p className='auth-footer'>
                Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
            </p>
        </AuthLayout>
    )
}
