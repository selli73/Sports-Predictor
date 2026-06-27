import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendWelcomeEmail(to: string, name: string) {
       const htmlContent = ` 
            <h1>Добро пожаловать, ${name}</h1> 
            <p>Спасибо за регистрацию.</p> 
        `;

        await this.mailerService.sendMail({
            from: 'Goodwin',
            to,
            subject: 'Успешная регистрация',
            html: htmlContent
        });
    }

    async sendPasswordResetCode(to: string, passwordResetCode: string) {
        const htmlContent = ` 
            <h1>Создан временный код</h1> 
            <p>Ваш код для восстановления пароля:</p>
            <h1 style="letter-spacing: 5px;">
            ${passwordResetCode}
            </h1>
        `;

        await this.mailerService.sendMail({
            from: 'Goodwin',
            to,
            subject: 'Код сброса пароля',
            html: htmlContent            
        });
    }
}