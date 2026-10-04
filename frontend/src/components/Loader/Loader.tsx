import './loader.css';

type LoaderProps = {
    text?: string;
    fullscreen?: boolean;
};

export const Loader = ({ text = 'Загрузка...', fullscreen = false }: LoaderProps) => {
    return (
        <div className={`loader ${fullscreen ? 'loader--fullscreen' : ''}`} role='status'>
            <span className='loader-spinner' />
            <span>{text}</span>
        </div>
    )
}
