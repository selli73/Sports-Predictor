import { IsString } from "class-validator";

export class InteractionGeminiDto {
    @IsString()
    prompt!: string;
}