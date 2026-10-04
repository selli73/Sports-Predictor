import './error.css';

type ErrorMessageProps = {
    errorMessage: string
};

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
    return (
        <div className='error' role='alert'>{errorMessage || 'Что-то пошло не так'}</div>
    )
}
