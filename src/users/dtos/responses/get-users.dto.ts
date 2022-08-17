import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../users/interfaces/user.interface";

export class ResGetUserDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: UserRole;

    @ApiProperty()
    created_on: Date;

    @ApiProperty()
    last_login: Date;
    
    @ApiProperty()
    isEmailVerified: boolean;
}
