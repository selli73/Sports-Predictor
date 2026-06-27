export interface IJwtUserRequest {
    user: {
        userId: string;
        email: string;
    }
}

export interface IPasswordResetJwtUserRequest {
    user: {
        userId: string
    }
}