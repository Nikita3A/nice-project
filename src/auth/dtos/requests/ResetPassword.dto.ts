import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class ReqResetPasswordDTO {
    @ApiProperty()
    @MinLength(8)
    @MaxLength(14)
    @IsString()
    password: string;
}