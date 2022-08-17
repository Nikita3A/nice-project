import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResForgotPasswordDTO {
    @ApiProperty()
    @IsEmail()
    link: string;
}