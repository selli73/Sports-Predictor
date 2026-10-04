import { useContext, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { getErrorMessage } from "../../http";
import ErrorMessage from "../Error/ErrorMessage";
import { AuthLayout } from "./AuthLayout";

const MIN_PASSWORD_LENGTH = 8;

export const RegisterForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authStore } = useContext(Context);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
            return;
        }

        try {
            setIsSubmitting(true);
            await authStore.register(email, password, name.trim(), phone.trim());
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось зарегистрироваться'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title='Регистрация' subtitle='Создайте аккаунт, чтобы делать прогнозы'>
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
                    <input className='input' type='password' placeholder='Минимум 8 символов' autoComplete='new-password' required value={password} onChange={(event) => {
                        setPassword(event.target.value);
                        setError('');
                    }} />
                </label>
                <label className='field'>
                    <span className='field-label'>Имя</span>
                    <input className='input' type='text' placeholder='Как вас показывать в рейтинге' autoComplete='nickname' value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label className='field'>
                    <span className='field-label'>Телефон <span className='field-hint'>— необязательно</span></span>
                    <input className='input' type='tel' placeholder='+7 (900) 000-00-00' autoComplete='tel' value={phone} onChange={(event) => setPhone(event.target.value)} />
                </label>
                {
                    error && <ErrorMessage errorMessage={error} />
                }
                <div className='auth-form-actions'>
                    <button className='button button--primary button--block' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
                    </button>
                </div>
            </form>
            <p className='auth-footer'>
                Уже есть аккаунт? <Link to='/login'>Войти</Link>
            </p>
        </AuthLayout>
    )
}
