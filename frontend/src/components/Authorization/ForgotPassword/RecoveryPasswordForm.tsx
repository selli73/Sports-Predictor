import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../AuthLayout";
import { StepEmail } from "./StepEmail";
import { StepCode } from "./StepCode";
import { StepNewPassword } from "./StepNewPassword";
import './recovery-password.css';

type Step = 'email' | 'code' | 'newPassword' | 'done';

const subtitles: Record<Step, string> = {
    email: 'Укажите email — мы отправим на него код подтверждения',
    code: 'Введите код из письма. Он действует 15 минут',
    newPassword: 'Придумайте новый пароль',
    done: 'Пароль успешно изменен. Теперь можно войти с новым паролем'
};

const steps: Step[] = ['email', 'code', 'newPassword'];

export const RecoveryPasswordForm = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');

    function handleEmailSent(email: string) {
        setEmail(email);
        setStep('code');
    }

    return (
        <AuthLayout title='Восстановление пароля' subtitle={subtitles[step]}>
            {
                step !== 'done' && (
                    <div className='recovery-steps' aria-hidden='true'>
                        {
                            steps.map((item, index) => (
                                <span key={item} className={`recovery-step ${index <= steps.indexOf(step) ? 'is-active' : ''}`} />
                            ))
                        }
                    </div>
                )
            }
            {
                step === 'email' && (
                    <StepEmail next={handleEmailSent} />
                )
            }
            {
                step === 'code' && (
                    <StepCode email={email} onSuccess={() => setStep('newPassword')} onChangeEmail={() => setStep('email')} />
                )
            }
            {
                step === 'newPassword' && (
                    <StepNewPassword onChanged={() => setStep('done')} />
                )
            }
            {
                step === 'done' && (
                    <div className='auth-form'>
                        <Link className='button button--primary button--block' to='/login'>Войти</Link>
                    </div>
                )
            }
            {
                step !== 'done' && (
                    <p className='auth-footer'>
                        <Link to='/login'>Вернуться ко входу</Link>
                    </p>
                )
            }
        </AuthLayout>
    )
}
