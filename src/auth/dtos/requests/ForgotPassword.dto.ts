import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ReqForgotPasswordDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
}