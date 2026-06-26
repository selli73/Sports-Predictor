import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../user/guards/jwt-auth.guard";

@Controller('profile')
export class ProfileController {

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return {
            message: 'Доступ разрешен',
            user: req.user
        }
    }
}