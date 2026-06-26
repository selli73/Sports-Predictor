import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtToken } from "../user.constants";
import { BadRequestException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtToken.secret
        });
    }

    validate(payload) {
        if (!payload.sub || !payload.email) {
            throw new BadRequestException('Недействительный токен');
        }

        return {
            userId: payload.sub,
            email: payload.email
        };
    }
}