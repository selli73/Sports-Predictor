import { AuthGuard } from "@nestjs/passport"

export class PasswordResetJwt extends AuthGuard('jwt-reset-password') {}