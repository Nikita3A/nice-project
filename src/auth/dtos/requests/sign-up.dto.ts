import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class ReqSignUpDTO {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(16)
    password: string;

    @ApiProperty()
    @MinLength(3)
    @MaxLength(20)
    name: string;
}