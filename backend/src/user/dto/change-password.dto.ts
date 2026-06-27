import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
import { LoginDto } from "./create-user.dto";

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'old password', example: '12345678' })
    oldPassword!: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'new password', example: '87654321' })
    newPassword!: string;
}

export class ForgotPasswordDto extends OmitType(LoginDto, ['password'] as const) {
    
}

export class PasswordResetCodeVerificationDto extends ForgotPasswordDto  {
    @IsString()
    @ApiProperty({ description: 'The code that came to the email' })
    code!: string;
}

export class ResetPasswordDto extends OmitType(ChangePasswordDto, ['oldPassword'] as const) {

}