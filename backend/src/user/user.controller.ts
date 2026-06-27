import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto, ForgotPasswordDto, PasswordResetCodeVerificationDto, ResetPasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { IJwtUserRequest, IPasswordResetJwtUserRequest } from './typings';
import { PasswordResetJwt } from './guards/jwt-passwordReset.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'The user is registered' })
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login') @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User authorization' })
  @ApiResponse({ status: 200, description: 'The user has successfully logged in' }) @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'User password change' }) @ApiResponse({ status: 200, description: 'The user password has been successfully changed' })
   @ApiResponse({ status: 401, description: 'Unauthorized' }) 
  changePassword(@Req() req: IJwtUserRequest, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto.oldPassword, dto.newPassword);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Sends a code by email', description: 'We generate the code, save the code in the database and it by email' })
  @ApiResponse({ status: 200, description: 'The code was successfully sent to your email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto.email);
  }

  @Post('reset-code-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Code verify' }) @ApiResponse({ status: 200, description: 'Code is valid' })
  passwordResetCodeVerification(@Body() dto: PasswordResetCodeVerificationDto) {
    return this.userService.passwordResetCodeVerification(dto.email, dto.code);
  }

  @Post('reset-password') 
  @HttpCode(HttpStatus.OK) @UseGuards(PasswordResetJwt)
  @ApiBearerAuth() @ApiOperation({ summary: 'Setting a new password' }) @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'The user has successfully set a new password' })
  resetPassword(@Req() req: IPasswordResetJwtUserRequest, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req.user.userId, dto.newPassword)
  }
}
