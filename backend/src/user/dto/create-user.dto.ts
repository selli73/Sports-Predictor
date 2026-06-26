import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({ description: 'User email', example: 'jonJones@gmail.com' })
    email!: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'User password', example: 'hardPassword' })
    password!: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Username', example: 'Bob' })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'User phone number', example: '+7 (9**) ***-**-**' })
    phone?: string;
}