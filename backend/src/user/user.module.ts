import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from '../profile/profile.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtToken } from './user.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordJwtStrategy } from './strategies/reset-password.jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: jwtToken.secret,
    signOptions: { expiresIn: '1d' }
  }), MailModule],
  controllers: [UserController, ProfileController],
  providers: [UserService, JwtStrategy, ResetPasswordJwtStrategy]
})
export class UserModule {}