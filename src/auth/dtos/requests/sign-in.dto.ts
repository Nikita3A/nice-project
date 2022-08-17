import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ReqSignInDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty({
        minimum: 8,
    })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    password: string;
}