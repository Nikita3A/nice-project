import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../users/interfaces/user.interface";

class User{
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty()
    role: UserRole;

    @ApiProperty()
    created_on: Date;

    @ApiProperty()
    last_login: Date;

    @ApiProperty()
    id: number;
}

export class ResSignUpDTO {
    @ApiProperty({ type: User })
    user: User;

    @ApiProperty()
    access_token: string;
    
    @ApiProperty()
    link: string; 
}