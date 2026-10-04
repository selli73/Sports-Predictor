import './logo.css';

export const Logo = () => {
    return (
        <span className='logo'>
            <svg className='logo-icon' viewBox='0 0 32 32' aria-hidden='true'>
                <rect width='32' height='32' rx='8' fill='var(--accent)' />
                <circle cx='16' cy='16' r='10' fill='var(--accent-text)' />
                <path fill='var(--accent)' d='m16 10.5 4.3 3.1-1.6 5h-5.4l-1.6-5z' />
                <path stroke='var(--accent)' strokeWidth='1.4' fill='none' d='M16 6v4.5M20.3 13.6l4.6-1.6M18.7 18.6l2.8 4M13.3 18.6l-2.8 4M11.7 13.6 7.1 12' />
            </svg>
            <span className='logo-text'>Sports<span>Predictor</span></span>
        </span>
    )
}
