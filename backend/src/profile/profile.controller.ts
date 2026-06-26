import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../user/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('profile')
export class ProfileController {

    @Get('me')
    @UseGuards(JwtAuthGuard) 
    @ApiBearerAuth() @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'The user has successfully logged in' }) @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Req() req) {        
        return {
            message: 'Доступ разрешен',
            user: req.user
        }
    }
}