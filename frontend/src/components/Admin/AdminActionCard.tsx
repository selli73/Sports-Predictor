import { useState } from "react";
import { getErrorMessage } from "../../http";
import type { AdminResponse } from "../../models/response/AdminResponse";
import ErrorMessage from "../Error/ErrorMessage";

type AdminActionCardProps = {
    step: number;
    title: string;
    description: string;
    buttonText: string;
    onRun: () => Promise<AdminResponse>;
};

type Result = {
    text: string;
    isWarning: boolean;
};

function formatResult(data: AdminResponse): Result {
    // football.service при ошибке парсинга ничего не возвращает
    if (!data) {
        return { text: 'Сервер не вернул результат — проверьте логи backend', isWarning: true };
    }

    if (typeof data.count === 'number') {
        return { text: `Готово. Обработано матчей: ${data.count}`, isWarning: false };
    }

    return { text: data.message || 'Готово', isWarning: false };
}

export const AdminActionCard = ({ step, title, description, buttonText, onRun }: AdminActionCardProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');

    async function handleRun() {
        try {
            setResult(null);
            setError('');
            setIsRunning(true);
            const data = await onRun();
            setResult(formatResult(data));
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Не удалось выполнить задачу'));
        } finally {
            setIsRunning(false);
        }
    }

    return (
        <section className='admin-card card'>
            <div className='admin-card-header'>
                <span className='admin-card-step'>{step}</span>
                <h2 className='admin-card-title'>{title}</h2>
            </div>
            <p className='admin-card-description'>{description}</p>
            {
                result && <div className={result.isWarning ? 'warning-message' : 'success-message'}>{result.text}</div>
            }
            {
                error && <ErrorMessage errorMessage={error} />
            }
            <button className='button button--primary' onClick={handleRun} disabled={isRunning}>
                {isRunning ? 'Выполняется...' : buttonText}
            </button>
        </section>
    )
}
