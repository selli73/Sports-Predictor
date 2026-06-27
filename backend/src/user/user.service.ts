import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { nanoid } from 'nanoid';

@Injectable()
export class UserService {
    constructor(private _prismaService: PrismaService, private _jwtService: JwtService, private _mailService: MailService) {}

    async register(dto: RegisterDto) {
        const existingUser = await this._prismaService.user.findUnique({
            where: { email: dto.email }
        });

        if (existingUser) {
            throw new BadRequestException('Пользователь с таким email уже существует')
        }

        const hashPassword = await bcrypt.hash(dto.password, 12);

        const user = await this._prismaService.user.create({
            data: {
                email: dto.email,
                password: hashPassword,
                name: dto.name,
                phone: dto.phone
            }
        });

        this._mailService.sendWelcomeEmail(user.email, user.name ?? '');

        return this.generateToken(user.id, user.email);
    }

    async login(dto: LoginDto) {
        const user = await this._prismaService.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        return this.generateToken(user.id, user.email);
    }

    generateToken(userId: string, email: string) {
        const payload = {
            sub: userId,
            email
        };

        return {
            access_token: this._jwtService.sign(payload)
        }
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await this._prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('Not found user');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Incorrect password');
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        const updateData = await this._prismaService.user.update({
            where: { id: user.id },
            data: { password: newHashedPassword }
        });

        const {
            password,...objectWithoutPassword
        } = updateData;

        return {
            message: 'The password has been successfully changed'
        };
    }

    async forgotPassword(email: string) {
        const user = await this._prismaService.user.findUnique({
            where: { email }
        });

        if (!user) {
            return {
                message: 'If this user exists, they will receive an email'
            };
        }

        const passwordResetCode = await this._prismaService.passwordResetCode.findUnique({
            where: { userId: user.id }
        });

        const resetCode = nanoid(6);
        const resetCodeHash = await bcrypt.hash(resetCode, 12);

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        if (!passwordResetCode) {
            await this._prismaService.passwordResetCode.create({
                data: {
                    userId: user.id,
                    resetCodeHash,
                    expiryDate                    
                }
            });
        } else {
            await this._prismaService.passwordResetCode.update({
                where: { userId: user.id },
                data: {
                    resetCodeHash,
                    expiryDate
                }
            });
        }

        await this._mailService.sendPasswordResetCode(user.email, resetCode);

        return {
            message: 'If this user exists, they will receive an email'
        };
    }

    async passwordResetCodeVerification(email: string, code: string) {
        const user = await this._prismaService.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new BadRequestException('Ошибка на стороне пользователя');
        }

        const passwordResetCode = await this._prismaService.passwordResetCode.findUnique({
            where: { userId: user.id }
        });

        if (!passwordResetCode) {
            throw new ForbiddenException('Неверный или истекший код');
        }

        if (passwordResetCode.expiryDate < new Date()) {
            throw new ForbiddenException('Неверный или истекший код');
        }

        const isCodeValid = await bcrypt.compare(code, passwordResetCode.resetCodeHash);

        if (!isCodeValid) {
            throw new ForbiddenException('Неверный или истекший код');
        }

        await this._prismaService.passwordResetCode.delete({
            where: { userId: user.id }
        });

        const payload = {
            userId: user.id,
            type: 'password-reset'
        };

        return {
            resetToken: this._jwtService.sign(payload, { expiresIn: '10m' })
        };
    }

    async resetPassword(userId: string, newPassword: string) {
        const user = await this._prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        await this._prismaService.user.update({
            where: { id: user.id },
            data: { password: newPasswordHash }
        });

        return {
            message: 'Password successfully changed'
        };
    }
}