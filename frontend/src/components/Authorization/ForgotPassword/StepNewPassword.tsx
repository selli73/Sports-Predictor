import { useContext, useState, type FormEvent } from "react";
import { Context } from "../../../main";
import { getErrorMessage } from "../../../http";
import ErrorMessage from "../../Error/ErrorMessage";

const MIN_PASSWORD_LENGTH = 8;

type StepNewPasswordProps = {
    onChanged: () => void
};

export const StepNewPassword = ({ onChanged }: StepNewPasswordProps) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authStore } = useContext(Context);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            setError('');
            setIsSubmitting(true);
            await authStore.resetPassword(password);
            onChanged();
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось сменить пароль. Попробуйте запросить код заново'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <label className='field'>
                <span className='field-label'>Новый пароль</span>
                <input className='input' type='password' placeholder='Минимум 8 символов' autoComplete='new-password' required value={password} onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                }} />
            </label>
            <label className='field'>
                <span className='field-label'>Повторите пароль</span>
                <input className='input' type='password' placeholder='••••••••' autoComplete='new-password' required value={confirmPassword} onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError('');
                }} />
            </label>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            <button className='button button--primary button--block' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Сохраняем...' : 'Сменить пароль'}
            </button>
        </form>
    )
}
