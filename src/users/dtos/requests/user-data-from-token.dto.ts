import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class UserDataFromTokenDTO {
    @ApiProperty()
    @MinLength(8)
    id: number;

    @ApiProperty()
    @MinLength(8)
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(8)
    role: string;
}
