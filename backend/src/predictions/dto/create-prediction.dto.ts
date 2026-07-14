import { PredictionOutcome } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreatePredictionDto {
    @IsString()
    @IsNotEmpty()
    matchId!: string;
    
    @IsNotEmpty()
    @IsEnum(PredictionOutcome)
    outcome!: PredictionOutcome;
}
