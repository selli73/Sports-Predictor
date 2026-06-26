export class LoginDto {
    email!: string;

    password!: string;
}

export class RegisterDto extends LoginDto {
    name?: string;

    phone?: string;
}