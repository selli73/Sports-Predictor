import { ApiProperty } from "@nestjs/swagger";
import { MatchOutcome } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreatePredictionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'match ID' })
    matchId!: string;
    
    @IsNotEmpty()
    @IsEnum(MatchOutcome)
    @ApiProperty({ description: 'The outcome of the match', example: '"HOME" | "AWAY" | "DRAW"' })
    outcome!: MatchOutcome;
}
