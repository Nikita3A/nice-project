import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";

export class ReqCreateTeamDTO {
    @ApiProperty()
    @MinLength(4)
    @MaxLength(14)
    name: string;
}