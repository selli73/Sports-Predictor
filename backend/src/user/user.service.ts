import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

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
}
