import { useContext, useState, type FormEvent } from "react";
import { Context } from "../../../main";
import { getErrorMessage } from "../../../http";
import ErrorMessage from "../../Error/ErrorMessage";

type StepEmailProps = {
    next: (email: string) => void
};

export const StepEmail = ({ next }: StepEmailProps) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authStore } = useContext(Context);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            setError('');
            setIsSubmitting(true);
            await authStore.forgotPassword(email);
            next(email);
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось отправить код'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <label className='field'>
                <span className='field-label'>Email</span>
                <input className='input' type='email' placeholder='you@example.com' autoComplete='email' required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            <button className='button button--primary button--block' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Отправляем...' : 'Получить код'}
            </button>
        </form>
    )
}
