import { useContext, useState, type FormEvent } from "react";
import { Context } from "../../main";
import { getErrorMessage } from "../../http";
import ErrorMessage from "../Error/ErrorMessage";

const MIN_PASSWORD_LENGTH = 8;

export const ChangePasswordForm = () => {
    const { authStore } = useContext(Context);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSuccess('');

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            setError(`Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            setError('');
            setIsSubmitting(true);
            await authStore.changePassword(oldPassword, newPassword);
            setSuccess('Пароль успешно изменен');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось изменить пароль'));
        } finally {
            setIsSubmitting(false);
        }
    }

    function resetMessages() {
        setError('');
        setSuccess('');
    }

    return (
        <form className='profile-card card' onSubmit={handleSubmit}>
            <h2 className='profile-card-title'>Смена пароля</h2>
            <label className='field'>
                <span className='field-label'>Текущий пароль</span>
                <input className='input' type='password' autoComplete='current-password' required value={oldPassword} onChange={(event) => {
                    setOldPassword(event.target.value);
                    resetMessages();
                }} />
            </label>
            <label className='field'>
                <span className='field-label'>Новый пароль</span>
                <input className='input' type='password' placeholder='Минимум 8 символов' autoComplete='new-password' required value={newPassword} onChange={(event) => {
                    setNewPassword(event.target.value);
                    resetMessages();
                }} />
            </label>
            <label className='field'>
                <span className='field-label'>Повторите новый пароль</span>
                <input className='input' type='password' autoComplete='new-password' required value={confirmPassword} onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    resetMessages();
                }} />
            </label>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            {
                success && <div className='success-message'>{success}</div>
            }
            <button className='button button--primary' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Сохраняем...' : 'Сменить пароль'}
            </button>
        </form>
    )
}
