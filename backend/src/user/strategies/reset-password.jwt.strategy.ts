import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtToken } from "../user.constants";
import { BadRequestException } from "@nestjs/common";

export class ResetPasswordJwtStrategy extends PassportStrategy(Strategy, 'jwt-reset-password') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtToken.secret
        })
    }

    validate(payload) {
        if (payload.type !== 'password-reset') {
            throw new BadRequestException('Недействительный токен');
        }

        return {
            userId: payload.userId
        };
    }
}