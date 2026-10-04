import { useContext, useState, type FormEvent } from "react";
import { Context } from "../../../main";
import { getErrorMessage } from "../../../http";
import ErrorMessage from "../../Error/ErrorMessage";

type StepCodeProps = {
    email: string;
    onSuccess: () => void;
    onChangeEmail: () => void;
};

export const StepCode = ({ email, onSuccess, onChangeEmail }: StepCodeProps) => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [info, setInfo] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authStore } = useContext(Context);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            setError('');
            setInfo('');
            setIsSubmitting(true);
            await authStore.verifyResetCode(email, code.trim());
            onSuccess();
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Неверный или истекший код'));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleResend() {
        try {
            setError('');
            await authStore.forgotPassword(email);
            setInfo('Новый код отправлен на почту');
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось отправить код'));
        }
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <p className='recovery-email'>
                Код отправлен на <strong>{email}</strong>, если такой аккаунт существует.{' '}
                <button type='button' className='recovery-link' onClick={onChangeEmail}>Изменить</button>
            </p>
            <label className='field'>
                <span className='field-label'>Код из письма</span>
                <input className='input recovery-code-input' type='text' placeholder='••••••' maxLength={6} autoComplete='one-time-code' required value={code} onChange={(event) => {
                    setCode(event.target.value);
                    setError('');
                }} />
            </label>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            {
                info && <div className='success-message'>{info}</div>
            }
            <button className='button button--primary button--block' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Проверяем...' : 'Подтвердить'}
            </button>
            <button type='button' className='button button--ghost button--block' onClick={handleResend}>
                Отправить код повторно
            </button>
        </form>
    )
}
